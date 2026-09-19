import { knex } from '../../db/index.js'
import { Request, Response, NextFunction } from 'express'

export const getCartLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.userId) {
    throw new Error('User not authenticated')
  }

  let cart = await knex('shopping_cart')
    .where({ customer_id: req.userId })
    .first()

  if (!cart) {
    ;[cart] = await knex('shopping_cart')
      .insert({ customer_id: req.userId })
      .returning('*')
  }

  const cartItems = await knex('shopping_cart_item as sci')
    .join('product_variants as pv', 'sci.variant_id', 'pv.variant_id')
    .join('products as p', 'pv.product_id', 'p.product_id')
    .leftJoin('product_media_links as pml', function () {
      this.on('pv.variant_id', '=', 'pml.variant_id').andOn(
        'pml.is_thumbnail_image',
        '=',
        knex.raw('true'),
      )
    })
    .leftJoin('media as m', 'pml.media_id', 'm.media_id')
    .where('sci.cart_id', cart.cart_id)
    .select(
      'sci.item_id',
      'sci.variant_id',
      'sci.quantity',
      'sci.created_at',
      'sci.updated_at',
      'p.title as product_title',
      'pv.base_price as price',
      'm.filepath as image_url',
    )

  const total_items = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total_price = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const response = {
    cart_id: cart.cart_id,
    customer_id: cart.customer_id,
    items: cartItems,
    created_at: cart.created_at,
    updated_at: cart.updated_at,
    total_items,
    total_price,
  }

  req.dbResult = response
  next()
}
