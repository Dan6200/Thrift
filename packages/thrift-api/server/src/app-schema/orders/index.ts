import Joi from 'joi'

// Base Schemas
export const OrderItemDataSchema = Joi.object({
  variant_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required(),
})

export const OrderDataSchema = Joi.object({
  delivery_info_id: Joi.number().integer().positive().allow(null),
  items: Joi.array().items(OrderItemDataSchema).min(1).required(),
})

// Request Schemas
export const CreateOrderRequestSchema = Joi.object({
  body: OrderDataSchema.required(),
  query: Joi.object({
    store_id: Joi.number().integer().positive().required(),
  }).required(),
  params: Joi.object().optional(),
})

export const GetOrderRequestSchema = Joi.object({
  body: Joi.object().optional(),
  params: Joi.object({
    order_id: Joi.number().integer().positive().required(),
  }).required(),
  query: Joi.object().optional(),
})

export const GetAllOrdersRequestSchema = Joi.object({
  body: Joi.object().optional(),
  params: Joi.object().optional(),
  query: Joi.object({
    store_id: Joi.number().integer().positive().required(),
  }).required(),
})

export const FindReviewableItemRequestSchema = Joi.object({
  body: Joi.object().optional(),
  params: Joi.object().optional(),
  query: Joi.object({
    product_id: Joi.number().integer().positive().required(),
  }).required(),
})

export const UpdateOrderRequestSchema = Joi.object({
  body: OrderDataSchema.required(),
  params: Joi.object({
    order_id: Joi.number().integer().positive().required(),
  }).required(),
  query: Joi.object().optional(),
})

export const DeleteOrderRequestSchema = GetOrderRequestSchema

// Response Schemas
export const OrderResponseSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  customer_id: Joi.string().uuid().required(),
  store_id: Joi.number().integer().positive().required(),
  delivery_info_id: Joi.number().integer().positive().allow(null).required(),
  order_date: Joi.date().iso().required(),
  total_amount: Joi.number().precision(2).positive().required(),
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),
  payment_reference: Joi.string().optional().allow(null),
  created_at: Joi.date().iso().required(),
  updated_at: Joi.date().iso().required(),
  items: Joi.array()
    .items(
      Joi.object({
        order_id: Joi.number().integer().positive().optional(),
        order_item_id: Joi.number().integer().positive().required(),
        variant_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        price_at_purchase: Joi.number().precision(2).positive().required(),
      }),
    )
    .required(),
})

export const OrderGETAllResponseSchema = Joi.array().items(OrderResponseSchema)

export const FindReviewableItemResponseSchema = Joi.object({
  order_item_id: Joi.number().integer().positive().required(),
})
