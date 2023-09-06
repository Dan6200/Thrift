import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import UnauthorizedError from '../../../../errors/unauthorized.js'
import { QueryParams } from '../../../../types-and-interfaces/process-routes.js'
import { isValidDBResponse } from '../../../../types-and-interfaces/response.js'
import { SelectRecord } from '../../../helpers/generate-sql-commands/index.js'

/**
 * @param {QueryParams} {params, query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export default async <T>({
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
		(SELECT JSON_AGG(media_data) FROM
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name AS category, s.subcategory_name AS subcategory
				FROM products p 
				JOIN categories c USING (category_id)
				JOIN subcategories s USING (subcategory_id)
			WHERE p.product_id=$1 AND store_id=$2`,
    values: [productId, storeId],
  })
}
