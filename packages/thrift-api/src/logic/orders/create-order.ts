import { knex } from '#src/db/index.js'
import { Request, Response, NextFunction } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import UnauthenticatedError from '#src/errors/unauthenticated.js'
import NotFoundError from '#src/errors/not-found.js'
import InternalServerError from '#src/errors/internal-server.js'

export const createOrderLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.userId) {
    throw new UnauthenticatedError('Authentication required')
  }
  if (!req.validatedBody || !req.validatedQueryParams)
    throw new BadRequestError('Missing parameters')

  const { store_id, delivery_info_id } = req.validatedQueryParams
  const { items } = req.validatedBody

  if (!store_id || !items || items.length === 0) {
    throw new BadRequestError('Store ID and at least one item are required')
  }

  const trx = await knex.transaction()

  try {
    // Verify store exists and belongs to a vendor
    const store = await trx('stores').where({ store_id }).first()
    if (!store) {
      throw new NotFoundError('Store not found')
    }

    // Verify delivery info belongs to the user (if provided)
    if (delivery_info_id) {
      const deliveryInfo = await trx('delivery_info')
        .where({ delivery_info_id, customer_id: req.userId })
        .first()
      if (!deliveryInfo) {
        throw new BadRequestError('Invalid delivery information')
      }
    }

    const variantIds = items.map((item: any) => item.variant_id)

    const variants = await trx('product_variants')
      .whereIn('variant_id', variantIds)
      .select('variant_id', 'base_price')

    const inventory = await trx('product_variant_inventory')
      .whereIn('variant_id', variantIds)
      .select('variant_id', 'quantity_available')

    const variantsById = variants.reduce(
      (acc, v) => {
        acc[v.variant_id] = v
        return acc
      },
      {} as Record<number, { variant_id: number; base_price: number }>,
    )

    const inventoryById = inventory.reduce(
      (acc, i) => {
        acc[i.variant_id] = i
        return acc
      },
      {} as Record<number, { variant_id: number; quantity_available: number }>,
    )

    let total_amount = 0
    const orderItemsToInsert = []

    for (const item of items) {
      const variant = variantsById[item.variant_id]

      if (!variant) {
        throw new BadRequestError(
          `Variant with ID ${item.variant_id} not found`,
        )
      }

      const availableQuantity =
        inventoryById[item.variant_id]?.quantity_available || 0

      if (availableQuantity < item.quantity) {
        throw new BadRequestError(
          `Not enough stock for variant ${item.variant_id}. Available: ${availableQuantity}, Requested: ${item.quantity}`,
        )
      }

      const price_at_purchase = variant.base_price
      total_amount += price_at_purchase * item.quantity

      orderItemsToInsert.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase,
      })
    }

    const [order] = await trx('orders')
      .insert({
        customer_id: req.userId,
        store_id,
        delivery_info_id,
        total_amount,
        status: 'pending',
      })
      .returning('order_id')

    for (const orderItem of orderItemsToInsert) {
      await trx('order_items').insert({
        order_id: order.order_id,
        ...orderItem,
      })

      // Deduct from inventory
      await trx('inventory').insert({
        variant_id: orderItem.variant_id,
        quantity_change: -orderItem.quantity,
        reason: 'sale',
        notes: `Order ${order.order_id}`,
      })
    }

    await trx.commit()

    // Fetch the created order with its items for the response
    const createdOrder = await knex('orders')
      .where({ order_id: order.order_id })
      .first()

    const fetchedOrderItems = await knex('order_items')
      .where({ order_id: order.order_id })
      .select('order_item_id', 'variant_id', 'quantity', 'price_at_purchase')

    req.dbResult = { ...createdOrder, items: fetchedOrderItems }
    next()
  } catch (error) {
    await trx.rollback()
    throw new InternalServerError(error.toString())
  }
}
