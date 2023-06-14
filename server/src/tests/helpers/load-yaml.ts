import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { UserData } from '../../types-and-interfaces/user.js'

const newUsersYaml = fileURLToPath(
  new URL('../data/users/new-users.yaml', import.meta.url),
)
export const newUsers = load(readFileSync(newUsersYaml, 'utf8')) as UserData[]

const updateUsersPasswordsYaml = fileURLToPath(
  new URL('../data/users/update-user-password.yaml', import.meta.url),
)
export const usersPasswordsUpdated = load(
  readFileSync(updateUsersPasswordsYaml, 'utf8'),
) as UserData[]

const updateUsersYaml = fileURLToPath(
  new URL('../data/users/update-user.yaml', import.meta.url),
)
export const usersInfoUpdated = load(
  readFileSync(updateUsersYaml, 'utf8'),
) as UserData[]

const storesDataYaml = fileURLToPath(
  new URL('../data/users/vendors/stores/store-data.yaml', import.meta.url),
)
export const storesData = <any[]>load(readFileSync(storesDataYaml, 'utf8'))

export const updatedStoresData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          '../data/users/vendors/stores/updated-store-data.yaml',
          import.meta.url,
        ),
      ),
      'utf8',
    ),
  )
)

const shippingInfoYaml = fileURLToPath(
  new URL('../data/users/customers/shipping-info.yaml', import.meta.url),
)
export const shippingInfoList = <any[]>(
  load(readFileSync(shippingInfoYaml, 'utf8'))
)

const updatedShippingInfoYaml = fileURLToPath(
  new URL('../data/users/customers/update-shipping-info.yaml', import.meta.url),
)
export const updatedShippingInfoList = <any[]>(
  load(readFileSync(updatedShippingInfoYaml, 'utf8'))
)

export const { productMediaData, updatedProductMediaData } = <any>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          '../data/users/vendors/stores/products/media/media.yaml',
          import.meta.url,
        ),
      ),
      'utf8',
    ),
  )
)

export const productData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          '../data/users/vendors/stores/products/product.yaml',
          import.meta.url,
        ),
      ),
      'utf8',
    ),
  )
)

// const updatedProductMediaData = <any[]>(
//   load(
//     readFileSync(
//       fileURLToPath(
//         new URL(
//           "../data/users/vendors/stores/products/updated-product-media.yaml",
//           import.meta.url
//         )
//       ),
//       "utf8"
//     )
//   )
// );

export const replaceProductData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          '../data/users/vendors/stores/products/replace-product.yaml',
          import.meta.url,
        ),
      ),
      'utf8',
    ),
  )
)
export const updatedProductData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          '../data/users/vendors/stores/products/updated-product.yaml',
          import.meta.url,
        ),
      ),
      'utf8',
    ),
  )
)
