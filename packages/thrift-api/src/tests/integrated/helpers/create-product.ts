import chai from 'chai'
import { productFactory } from '../factories/index.js'

export async function* createProductsForTesting(
  token: string,
  storeId: number,
  count = 1,
) {
  for (let i = 0; i < count; i++) {
    yield chai
      .request(process.env.SERVER!)
      .post('/v1/products')
      .auth(token, { type: 'bearer' })
      .query({ storeId })
      .send(productFactory())
  }
}
