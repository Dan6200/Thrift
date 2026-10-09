import express from 'express'
import multer from 'multer'
import { cloudinaryStorageProducts } from '#src/utils/media-storage.js'
import { createProductMediaHandler } from '#src/context/media/http/create-product-media.js'
import { getProductMediaHandler } from '#src/context/media/http/get-product-media.js'
import { updateProductMediaHandler } from '#src/context/media/http/update-product-media.js'
import { deleteProductMediaHandler } from '#src/context/media/http/delete-product-media.js'
import authenticateUser from '#src/authentication.js'
import { validate } from '#src/request-validation.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { sendResponse } from '#src/send-response.js'
import {
  CreateProductMediaRequestSchema,
  GetProductMediaRequestSchema,
  ProductMediaResponseSchema,
  UpdateProductMediaRequestSchema,
  DeleteProductMediaRequestSchema,
} from '#src/app-schema/media/products.js'
import { StatusCodes } from 'http-status-codes'
import { hasStoreAccess } from '#src/authorization/has-store-access.js'
import Joi from 'joi'

const router = express.Router()
const upload = multer({ storage: cloudinaryStorageProducts })
const uploadLimit = 12
const { CREATED, OK, NO_CONTENT } = StatusCodes

router.use(authenticateUser)

router
  .route('/')
  .post(
    upload.array('product-media', uploadLimit),
    validate(CreateProductMediaRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    createProductMediaHandler,
    validateDbResult(Joi.array().items(ProductMediaResponseSchema)),
    sendResponse(CREATED),
  )

router
  .route('/:mediaId')
  .get(
    validate(GetProductMediaRequestSchema),
    getProductMediaHandler,
    validateDbResult(Joi.array().items(ProductMediaResponseSchema)),
    sendResponse(OK),
  )
  .patch(
    upload.single('product-media'),
    validate(UpdateProductMediaRequestSchema),
    hasStoreAccess(['admin', 'editor']),
    updateProductMediaHandler,
    validateDbResult(ProductMediaResponseSchema),
    sendResponse(OK),
  )
  .delete(
    validate(DeleteProductMediaRequestSchema),
    hasStoreAccess(['admin']),
    deleteProductMediaHandler,
    sendResponse(NO_CONTENT),
  )

export default router
