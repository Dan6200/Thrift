import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '../request-validation.js'
import { validateDbResult } from '../db-result-validation.js'
import { sendResponse } from '../send-response.js'
import authenticateUser from '../authentication.js'
import { hasStoreAccess } from '../authorization/has-store-access.js'
import { addStaffHandler } from '#src/context/store-management/http/add-staff.js'
import { listStaffHandler } from '#src/context/store-management/http/list-staff.js'
import { updateStaffHandler } from '#src/context/store-management/http/update-staff.js'
import { removeStaffHandler } from '#src/context/store-management/http/remove-staff.js'
import {
  AddStoreStaffRequestSchema,
  ListStoreStaffRequestSchema,
  UpdateStoreStaffRequestSchema,
  RemoveStoreStaffRequestSchema,
  StoreStaffResponseSchema,
  StoreStaffListResponseSchema,
} from '../app-schema/store_staff.js'

const router = Router()
const { CREATED, OK, NO_CONTENT } = StatusCodes

router
  .route('/:storeId/staff')
  .post(
    authenticateUser,
    validate(AddStoreStaffRequestSchema),
    hasStoreAccess(['admin']),
    addStaffHandler,
    validateDbResult(StoreStaffResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    authenticateUser,
    validate(ListStoreStaffRequestSchema),
    hasStoreAccess(['admin', 'editor', 'viewer']),
    listStaffHandler,
    validateDbResult(StoreStaffListResponseSchema),
    sendResponse(OK),
  )

router
  .route('/:storeId/staff/:staffId')
  .patch(
    authenticateUser,
    validate(UpdateStoreStaffRequestSchema),
    hasStoreAccess(['admin']),
    updateStaffHandler,
    validateDbResult(StoreStaffResponseSchema),
    sendResponse(OK),
  )
  .delete(
    authenticateUser,
    validate(RemoveStoreStaffRequestSchema),
    hasStoreAccess(['admin']),
    removeStaffHandler,
    sendResponse(NO_CONTENT),
  )

export default router
