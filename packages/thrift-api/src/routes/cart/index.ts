import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '#src/request-validation.js'
import { validateDbResult } from '#src/db-result-validation.js'
import { sendResponse } from '#src/send-response.js'
import authenticateUser from '#src/authentication.js'
import { getCartHandler } from '#src/context/cart/http/get-cart.js'
import { addItemHandler } from '#src/context/cart/http/add-item.js'
import { updateItemHandler } from '#src/context/cart/http/update-item.js'
import { removeItemHandler } from '#src/context/cart/http/remove-item.js'
import {
  GetCartRequestSchema,
  AddItemToCartRequestSchema,
  UpdateCartItemRequestSchema,
  RemoveCartItemRequestSchema,
  cartResponseSchema,
  cartItemResponseSchema,
} from '#src/app-schema/cart.js'
import { customerAuthorization } from '#src/authorization/customer-authorization.js'

const router = Router()
const { OK, CREATED, NO_CONTENT } = StatusCodes

router.get(
  '/',
  authenticateUser,
  customerAuthorization,
  validate(GetCartRequestSchema),
  getCartHandler,
  validateDbResult(cartResponseSchema),
  sendResponse(OK),
)

router.post(
  '/items',
  authenticateUser,
  customerAuthorization,
  validate(AddItemToCartRequestSchema),
  addItemHandler,
  validateDbResult(cartItemResponseSchema),
  sendResponse(CREATED),
)

router.put(
  '/items/:itemId',
  authenticateUser,
  customerAuthorization,
  validate(UpdateCartItemRequestSchema),
  updateItemHandler,
  validateDbResult(cartItemResponseSchema),
  sendResponse(OK),
)

router.delete(
  '/items/:itemId',
  authenticateUser,
  customerAuthorization,
  validate(RemoveCartItemRequestSchema),
  removeItemHandler,
  sendResponse(NO_CONTENT),
)

export default router
