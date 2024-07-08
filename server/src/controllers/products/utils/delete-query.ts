//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'

/**
 * @param {QueryParams} { params, query, userId }
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Delete a product
 */

export default async <T>({
  params,
  uid: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('Must provide product id')
  const { productId } = params
  return knex('products')
    .where('product_id', productId)
    .andWhere('vendor_id', vendorId)
    .del()
}
