import { knex } from '#src/db/index.js'
import { Request, Response, NextFunction } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import NotFoundError from '#src/errors/not-found.js'

export const updateVariantLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId, variantId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  const variantData = req.validatedBody!

  // Authorization for product/variant access is handled by preceding middleware

  const variant = await knex('product_variants as pv')
    .join('products as p', 'pv.product_id', 'p.product_id')
    .where({
      'pv.variant_id': variantId,
      'pv.product_id': productId,
      'p.store_id': storeId,
    })
    .first('pv.variant_id')

  if (!variant) {
    throw new NotFoundError('Variant not found for this product in this store.')
  }

  const {
    inventory_change_reason,
    inventory_change_notes,
    ...restOfVariantData
  } = variantData
  let { quantity_available, ...variantDataWithoutQA } = restOfVariantData

  const trx = await knex.transaction()
  try {
    let updatedVariant
    if (Object.keys(variantDataWithoutQA).length) {
      console.log('variant data without qa', variantDataWithoutQA)
      ;[updatedVariant] = await trx('product_variants')
        .where({ variant_id: variantId })
        .update(variantDataWithoutQA)
        .returning('*')
    }

    let currentQuantity = 0,
      quantityChange = 0
    if (quantity_available) {
      // Acquire a lock on the inventory for this variant within the transaction
      const inventoryRecords = await trx('inventory')
        .where({ variant_id: variantId })
        .select('quantity_change')
        .forUpdate()

      currentQuantity = inventoryRecords.reduce(
        (sum, record) => sum + record.quantity_change,
        0,
      )
      quantityChange = quantity_available - currentQuantity

      if (quantityChange !== 0) {
        if (!inventory_change_reason) {
          throw new BadRequestError(
            'Inventory change reason is required when updating quantity.',
          )
        }
        await trx('inventory').insert({
          variant_id: variantId,
          quantity_change: quantityChange,
          reason: inventory_change_reason,
          notes: inventory_change_notes,
        })
      }
      quantity_available = currentQuantity + quantityChange
    } else {
      ;({ quantity_available } = await trx('product_variant_inventory')
        .where({ variant_id: variantId })
        .first('quantity_available'))
    }

    // Fetch the full variant details for the response
    const options = await trx('variant_to_option_values as vtov')
      .join(
        'product_option_values as pov',
        'vtov.variant_value_id',
        'pov.option_value_id',
      )
      .join('product_options as po', 'pov.option_id', 'po.option_id')
      .where('vtov.variant_id', updatedVariant?.variant_id ?? variantId)
      .select(
        'po.option_id',
        'po.option_name',
        'pov.option_value_id',
        'pov.value',
      )

    await trx.commit()

    req.dbResult = {
      ...updatedVariant,
      options,
      quantity_available,
    }

    next()
  } catch (error) {
    await trx.rollback()
    throw error
  }
}
