import express from 'express'
import multer from 'multer'
import { cloudinaryStorageAvatars } from '#src/utils/media-storage.js'
import { createAvatarHandler } from '#src/context/media/http/create-avatar.js'
import { getAvatarHandler } from '#src/context/media/http/get-avatar.js'
import { updateAvatarHandler } from '#src/context/media/http/update-avatar.js'
import { deleteAvatarHandler } from '#src/context/media/http/delete-avatar.js'
import authenticateUser from '#src/authentication.js'
import { validate } from '#src/request-validation.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { sendResponse } from '#src/send-response.js'
import {
  AvatarRequestSchema,
  AvatarResponseSchema,
} from '#src/app-schema/media/avatar.js'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()
const upload = multer({ storage: cloudinaryStorageAvatars })
const { CREATED, OK, NO_CONTENT } = StatusCodes

router.use(authenticateUser)

router
  .route('/')
  .post(
    upload.single('avatar'),
    validate(AvatarRequestSchema),
    createAvatarHandler,
    validateDbResult(AvatarResponseSchema),
    sendResponse(CREATED),
  )
  .get(
    getAvatarHandler,
    validateDbResult(AvatarResponseSchema),
    sendResponse(OK),
  )
  .patch(
    upload.single('avatar'),
    validate(AvatarRequestSchema),
    updateAvatarHandler,
    validateDbResult(AvatarResponseSchema),
    sendResponse(OK),
  )
  .delete(deleteAvatarHandler, sendResponse(NO_CONTENT))

export default router
