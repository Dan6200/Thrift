import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '#src/request-validation.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { sendResponse } from '#src/send-response.js'
import authenticateUser from '#src/authentication.js'
import { hasStoreAccess } from '#src/authorization/has-store-access.js'
import { createProductHandler } from '#src/context/catalog/http/create-product.js'
import { getAllProductsHandler } from '#src/context/catalog/http/get-all-products.js'
import { getProductHandler } from '#src/context/catalog/http/get-product.js'
import { updateProductHandler } from '#src/context/catalog/http/update-product.js'
import { deleteProductHandler } from '#src/context/catalog/http/delete-product.js'
import { createVariantHandler } from '#src/context/catalog/http/create-variant.js'
import { updateVariantHandler } from '#src/context/catalog/http/update-variant.js'
import { deleteVariantHandler } from '#src/context/catalog/http/delete-variant.js'
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
    getAllProductsHandler,
    validateDbResult(ProductGETAllResponseSchema),
    sendResponse(OK),
  )

router
  .route('/:productId')
  .get(
    validate(ProductGetRequestSchema),
    getProductHandler,
    validateDbResult(ProductGETResponseSchema),
    sendResponse(OK),
  )
  .patch(
    authenticateUser,
    validate(ProductUpdateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateProductHandler,
    validateDbResult(ProductResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(ProductDeleteRequestSchema),
    hasStoreAccess(['admin']),
    deleteProductHandler,
    sendResponse(NO_CONTENT),
  )

router
  .route('/:productId/variants')
  .post(
    authenticateUser,
    validate(ProductVariantCreateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    createVariantHandler,
    validateDbResult(ProductVariantResponseSchema),
    sendResponse(CREATED),
  )

router
  .route('/:productId/variants/:variantId')
  .patch(
    authenticateUser,
    validate(ProductVariantUpdateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateVariantHandler,
    validateDbResult(ProductVariantResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(ProductVariantDeleteRequestSchema),
    hasStoreAccess(['admin']),
    deleteVariantHandler,
    sendResponse(NO_CONTENT),
  )

export default router
