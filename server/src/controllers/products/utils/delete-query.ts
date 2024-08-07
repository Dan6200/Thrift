//cspell:ignore jsonb
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'

/**
 * @param {QueryParams} { params, query, userId }
 * @returns {Promise<number>}
 * @description Delete a product
 */

export default async <T>({
  params,
  uid: vendorId,
}: QueryParams<T>): Promise<number> => {
  if (params == null) throw new BadRequestError('Must provide product id')
  const { productId } = params
  const response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length)
    throw new BadRequestError(
      'Must have a vendor account to be able to delete product'
    )
  return knex('products')
    .where('product_id', productId)
    .andWhere('vendor_id', vendorId)
    .del()
    .returning('product_id')
}
