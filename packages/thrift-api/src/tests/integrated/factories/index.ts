import { randomUUID } from 'node:crypto'

/**
 * Test-data factories.
 *
 * Every factory returns a fresh object with globally-unique values (email,
 * phone, SKU, store name), so any test or suite can seed its own data without
 * colliding with another — the precondition for order-independence and parallel
 * runs. These replace the static YAML fixtures.
 */

const suffix = () => randomUUID().replace(/-/g, '').slice(0, 8)
const uniqueEmail = () => `test-${suffix()}@example.com`
const uniquePhone = () => `2348${Math.floor(1e7 + Math.random() * 9e7)}`
const iso = (date: string) => `${date}T00:00:00.000Z`

export type UserInfo = {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  dob: string
  country: string
  is_customer: boolean
  is_vendor: boolean
}

export function userFactory(
  opts: { isVendor?: boolean; isCustomer?: boolean } = {},
): any {
  const isVendor = opts.isVendor ?? false
  return {
    userInfo: {
      first_name: 'Test',
      last_name: 'User',
      email: uniqueEmail(),
      phone: uniquePhone(),
      password: 'Str0ng!Passw0rd',
      dob: iso('1995-01-01'),
      country: 'Nigeria',
      is_customer: opts.isCustomer ?? !isVendor,
      is_vendor: isVendor,
    },
    updatedProfileInfo: { dob: iso('2000-01-01') },
  }
}

const deliveryInfo = () => ({
  recipient_full_name: 'Test Recipient',
  address_line_1: '1 Test Street',
  address_line_2: '',
  city: 'Lagos',
  state: 'Lagos',
  zip_postal_code: '100001',
  country: 'Nigeria',
  phone_number: '+2348000000000',
  delivery_instructions: 'Leave at the door',
})

export function deliveryInfoFactory(count = 3): any {
  return {
    listOfDeliveryInfo: Array.from({ length: count }, deliveryInfo),
    listOfUpdatedDeliveryInfo: Array.from({ length: count }, deliveryInfo),
  }
}

export function storeFactory(): any {
  return {
    store_name: `Store ${suffix()}`,
    favicon: 'https://example.com/favicon.ico',
    custom_domain: null,
    store_address: {
      address_line_1: '1 Test Street',
      address_line_2: '',
      city: 'Lagos',
      state: 'Lagos',
      zip_postal_code: '100001',
      country: 'Nigeria',
    },
    global_styles: { layout_template: 'default', font_family: 'Roboto' },
    pages: [],
  }
}

export function storeListFactory(count = 3): any {
  const listOfStores = Array.from({ length: count }, storeFactory)
  const updatedStores = listOfStores.map((store) => ({
    ...store,
    store_name: `${store.store_name} Updated`,
    custom_domain: `${suffix()}.example.com`,
  }))
  return { listOfStores, updatedStores }
}

export function productFactory(): any {
  const s = suffix()
  return {
    title: `Test Product ${s}`,
    category_id: 1,
    subcategory_id: 1,
    description: ['A test product description'],
    variants: [
      {
        sku: `SKU-${s}-1`,
        base_price: 1000,
        quantity_available: 10,
        options: [{ option_name: 'COLOR', value: 'BLACK' }],
      },
    ],
  }
}

export function variantFactory(): any {
  const s = suffix()
  return {
    sku: `SKU-${s}-V`,
    base_price: 2000,
    quantity_available: 5,
    options: [{ option_name: 'COLOR', value: 'BLUE' }],
  }
}

const mediaBase =
  'src/tests/integrated/data/users/vendors/user-aliyu/products/media'

const mediaFile = (name: string, path: string, description: string) => ({
  name,
  path: `${mediaBase}/${path}`,
  description,
  is_display_image: false,
  is_thumbnail_image: false,
  filetype: 'image/jpeg',
})

export function productMediaFactory(): any {
  return {
    productMedia: [
      [
        mediaFile('product-image-1', 'airpods/display.jpg', 'Product image'),
        mediaFile(
          'product-image-2',
          'bose-headphones/display.jpg',
          'Product image',
        ),
      ],
      [mediaFile('product-image-3', 'airpods/crikey.jpg', 'Product image')],
      [
        mediaFile(
          'product-image-4',
          'bose-headphones/blake.jpg',
          'Product image',
        ),
      ],
    ],
    updatedProductMedia: [
      [
        mediaFile(
          'product-image-5',
          'airpods/cat.jpg',
          'Updated product image',
        ),
      ],
      [
        mediaFile(
          'product-image-6',
          'bose-headphones/house.jpg',
          'Updated product image',
        ),
      ],
      [
        mediaFile(
          'product-image-7',
          'airpods/dog.jpg',
          'Updated product image',
        ),
      ],
    ],
  }
}

export function customerFactory(): any {
  return { ...userFactory({ isCustomer: true }), ...deliveryInfoFactory() }
}

export function vendorFactory(): any {
  return {
    ...userFactory({ isVendor: true }),
    ...storeListFactory(),
    products: [productFactory(), productFactory(), productFactory()],
    productPartialUpdate: [
      { category_id: 2 },
      { description: ['An updated description'] },
      { title: `Renamed Product ${suffix()}`, subcategory_id: 2 },
    ],
    ...productMediaFactory(),
  }
}

export const avatarMedia = {
  name: 'avatar.jpg',
  path: 'src/tests/integrated/data/users/vendors/user-aliyu/profile/avatar.jpg',
  description: 'User avatar',
}
