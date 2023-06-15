import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import assert from 'node:assert/strict'
import Joi from 'joi'
import {
  StoreSchemaReq,
  StoreSchemaDB,
  UpdateStoreSchemaReq,
} from '../../../../app-schema/vendor/store.js'
import db from '../../../../db/index.js'
import { BadRequestError } from '../../../../errors/index.js'
import {
  RequestWithPayload,
  RequestUserPayload,
} from '../../../../types-and-interfaces/request.js'
import { Insert, Update } from '../../../helpers/generate-sql-commands/index.js'

const createStore = async (request: RequestWithPayload, response: Response) => {
  // check if vendor account exists
  const { userId }: RequestUserPayload = request.user
  const res = await db.query(
    'select vendor_id from vendors where vendor_id=$1',
    [userId]
  )
  if (res.rowCount === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  const vendorId = res.rows[0].vendor_id
  // limit amount of stores to 5...
  const LIMIT = 5
  let recordCount: number = <number>(
    (await db.query('select 1 from stores where vendor_id=$1', [vendorId]))
      .rowCount
  )
  let overLimit: boolean = LIMIT <= recordCount
  if (overLimit)
    throw new BadRequestError(`Each vendor is limited to only ${LIMIT} stores`)
  let validData = StoreSchemaReq.validate(request.body)
  if (validData.error)
    throw new BadRequestError('Invalid data schema: ' + validData.error)
  const storeData = validData.value
  let store = (
    await db.query(
      `${Insert('stores', [
        'vendor_id',
        ...Object.keys(storeData),
      ])} returning *`,
      [vendorId, ...Object.values(storeData)]
    )
  ).rows[0]
  Joi.assert(store, StoreSchemaDB)
  response.status(StatusCodes.CREATED).json(store)
}

const getAllStores = async (
  request: RequestWithPayload,
  response: Response
) => {
  const { userId }: RequestUserPayload = request.user
  const res = await db.query(
    'select vendor_id from vendors where vendor_id=$1',
    [userId]
  )
  if (res.rowCount === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  const vendorId = res.rows[0].vendor_id
  const stores = (
    await db.query(`select * from stores where vendor_id=$1`, [vendorId])
  ).rows
  if (stores.length === 0)
    return response
      .status(StatusCodes.NOT_FOUND)
      .send('Vendor has no stores available')
  Joi.assert(stores[0], StoreSchemaDB)
  response.status(StatusCodes.OK).send(stores)
}

const getStore = async (request: RequestWithPayload, response: Response) => {
  const { userId }: RequestUserPayload = request.user
  const res = await db.query(
    'select vendor_id from vendors where vendor_id=$1',
    [userId]
  )
  if (res.rowCount === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  const { storeId } = request.params
  const store = (
    await db.query(`select * from stores where store_id=$1`, [storeId])
  ).rows[0]
  if (!store)
    return response
      .status(StatusCodes.NOT_FOUND)
      .send('Shipping Information cannot be found')
  response.status(StatusCodes.OK).send(store)
}

const updateStore = async (request: RequestWithPayload, response: Response) => {
  const { userId }: RequestUserPayload = request.user
  const res = await db.query(
    'select vendor_id from vendors where vendor_id=$1',
    [userId]
  )
  if (res.rowCount === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  const { storeId } = request.params
  let validData = UpdateStoreSchemaReq.validate(request.body)
  if (validData.error)
    throw new BadRequestError('Invalid request data' + validData.error.message)
  const storeData = validData.value
  let fields = Object.keys(storeData),
    data = Object.values(storeData)
  const store = (
    await db.query(
      `${Update('stores', 'store_id', fields)} returning store_id`,
      [storeId, ...data]
    )
  ).rows[0]
  if (!store) throw new BadRequestError('Put request was unsuccessful')
  response.status(StatusCodes.OK).send(store)
}

const deleteStore = async (request: RequestWithPayload, response: Response) => {
  const { userId }: RequestUserPayload = request.user
  const res = await db.query(
    'select vendor_id from vendors where vendor_id=$1',
    [userId]
  )
  if (res.rowCount === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  const { storeId } = request.params
  await db.query(
    `delete from stores
			where store_id=$1`,
    [storeId]
  )
  response.status(StatusCodes.NO_CONTENT).send()
}

export { createStore, getStore, getAllStores, updateStore, deleteStore }
