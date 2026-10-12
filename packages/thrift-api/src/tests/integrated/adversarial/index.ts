import catalog from './catalog.js'
import cart from './cart.js'
import orders from './orders.js'
import reviews from './reviews.js'
import deliveryInfo from './delivery-info.js'
import stores from './stores.js'
import analytics from './analytics.js'
import auth from './auth.js'
import payments from './payments.js'

/**
 * Strict, adversarial test suite. Each area asserts the application contract
 * precisely and surfaces any divergence (a failure is a finding, not a bug to
 * delete). Tests are self-contained: they seed and tear down their own data.
 */
export default function (): void {
  auth()
  catalog()
  cart()
  orders()
  reviews()
  deliveryInfo()
  stores()
  analytics()
  payments()
}
