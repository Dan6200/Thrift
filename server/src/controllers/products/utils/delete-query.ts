/*
//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthorizedError from '../../../errors/unauthorized.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'
import { isValidDBResponse } from '../../../types-and-interfaces/response.js'
import {
  DeleteRecord,
  SelectRecord,
} from '../../helpers/generate-sql-commands/index.js'

/**
 * @param {QueryParams} { params, query, userId }
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Delete a product

export default async <T>({
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
*/
