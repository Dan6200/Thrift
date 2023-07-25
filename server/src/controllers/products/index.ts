import { QueryResult, QueryResultRow } from 'pg'
import { RequestWithPayload } from '../../types-and-interfaces/request.js'
import { handleSortQuery } from '../helpers/generate-sql-commands/query-params-handler.js'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import processRoute from '../helpers/process-route.js'
import { StatusCodes } from 'http-status-codes'
import {
  ProductSchemaDB,
  ProductSchemaDBList,
} from '../../app-schema/products.js'
import db from '../../db/index.js'
import { validateResData } from '../helpers/query-validation.js'
import BadRequestError from '../../errors/bad-request.js'

/**
 * @param {QueryParams} {query}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 *
 **/
const getAllQuery = async <T>({
  query,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (query == null) throw new BadRequestError('Must provide a store id')
  const { storeId, sort, limit, offset } = query
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
						AS media FROM products p
					${sort ? `${handleSortQuery(<string>sort)}` : ''}
					${limit ? `LIMIT ${limit}` : ''}
					${offset ? `OFFSET ${offset}` : ''})
					AS product_data
				WHERE store_id=$1`
  return db.query({
    name: `fetch products${limit ? `, limit: ${limit}` : ''}${
      offset ? `, offset: ${offset}` : ''
    }`,
    text: dbQueryString,
    values: [storeId],
  })
}

/**
 * @param {QueryParams} {params}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
const getQuery = async ({
  params,
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
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

const processGetRoute = <ProcessRouteWithoutBody>processRoute
export const getProduct = processGetRoute({
  Query: getQuery,
  status: StatusCodes.OK,
  validateBody: undefined,
  validateResult: validateResData(ProductSchemaDB),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
export const getAllProducts = processGetAllRoute({
  Query: getAllQuery,
  status: StatusCodes.OK,
  validateBody: undefined,
  validateResult: validateResData(ProductSchemaDBList),
})
