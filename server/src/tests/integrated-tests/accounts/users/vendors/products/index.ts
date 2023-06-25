import chai from 'chai'
import chaiHttp from 'chai-http'
import { registration } from '../../../../helpers/auth/index.js'
import { testCreateVendor } from '../../../../helpers/user/vendor/index.js'
import { testCreateStore } from '../../../../helpers/user/vendor/store/index.js'
import {
	testCreateProduct,
	testGetAllProducts,
	testGetProduct,
	testDeleteProduct,
	testGetNonExistentProduct,
	testUpdateProduct,
	testUploadProductMedia,
} from '../../../../helpers/user/vendor/store/products/index.js'
import db from '../../../../../../db/index.js'
import { UserData } from '../../../../../../types-and-interfaces/user.js'
import {
	Product,
	ProductMedia,
} from '../../../../../../types-and-interfaces/products.js'
import StoresData from '../../../../../../types-and-interfaces/stores-data.js'

chai.use(chaiHttp).should()
let server: string, token: string
const vendorsRoute = '/v1/users/vendor-account'
const storesRoute = vendorsRoute + '/stores'

export default function ({
	userInfo,
	stores: vendorStores,
	products,
	productReplaced,
	productMedia,
}: {
	userInfo: UserData
	stores: StoresData[]
	updatedStores?: StoresData[]
	products: Product[]
	productReplaced: Product[]
	productMedia: ProductMedia[]
	updatedProductMedia: ProductMedia[]
}) {
	before(async function () {
		//  Set the server url
		server = process.env.LOCAL_APP_SERVER!
		// Delete all user accounts
		await db.query({ text: 'delete from user_accounts' })
		// Delete all vendors
		await db.query({ text: 'delete from vendors' })
		// Register a new user
		;({
			body: { token },
		} = await registration(server, userInfo))
		// Create a vendor account for the user
		await testCreateVendor(server, token, '/v1/users/vendor-account/')
	})
	beforeEach(async () => {
		if (!token) throw new Error('access token undefined')
		// Delete all stores
		await db.query({ text: 'delete from stores' })
	})

	describe('Testing Products In Each Store', async function () {
		let storeIds: string[]
		before(async () => {
			for (const store of vendorStores) {
				const { store_id } = await testCreateStore(
					server,
					token,
					storesRoute,
					store
				)
				storeIds.push(store_id)
			}
		})

		describe('Product Creation', async () => {
			for (const storeId of storeIds) {
				await testCreateProduct(
					server,
					token,
					`${storesRoute}/${storeId}/products`,
					products
				)
			}
		})

		describe('Operations on The Created Product', async () => {
			let productIds: string[]
			before(async () => {
				for (const storeId of storeIds) {
					productIds = await testCreateProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products`,
						products
					)
				}
			})

			it('it should retrieve all the products from each store', async () => {
				for (const storeId of storeIds) {
					await testGetAllProducts(
						server,
						token,
						`${storesRoute}/${storeId}/products`
					)
				}
			})

			it('it should retrieve all products from each store, sorted by net price ascending', async () => {
				for (const storeId of storeIds) {
					await testGetAllProducts(
						server,
						token,
						`${storesRoute}/${storeId}/products`,
						{
							sort: '-net_price',
						}
					)
				}
			})

			it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
				for (const storeId of storeIds) {
					await testGetAllProducts(
						server,
						token,
						`${storesRoute}/${storeId}/products`,
						{
							offset: 2,
							limit: 10,
						}
					)
				}
			})

			it('it should retrieve a specific product a vendor has for sale', async () => {
				for (const storeId of storeIds) {
					for (const productId of productIds) {
						await testGetProduct(
							server,
							token,
							`${storesRoute}/${storeId}/products/${productId}`
						)
					}
				}
			})

			describe('Product Media', () => {
				it("it should add the product's media to an existing product", async () => {
					for (const storeId of storeIds) {
						for (const productId of productIds) {
							await testUploadProductMedia(
								server,
								token,
								`${storesRoute}/${storeId}/products/${productId}/media`,
								productMedia
							)
						}
					}
				})
			})

			it('it should update a specific product a vendor has for sale', async () => {
				for (const storeId of storeIds) {
					for (const productId of productIds) {
						let secondaryIndex = 0
						for (const productId of productIds) {
							await testUpdateProduct(
								server,
								token,
								`${storesRoute}/${storeId}/products/${productId}`,
								productReplaced[secondaryIndex++]
							)
						}
					}
				}
			})

			//end
		})
	})

	it('it should delete a product a vendor has for sale', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(
				server,
				token,
				storesRoute,
				store
			)
			const productIds = await testCreateProduct(
				server,
				token,
				`${storesRoute}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testDeleteProduct(
					server,
					token,
					`${storesRoute}/${store_id}/products/${product_id}`
				)
			}
		}
	})

	it('it should fail to retrieve a deleted product', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(
				server,
				token,
				storesRoute,
				store
			)
			const productIds: any[] = await testCreateProduct(
				server,
				token,
				`${storesRoute}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testDeleteProduct(
					server,
					token,
					`${storesRoute}/${store_id}/products/${product_id}`
				)
				await testGetNonExistentProduct(
					server,
					token,
					`${storesRoute}/${store_id}/products/${product_id}`
				)
			}
		}
	})
}
