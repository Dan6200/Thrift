import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../../errors/bad-request.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { handleSortQuery } from '../../helpers/generate-sql-commands/query-params-handler.js'
import db from '../../../db/pg/index.js'
import { ProcessRouteWithoutBody } from '../../../types-and-interfaces/process-routes.js'
import processRoute from '../../helpers/process-route.js'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import {
	ProductSchemaDB,
	ProductSchemaDBList,
} from '../../../app-schema/products.js'

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 *
 **/
const getAllQuery = async ({
	query: { sort, limit, offset },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	let dbQueryString = `
		SELECT products.*,
		 (SELECT JSON_AGG(media) FROM
		  (SELECT pm.filename,
			 CASE WHEN pdi.filename IS NOT NULL 
			  THEN TRUE ELSE FALSE END AS is_display_image,
			   filepath, description FROM
				  product_media pm
					 LEFT JOIN product_display_image pdi
				   USING (filename)
				  WHERE
				 pm.product_id=products.product_id)
				AS media)
			 AS media
			FROM products`
	if (sort) {
		dbQueryString += ` ${handleSortQuery(<string>sort)}`
	}
	if (offset) dbQueryString += ` OFFSET ${offset}`
	if (limit) dbQueryString += ` LIMIT ${limit}`
	return db.query({ text: dbQueryString })
}

/**
 * @param {RequestWithPayload} req
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
const getQuery = async ({
	params: { productId },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
	return db.query({
		text: `SELECT products.*, 
				(SELECT JSON_AGG(media) FROM 
					(SELECT pm.filename, 
					 CASE WHEN pdi.filename IS NOT NULL 
					  THEN true ELSE false END
					   AS is_display_image,
							filepath, description FROM 
							 product_media pm
							  LEFT JOIN product_display_image pdi
							 USING (filename)
							WHERE product_id=$1)
						AS media) 
					AS media 
				FROM products 
			WHERE product_id=$1`,
		values: [productId],
	})
}

const processGetRoute = <ProcessRouteWithoutBody>processRoute
export const getProduct = processGetRoute(
	getQuery,
	StatusCodes.OK,
	undefined,
	validateResult
)

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
export const getAllProducts = processGetAllRoute(
	getAllQuery,
	StatusCodes.OK,
	undefined,
	validateResultList
)

/**
 * @param {QueryResult<any>} result
 * @returns {Promise<ResponseData>}
 * @description Validate a list of products
 * */
async function validateResultList(
	result: QueryResult<any>
): Promise<ResponseData> {
	if (!result.rows.length)
		return {
			status: StatusCodes.NOT_FOUND,
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
 * @description Validate the retrieved product.
 * */
async function validateResult(result: QueryResult<any>): Promise<ResponseData> {
	if (!result.rows.length)
		return {
			status: StatusCodes.NOT_FOUND,
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
