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
import updateVariantUseCaseTests from './catalog/update-variant-use-case.js'
import createOrderTests from './orders/create-order.js'
import createOrderEdgeCaseTests from './orders/create-order-edge-cases.js'
import buildOrderItemsTests from './orders/build-order-items.js'
import amendOrderUseCaseTests from './orders/amend-order-use-case.js'
import cancelOrderUseCaseTests from './orders/cancel-order-use-case.js'
import cartDomainTests from './cart/cart.js'
import cartUseCaseTests from './cart/use-cases.js'
import reviewUseCaseTests from './reviews/use-cases.js'
import handleCallbackUseCaseTests from './payments/handle-callback-use-case.js'
import mediaUseCaseTests from './media/use-cases.js'

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
  describe('Catalog update variant use case', updateVariantUseCaseTests)
  describe('Orders', createOrderTests)
  describe('Orders edge cases', createOrderEdgeCaseTests)
  describe('Orders buildOrderItems', buildOrderItemsTests)
  describe('Orders amend use case', amendOrderUseCaseTests)
  describe('Orders cancel use case', cancelOrderUseCaseTests)
  describe('Cart domain', cartDomainTests)
  describe('Cart use cases', cartUseCaseTests)
  describe('Review use cases', reviewUseCaseTests)
  describe('Payments handle callback use case', handleCallbackUseCaseTests)
  describe('Media use cases', mediaUseCaseTests)
}
