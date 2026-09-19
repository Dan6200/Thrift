import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '#src/request-validation.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { sendResponse } from '#src/send-response.js'
import authenticateUser from '#src/authentication.js'
import { hasStoreAccess } from '#src/authorization/has-store-access.js'
import {
  getAllProductsLogic,
  getProductLogic,
  updateProductLogic,
  deleteProductLogic,
} from '#src/logic/products/index.js'
import { createProductHandler } from '#src/context/catalog/http/create-product.js'
import {
  createVariantLogic,
  updateVariantLogic,
  deleteVariantLogic,
} from '#src/logic/products/variants/index.js'
import {
  ProductCreateRequestSchema,
  ProductGetAllRequestSchema,
  ProductGetRequestSchema,
  ProductUpdateRequestSchema,
  ProductDeleteRequestSchema,
  ProductGETAllResponseSchema,
  ProductGETResponseSchema,
  ProductResponseSchema,
} from '#src/app-schema/products/index.js'
import {
  ProductVariantCreateRequestSchema,
  ProductVariantUpdateRequestSchema,
  ProductVariantDeleteRequestSchema,
  ProductVariantResponseSchema,
} from '#src/app-schema/products/variants.js'

const router = express.Router({ mergeParams: true })
const { CREATED, OK, NO_CONTENT } = StatusCodes

router
  .route('/')
  .post(
    authenticateUser,
    validate(ProductCreateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    createProductHandler,
    validateDbResult(ProductResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    validate(ProductGetAllRequestSchema),
    getAllProductsLogic,
    validateDbResult(ProductGETAllResponseSchema),
    sendResponse(OK),
  )

router
  .route('/:productId')
  .get(
    validate(ProductGetRequestSchema),
    getProductLogic,
    validateDbResult(ProductGETResponseSchema),
    sendResponse(OK),
  )
  .patch(
    authenticateUser,
    validate(ProductUpdateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateProductLogic,
    validateDbResult(ProductResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(ProductDeleteRequestSchema),
    hasStoreAccess(['admin']),
    deleteProductLogic,
    sendResponse(NO_CONTENT),
  )

router
  .route('/:productId/variants')
  .post(
    authenticateUser,
    validate(ProductVariantCreateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    createVariantLogic,
    validateDbResult(ProductVariantResponseSchema),
    sendResponse(CREATED),
  )

router
  .route('/:productId/variants/:variantId')
  .patch(
    authenticateUser,
    validate(ProductVariantUpdateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateVariantLogic,
    validateDbResult(ProductVariantResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(ProductVariantDeleteRequestSchema),
    hasStoreAccess(['admin']),
    deleteVariantLogic,
    sendResponse(NO_CONTENT),
  )

export default router
