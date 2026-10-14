import joi from 'joi'
import { ProductFormType } from './types'

export const schema = joi
  .object<ProductFormType>({
    title: joi.string().trim().min(3).max(100).required().messages({
      'string.empty': 'Product title is required',
      'string.min': 'Product title must be at least 3 characters',
      'string.max': 'Product title must be at most 100 characters',
      'any.required': 'Product title is required',
    }),
    description: joi.string().trim().min(10).max(500).required().messages({
      'string.empty': 'Product description is required',
      'string.min': 'Product description must be at least 10 characters',
      'string.max': 'Product description must be at most 500 characters',
      'any.required': 'Product description is required',
    }),
    base_price: joi.number().integer().min(0).required().messages({
      'number.base': 'Base price must be a number',
      'number.integer': 'Base price must be an integer (kobo)',
      'number.min': 'Base price cannot be negative',
      'any.required': 'Base price is required',
    }),
    sku: joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'SKU is required',
      'string.max': 'SKU must be at most 100 characters',
      'any.required': 'SKU is required',
    }),
    category_id: joi.number().integer().min(1).required().messages({
      'number.base': 'Category is required',
      'number.integer': 'Category must be an integer',
      'number.min': 'Category is required',
      'any.required': 'Category is required',
    }),
    subcategory_id: joi.number().integer().min(1).required().messages({
      'number.base': 'Subcategory is required',
      'number.integer': 'Subcategory must be an integer',
      'number.min': 'Subcategory is required',
      'any.required': 'Subcategory is required',
    }),
    quantity_available: joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity cannot be negative',
      'any.required': 'Quantity is required',
    }),
  })
  .required()
