/**
//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import db from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthorizedError from '../../../errors/unauthorized.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'
import { isValidProductData } from '../../../types-and-interfaces/products.js'
import { isValidDBResponse } from '../../../types-and-interfaces/response.js'
import {
  UpdateRecord,
  SelectRecord,
} from '../../helpers/generate-sql-commands/index.js'

 * @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>} {Promise<QueryResult<QueryResultRow>>}
 * @description Update a product
export default async <T>({
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

  const {
    category_id: categoryId,
    subcategory_id: subcategoryId,
    ...productData
  } = body

  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  let updateCommand = UpdateRecord(
    'products',
    Object.keys(DBFriendlyProductData),
    3,
    `product_id=$1 and store_id=$2`,
    ['product_id']
  )

  return db.query({
    text: updateCommand,
    values: [+productId, +storeId!, ...Object.values(DBFriendlyProductData)],
  })
}
 * */
