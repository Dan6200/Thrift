import chai from 'chai'
import { storeFactory } from '../factories/index.js'

export async function createStoreForTesting(token: string) {
  return chai
    .request(process.env.SERVER!)
    .post('/v1/stores')
    .auth(token, { type: 'bearer' })
    .send(storeFactory())
}
