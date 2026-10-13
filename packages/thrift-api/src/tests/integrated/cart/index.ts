import {
  testGetCart,
  testAddItemToCart,
  testUpdateCartItem,
  testRemoveCartItem,
} from './definitions/index.js'
import { ProfileRequestData } from '#src/types/profile/index.js'
import { createProductsForTesting } from '../helpers/create-product.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { loadUserData } from '../helpers/load-data.js'

const { userInfo: aliyuInfo, products } = loadUserData(
  'src/tests/integrated/data/users/vendors/user-aliyu',
)
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import assert from 'assert'
import { CartItemRequestData } from '#src/types/cart.js'

export default function (customer: { userInfo: ProfileRequestData }) {
  let aliyuUserId: string
  const cartItems: (CartItemRequestData & { base_price: number })[] = []

  before(async () => {
    // Create and sign in vendor (Aliyu), then a store with products. This
    // shared, read-only catalog is reused by every test below.
    aliyuUserId = await createUserForTesting(aliyuInfo)
    const aliyuToken = await signInForTesting(aliyuInfo)
    const storeRes = await createStoreForTesting(aliyuToken)
    const storeId = storeRes.body.store_id

    for await (const response of createProductsForTesting(
      aliyuToken,
      storeId,
      products.length,
    )) {
      for (const {
        variant_id,
        base_price,
        quantity_available: quantity,
      } of response.body.variants) {
        cartItems.push({ variant_id, base_price, quantity })
      }
    }
  })

  after(async () => {
    await deleteUserForTesting(aliyuUserId)
  })

  // Each test gets a fresh customer (and thus a fresh cart), so no test
  // depends on the state left behind by another.
  const withCustomer = async (fn: (token: string) => Promise<void>) => {
    const userId = await createUserForTesting(customer.userInfo)
    const token = await signInForTesting(customer.userInfo)
    try {
      await fn(token)
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  // Add every catalog variant to the fresh cart, returning the item ids in order.
  const addAllItems = async (token: string): Promise<number[]> => {
    assert(!!cartItems.length)
    const itemIds: number[] = []
    for (const item of cartItems) {
      const { base_price, ...restItem } = item
      const { item_id } = await testAddItemToCart({
        token,
        body: restItem,
        expectedData: { ...item, price: base_price } as any,
      })
      itemIds.push(item_id)
    }
    return itemIds
  }

  it('should get an empty cart for a new user', () =>
    withCustomer(async (token) => {
      await testGetCart({
        token,
        expectedData: { items: [], total_items: 0, total_price: 0 },
      })
    }))

  it('should add items to the cart', () =>
    withCustomer(async (token) => {
      await addAllItems(token)
    }))

  it('should get all the items in a cart', () =>
    withCustomer(async (token) => {
      await addAllItems(token)
      await testGetCart({
        token,
        expectedData: {
          items: cartItems.map(({ base_price, ...rest }) => rest) as any,
          total_items: cartItems.reduce(
            (count, { quantity }) => count + quantity,
            0,
          ),
          total_price: cartItems.reduce(
            (total, { base_price, quantity }) => total + base_price * quantity,
            0,
          ),
        },
      })
    }))

  it('should update the quantity of a specific item in the cart', () =>
    withCustomer(async (token) => {
      const itemIds = await addAllItems(token)
      const updatedQuantity = 5
      const { base_price, ...cartItemFiltered } = cartItems[0]
      await testUpdateCartItem({
        token,
        params: { itemId: itemIds[0] },
        body: { quantity: updatedQuantity },
        expectedData: {
          ...cartItemFiltered,
          price: base_price,
          quantity: updatedQuantity,
        },
      })
    }))

  it('should remove an item from the cart', () =>
    withCustomer(async (token) => {
      const itemIds = await addAllItems(token)
      await testRemoveCartItem({ token, params: { itemId: itemIds[2] } })
    }))

  it('should reflect add + update + remove modifications', () =>
    withCustomer(async (token) => {
      const itemIds = await addAllItems(token)
      const updatedQuantity = 5

      const { base_price: price0, ...item0 } = cartItems[0]
      await testUpdateCartItem({
        token,
        params: { itemId: itemIds[0] },
        body: { quantity: updatedQuantity },
        expectedData: { ...item0, price: price0, quantity: updatedQuantity },
      })
      await testRemoveCartItem({ token, params: { itemId: itemIds[2] } })

      let total_price = cartItems[0].base_price * updatedQuantity
      let total_items = 0
      const calculatedItems = cartItems
        .toSpliced(0, 1, {
          variant_id: cartItems[0].variant_id,
          quantity: updatedQuantity,
          base_price: null,
        })
        .toSpliced(2, 1)
        .map((item) => {
          const { base_price, ...rest } = item
          total_price += base_price * rest.quantity
          total_items += rest.quantity
          return rest
        })
      await testGetCart({
        token,
        expectedData: {
          items: calculatedItems as any,
          total_items,
          total_price,
        },
      })
    }))
}
