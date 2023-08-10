import { QueryResult, QueryResultRow } from 'pg'
import db from '../../db/index.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import { QueryParams } from '../../types-and-interfaces/process-routes.js'
import {
  isValidProductData,
  Product,
} from '../../types-and-interfaces/products.js'
import { isValidDBResponse } from '../../types-and-interfaces/response.js'
import {
  DeleteRecord,
  InsertRecord,
  SelectRecord,
  UpdateRecord,
} from '../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../helpers/generate-sql-commands/query-params-handler.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>} - The database response
 * @description Create a new product
 *
 */
export const createQuery = async <T>({
  body,
  query,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { storeId } = query
  const dbResponse = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbResponse))
    throw new BadRequestError('Invalid response from database')
  if (!dbResponse.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbResponse.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  if (!isValidProductData(body))
    throw new BadRequestError('Invalid product data')
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
 * @param {QueryParams} {query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 *
 **/
export const getAllQueryProtected = async <T>({
  query,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { storeId, sort, limit, offset } = query
  const dbResponse = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbResponse))
    throw new BadRequestError('Invalid response from database')
  if (!dbResponse.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbResponse.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  let dbQueryString = `
	WITH product_data AS (
	 SELECT p.*, 
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
				AS media FROM products p WHERE p.store_id=$1
			${sort ? `${handleSortQuery(<string>sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products, 
	(SELECT COUNT(*) FROM products 
				WHERE store_id=$1) AS total_products FROM product_data;`
  return db.query({
    text: dbQueryString,
    values: [storeId],
  })
}

/**
 * @param {QueryParams} {params, query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export const getQueryProtected = async <T>({
  params,
  query,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('Must provide a product id')
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { productId } = params
  const { storeId } = query
  const dbResponse = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbResponse))
    throw new BadRequestError('Invalid response from database')
  if (!dbResponse.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbResponse.rows[0].vendor_id !== vendorId)
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
 * @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Update a product
 * */
export const updateQuery = async <T>({
  params,
  query,
  body,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('Must provide a product id')
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { productId } = params
  const { storeId } = query
  const dbResponse: unknown = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbResponse))
    throw new BadRequestError('Invalid response from database')
  if (!dbResponse.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbResponse.rows[0].vendor_id !== vendorId)
    throw new UnauthorizedError('Cannot access store.')
  if (!isValidProductData(body))
    throw new BadRequestError('Invalid product data')
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
 * @param {QueryParams} { params, query, userId }
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Delete a product
 * */
export const deleteQuery = async <T>({
  params,
  query,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('Must provide product id')
  const { productId } = params
  if (query == null) throw new BadRequestError('Must provide store id')
  const { storeId } = query
  const dbResponse: unknown = await db.query({
    text: SelectRecord('stores', ['vendor_id'], 'store_id=$1'),
    values: [storeId],
  })
  if (!isValidDBResponse(dbResponse))
    throw new BadRequestError('Error while deleting product. Please try again')
  if (!dbResponse.rows.length)
    throw new BadRequestError(
      'No store found for this product. First create a store'
    )
  if (dbResponse.rows[0].vendor_id !== vendorId)
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

/**
 * @description Retrieve all products
 *
 **/
export const getAllQuery = async <T>(
  qp: QueryParams<T>
): Promise<QueryResult<QueryResultRow>> => {
  // if route is protected, use getAllQueryProtected
  if (!qp.query?.public) {
    return getAllQueryProtected(qp)
  }
  const { query } = qp
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { sort, limit, offset } = query
  let dbQueryString = `
	WITH product_data AS (
	 SELECT p.*, 
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
				AS media FROM products p
			${sort ? `${handleSortQuery(<string>sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products, 
(SELECT COUNT(*) FROM products) AS total_products FROM product_data;`
  return db.query({
    // Make a prepared statement to cache the query
    name: `fetch-products${limit ? `-limit:${limit}` : ''}${
      offset ? `-offset:${offset}` : ''
    }${sort ? `-sort:${sort.toString()}` : ''}`,
    text: dbQueryString,
  })
}

export const getAllQueryForwarder = <T>(
  routeIsPublic: string | undefined
): ((qp: QueryParams<T>) => Promise<QueryResult<QueryResultRow>>) => {
  if (routeIsPublic === 'true') {
    return getAllQuery
  }
  return getAllQueryProtected
}

export const getQueryForwarder = <T>(
  routeIsPublic: string | undefined
): ((qp: QueryParams<T>) => Promise<QueryResult<QueryResultRow>>) => {
  if (routeIsPublic === 'true') {
    return getQuery
  }
  return getQueryProtected
}

/**
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export const getQuery = async <T>(
  qp: QueryParams<T>
): Promise<QueryResult<QueryResultRow>> => {
  // if route is protected, use getQueryProtected
  if (!qp.query?.public) {
    return getQueryProtected(qp)
  }
  const { params } = qp
  if (params == null) throw new BadRequestError('Must provide a product id')
  const { productId } = params
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
			WHERE p.product_id=$1;`,
    values: [productId],
  })
}
