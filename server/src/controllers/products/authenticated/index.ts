import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import {
  ProductSchemaDB,
  ProductSchemaDBID,
  ProductSchemaDBList,
  ProductSchemaReq,
} from '../../../app-schema/products.js'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthorizedError from '../../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
} from '../../../types-and-interfaces/process-routes.js'
import { Product } from '../../../types-and-interfaces/products.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { isValidDBResponse } from '../../../types-and-interfaces/response.js'
import {
  DeleteRecord,
  InsertRecord,
  SelectRecord,
  UpdateRecord,
} from '../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../helpers/generate-sql-commands/query-params-handler.js'
import processRoute from '../../helpers/process-route.js'
import {
  validateReqData,
  validateResData,
} from '../../helpers/query-validation.js'

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
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbQuery))
    throw new BadRequestError('Invalid response from database')
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')

  const productData: Product = body
  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  return db.query({
    text: InsertRecord(
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
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbQuery))
    throw new BadRequestError('Invalid response from database')
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  let dbQueryString = `
		SELECT JSON_AGG(product_data) AS products,
		 COUNT(product_data) AS total_products FROM
			(SELECT p.*, 
				(SELECT JSON_AGG(media_data) FROM
					(SELECT pm.filename,
						 CASE WHEN pdi.filename IS NOT NULL
							THEN TRUE ELSE FALSE END AS is_display_image,
							 filepath, description FROM
								product_media pm
								LEFT JOIN product_display_image pdi
								USING (filename)
								WHERE
								pm.product_id=p.product_id)
							AS media_data) 
						AS media FROM products p)
					AS product_data
				WHERE store_id=$1;`
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
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbQuery))
    throw new BadRequestError('Invalid response from database')
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  return db.query({
    text: `SELECT p.*, 
				(SELECT JSON_AGG(media) FROM 
					(SELECT pm.filename, 
					 CASE WHEN pdi.filename IS NOT NULL 
					  THEN true ELSE false END
					   AS is_display_image,
							filepath, description FROM 
							 product_media pm
							  LEFT JOIN product_display_image pdi
							 USING (filename)
							WHERE pm.product_id=p.product_id)
						AS media) 
					AS media 
				FROM products p
			WHERE p.product_id=$1 AND store_id=$2`,
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
  const dbQuery: unknown = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbQuery))
    throw new BadRequestError('Invalid response from database')
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  const productData: Product = body
  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }
  const updateCommand = UpdateRecord(
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
  const dbQuery: unknown = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbQuery))
    throw new BadRequestError('Error while deleting product. Please try again')
  if (!dbQuery.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbQuery.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  return db.query({
    text: DeleteRecord(
      'products',
      ['product_id'],
      'product_id=$1 and store_id=$2'
    ),
    values: [+productId, +storeId!],
  })
}

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const processGetRoute = <ProcessRouteWithoutBody>processRoute
const processPutRoute = <ProcessRoute>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

//cspell:ignore DBID
const createProduct = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ProductSchemaReq),
  validateResult: validateResData(ProductSchemaDBID),
})

const getAllProducts = processGetAllRoute({
  Query: getAllQuery,
  status: OK,
  validateBody: undefined,
  validateResult: validateResData(ProductSchemaDBList),
})

const getProduct = processGetRoute({
  Query: getQuery,
  status: OK,
  validateBody: undefined,
  validateResult: validateResData(ProductSchemaDB),
})

const updateProduct = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ProductSchemaReq),
  validateResult: validateResData(ProductSchemaDBID),
})

const deleteProduct = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateBody: undefined,
  validateResult: validateResData(ProductSchemaDBID),
})

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
