import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import UnauthorizedError from '../../../../errors/unauthorized.js'
import { QueryParams } from '../../../../types-and-interfaces/process-routes.js'
import { isValidDBResponse } from '../../../../types-and-interfaces/response.js'
import { SelectRecord } from '../../../helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../../helpers/generate-sql-commands/query-params-handler.js'

/**
 * @param {QueryParams} {query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 *
 **/
export default async <T>({
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
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name, s.subcategory_name
				FROM products p 
				JOIN categories c USING (category_id)
				JOIN subcategories s USING (subcategory_id)
				WHERE p.store_id=$1
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
