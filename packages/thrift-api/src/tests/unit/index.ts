// cspell:disable
import chai from 'chai'
import resultTests from './shared/result.js'
import moneyTests from './shared/money.js'
import domainErrorTests from './shared/domain-error.js'
import toHttpErrorTests from './shared/to-http-error.js'
import catalogDomainTests from './catalog/index.js'
import catalogVariantTests from './catalog/variant.js'
import catalogSortTests from './catalog/sort.js'
import createProductUseCaseTests from './catalog/create-product.js'
import createVariantUseCaseTests from './catalog/create-variant-use-case.js'
import createOrderTests from './orders/create-order.js'
import createOrderEdgeCaseTests from './orders/create-order-edge-cases.js'
import cartDomainTests from './cart/cart.js'

chai.should()

export default () => {
  describe('shared/result', resultTests)
  describe('shared/money', moneyTests)
  describe('shared/domain-error', domainErrorTests)
  describe('shared/to-http-error', toHttpErrorTests)
  describe('Catalog product domain', catalogDomainTests)
  describe('Catalog variant domain', catalogVariantTests)
  describe('Catalog sort', catalogSortTests)
  describe('Catalog create product use case', createProductUseCaseTests)
  describe('Catalog create variant use case', createVariantUseCaseTests)
  describe('Orders', createOrderTests)
  describe('Orders edge cases', createOrderEdgeCaseTests)
  describe('Cart domain', cartDomainTests)
}
