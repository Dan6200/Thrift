//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import UnauthorizedError from '../../../errors/unauthorized.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'
import {
  isValidProductRequestData,
  ProductRequestData,
  ProductResponseData,
  ProductID,
} from '../../../types-and-interfaces/products.js'

/* @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<number>}
 * @description Update a product
 */
export default async <T>({
  params,
  body,
  uid: vendorId,
}: QueryParams<T>): Promise<number> => {
  if (params == null) throw new BadRequestError('Must provide a product id')

  const { productId } = params

  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const DBFriendlyProductData: Omit<ProductRequestData, 'description'> & {
    description: string
  } = {
    ...body,
    description: JSON.stringify(body.description),
  }

  return knex<ProductResponseData>('products')
    .where('product_id', productId)
    .update(DBFriendlyProductData)
    .returning('product_id')
}
