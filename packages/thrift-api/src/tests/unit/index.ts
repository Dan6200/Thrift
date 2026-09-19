// cspell:disable
import { handleSortQuery } from '#src/logic/products/utility.js'
import catalogDomainTests from './catalog/index.js'
import createProductUseCaseTests from './catalog/create-product.js'
import chai from 'chai'

chai.should()

export default () => {
  describe('Catalog product domain', catalogDomainTests)
  describe('Catalog create product use case', createProductUseCaseTests)

  it('it should create a database query from a query parameter input', () =>
    handleSortQuery('-base_price,product_id').should.equal(
      `ORDER BY base_price DESC, product_id ASC`,
    ))

  it('it should create a database query from a query parameter input', () =>
    handleSortQuery('product_id,base_price').should.equal(
      `ORDER BY product_id ASC, base_price ASC`,
    ))
}
