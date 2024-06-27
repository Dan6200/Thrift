/*
//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthorizedError from '../../../errors/unauthorized.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'
import { isValidProductData } from '../../../types-and-interfaces/products.js'
import { isValidDBResponse } from '../../../types-and-interfaces/response.js'
import {
  InsertRecord,
  SelectRecord,
} from '../../helpers/generate-sql-commands/index.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>} - The database response
 * @description Create a new product
 *
export default async <T>({
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

  const productData = body

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
*/
