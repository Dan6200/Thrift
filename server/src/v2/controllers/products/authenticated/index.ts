import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
  ProductSchemaDB,
  ProductSchemaDBLean,
  ProductSchemaDBList,
  ProductSchemaReq,
} from '../../../app-schema/products.js'
import db from '../../../db/pg/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthenticatedError from '../../../errors/unauthenticated.js'
import {
  ProcessRouteWithBodyAndDBResult,
  ProcessRouteWithoutBody,
} from '../../../types-and-interfaces/process-routes.js'
import { Product } from '../../../types-and-interfaces/products.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
  DeleteInTable,
  InsertInTable,
  SelectFromTable,
  UpdateInTable,
} from '../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../helpers/generate-sql-commands/query-params-handler.js'
import processRoute from '../../helpers/process-route.js'

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Create a new product
 *
 */
const createQuery = async ({
  body,
  query: { store_id: storeId },
  user: { userId: vendorId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
  const dbQuery = await db.query({
    text: SelectFromTable('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthenticatedError('Cannot access store.')

  const productData: Product = body
  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  return db.query({
    text: InsertInTable(
      'products',
      [...Object.keys(DBFriendlyProductData), 'store_id', 'vendor_id'],
      'product_id'
    ),
    values: [...Object.values(DBFriendlyProductData), storeId, vendorId],
  })
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 *
 **/
const getAllQuery = async ({
  query: { store_id: storeId, sort, limit, offset },
  user: { userId: vendorId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
  const dbQuery = await db.query({
    text: SelectFromTable('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthenticatedError('Cannot access store.')
  let dbQueryString = `
		select products.*, 
			(select json_agg(media) from 
				(select filename, 
					filepath, description from 
						product_media 
							where 
								product_id=products.product_id)
							as media) 
						as media 
					from products 
				where store_id=$1`
  if (sort) {
    dbQueryString += ` ${handleSortQuery(<string>sort)}`
  }
  if (offset) dbQueryString += ` offset ${offset}`
  if (limit) dbQueryString += ` limit ${limit}`
  return db.query({ text: dbQueryString, values: [storeId] })
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
const getQuery = async ({
  params: { productId },
  query: { store_id: storeId },
  user: { userId: vendorId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
  const dbQuery = await db.query({
    text: SelectFromTable('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthenticatedError('Cannot access store.')
  return db.query({
    text: `select products.*, 
				(select json_agg(media) from 
					(select filename, 
						filepath, description from 
							product_media 
							where product_id=$1)
						as media) 
					as media 
				from products 
			where product_id=$1 and store_id=$2`,
    values: [productId, storeId],
  })
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Update a product
 * */
const updateQuery = async ({
  params: { productId },
  query: { store_id: storeId },
  body,
  user: { userId: vendorId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
  const dbQuery = await db.query({
    text: SelectFromTable('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthenticatedError('Cannot access store.')
  const productData: Product = body
  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }
  const updateCommand = UpdateInTable(
    'products',
    'product_id',
    Object.keys(DBFriendlyProductData),
    3,
    `product_id=$1 and store_id=$2`
  )

  return db.query({
    text: updateCommand,
    values: [+productId, +storeId!, ...Object.values(DBFriendlyProductData)],
  })
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Delete a product
 * */
const deleteQuery = async ({
  params: { productId },
  query: { store_id: storeId },
  user: { userId: vendorId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
  const dbQuery = await db.query({
    text: SelectFromTable('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthenticatedError('Cannot access store.')
  return db.query({
    text: DeleteInTable(
      'products',
      'product_id',
      'product_id=$1 and store_id=$2'
    ),
    values: [+productId, +storeId!],
  })
}

/**
 * @param {T} data
 * @returns {Promise<any>}
 * @description Validate the request body
 * */
const validateBody = async <T>(data: T): Promise<any> => {
  const validData = ProductSchemaReq.validate(data)
  if (validData.error)
    throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
  return validData.value
}

const { CREATED, OK, NOT_FOUND } = StatusCodes

/**
 * @param {QueryResult<any>} result
 * @returns {Promise<ResponseData>}
 * @description Validate a list of products
 * */
const validateResultList = async (
  result: QueryResult<any>
): Promise<ResponseData> => {
  if (!result.rows.length)
    return {
      status: NOT_FOUND,
      data: 'No Product found. Please create a product.',
    }
  const validateDbResult = ProductSchemaDBList.validate(result.rows)
  if (validateDbResult.error)
    throw new BadRequestError(
      'Invalid Data from DB: ' + validateDbResult.error.message
    )
  return {
    data: validateDbResult.value,
  }
}

/**
 * @param {QueryResult<any>} result
 * @returns {Promise<ResponseData>}
 * @description Checks if the query was successful, and Id is returned
 * */
const checkSuccess = async (
  result: QueryResult<any>
): Promise<ResponseData> => {
  if (!result.rows.length) throw new BadRequestError('Operation unsuccessful')
  const validateDbResult = ProductSchemaDBLean.validate(result.rows[0])
  if (validateDbResult.error)
    throw new BadRequestError(
      'Operation unsuccessful: ' + validateDbResult.error.message
    )
  return {
    data: validateDbResult.value,
  }
}

/**
 * @param {QueryResult<any>} result
 * @returns {Promise<ResponseData>}
 * @description Validate the retrieved product.
 * */
const validateResult = async (
  result: QueryResult<any>
): Promise<ResponseData> => {
  if (!result.rows.length)
    return {
      status: NOT_FOUND,
      data: 'Product not found',
    }
  const validateDbResult = ProductSchemaDB.validate(result.rows[0])
  if (validateDbResult.error)
    throw new BadRequestError(
      'Invalid Data from DB: ' + validateDbResult.error.message
    )
  return {
    data: validateDbResult.value,
  }
}

const processPostRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const processGetIDRoute = <ProcessRouteWithoutBody>processRoute
const processPutRoute = <ProcessRouteWithBodyAndDBResult>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

const createProduct = processPostRoute(
  createQuery,
  CREATED,
  validateBody,
  checkSuccess
)

const getAllProducts = processGetAllRoute(
  getAllQuery,
  OK,
  undefined,
  validateResultList
)

const getProduct = processGetIDRoute(getQuery, OK, undefined, validateResult)

const updateProduct = processPutRoute(
  updateQuery,
  OK,
  validateBody,
  checkSuccess
)

const deleteProduct = processDeleteRoute(
  deleteQuery,
  OK,
  undefined,
  checkSuccess
)

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
