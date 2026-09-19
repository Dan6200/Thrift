import chai from 'chai'
import { loadYamlFile } from './load-data.js'
const { listOfStores } = loadYamlFile(
  'src/tests/integrated/data/users/vendors/user-aliyu/stores.yml',
)

export async function createStoreForTesting(token: string) {
  return chai
    .request(process.env.SERVER!)
    .post('/v1/stores')
    .auth(token, { type: 'bearer' })
    .send(listOfStores[0])
}
