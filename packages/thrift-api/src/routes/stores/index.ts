import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '../../request-validation.js'
import { validateDbResult } from '../../db-result-validation.js'
import { sendResponse } from '../../send-response.js'
import authenticateUser from '../../authentication.js'
import { vendorAuthorization } from '../../authorization/vendor-authorization.js'
import { checkStoreLimit } from '../../authorization/check-store-limit.js'
import { hasStoreAccess } from '../../authorization/has-store-access.js'
import { createStoreHandler } from '#src/context/store-management/http/create-store.js'
import { getAllStoresHandler } from '#src/context/store-management/http/get-all-stores.js'
import { getStoreHandler } from '#src/context/store-management/http/get-store.js'
import { updateStoreHandler } from '#src/context/store-management/http/update-store.js'
import { deleteStoreHandler } from '#src/context/store-management/http/delete-store.js'
import {
  StoreCreateRequestSchema,
  StoreGetAllRequestSchema,
  StoreGetRequestSchema,
  StoreUpdateRequestSchema,
  StoreDeleteRequestSchema,
  StoreDataResponseListSchema,
  StoreDataResponseSchema,
} from '../../app-schema/stores.js'

const router = express.Router()
const { CREATED, OK, NO_CONTENT } = StatusCodes

router
  .route('/')
  .post(
    authenticateUser,
    validate(StoreCreateRequestSchema),
    vendorAuthorization,
    checkStoreLimit,
    createStoreHandler,
    validateDbResult(StoreDataResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    authenticateUser,
    validate(StoreGetAllRequestSchema),
    vendorAuthorization,
    getAllStoresHandler,
    validateDbResult(StoreDataResponseListSchema),
    sendResponse(OK),
  )

router
  .route('/:storeId')
  .get(
    authenticateUser,
    validate(StoreGetRequestSchema),
    hasStoreAccess(['admin', 'editor', 'viewer']),
    getStoreHandler,
    validateDbResult(StoreDataResponseSchema),
    sendResponse(OK),
  )
  .patch(
    authenticateUser,
    validate(StoreUpdateRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateStoreHandler,
    validateDbResult(StoreDataResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(StoreDeleteRequestSchema),
    hasStoreAccess(['admin']),
    deleteStoreHandler,
    sendResponse(NO_CONTENT),
  )

export default router
