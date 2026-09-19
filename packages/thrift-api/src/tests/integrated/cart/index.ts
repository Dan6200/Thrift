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
  let token: string
  let userId: string
  let aliyuUserId: string
  let cartItemIds: number[] = []
  const cartItems: (CartItemRequestData & { base_price: number })[] = []

  before(async () => {
    // Create and sign in customer
    userId = await createUserForTesting(customer.userInfo)
    token = await signInForTesting(customer.userInfo)

    // Create and sign in vendor (Aliyu)
    aliyuUserId = await createUserForTesting(aliyuInfo)
    const aliyuToken = await signInForTesting(aliyuInfo)

    // Create a store for Aliyu
    const storeRes = await createStoreForTesting(aliyuToken)
    const storeId = storeRes.body.store_id

    // Create products in that store
    for await (const response of createProductsForTesting(
      aliyuToken,
      storeId,
      products.length,
    )) {
      // Extract the variants
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
    await deleteUserForTesting(userId)
    await deleteUserForTesting(aliyuUserId)
  })

  it('should get an empty cart for a new user', async () => {
    await testGetCart({
      token,
      expectedData: {
        items: [],
        total_items: 0,
        total_price: 0,
      },
    })
  })

  it('should add an item to the cart', async () => {
    assert(!!cartItems.length)
    for (const item of cartItems) {
      const { base_price, ...restItem } = item
      const { item_id } = await testAddItemToCart({
        token,
        body: restItem,
        expectedData: { ...item, price: base_price } as any,
      })
      cartItemIds.push(item_id)
    }
  })

  it('should get all the items in a cart', async () => {
    await testGetCart({
      token,
      expectedData: {
        items: cartItems.map((item) => {
          const { base_price, ...rest } = item
          return rest
        }) as any,
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
  })

  it('should update the quantity of a specific item in the cart', async () => {
    const updatedQuantity = 5
    const { base_price, ...cartItemFiltered } = cartItems[0]
    const expectedData = {
      ...cartItemFiltered,
      price: base_price,
      quantity: updatedQuantity,
    }
    await testUpdateCartItem({
      token,
      params: { itemId: cartItemIds[0] },
      body: { quantity: updatedQuantity },
      expectedData,
    })
  })

  it('should remove an item from the cart', async () => {
    await testRemoveCartItem({
      token,
      params: { itemId: cartItemIds[2] },
    })
  })

  it('should get all the items in a cart, and reflect all the modifications', async () => {
    const updatedQuantity = 5
    let total_price = cartItems[0].base_price * updatedQuantity, // first Item that was removed, needed for calculation later
      total_items = 0
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
  })
}
