import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../../errors/bad-request.js'
import { RequestWithPayload } from '../../../types-and-interfaces/request.js'
import { handleSortQuery } from '../../helpers/generate-sql-commands/query-params-handler.js'
import db from '../../../db/pg/index.js'
import { ProcessRouteWithoutBody } from '../../../types-and-interfaces/process-routes.js'
import processRoute from '../../helpers/process-route.js'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../types-and-interfaces/response.js'
import { ProductSchemaDBList } from '../../../app-schema/products.js'

const getAllQuery = async ({
	query: { sort, limit, offset },
}: RequestWithPayload): Promise<QueryResult<QueryResultRow>> => {
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
					from products`
	if (sort) {
		dbQueryString += ` ${handleSortQuery(<string>sort)}`
	}
	if (offset) dbQueryString += ` offset ${offset}`
	if (limit) dbQueryString += ` limit ${limit}`
	return db.query({ text: dbQueryString })
}

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
