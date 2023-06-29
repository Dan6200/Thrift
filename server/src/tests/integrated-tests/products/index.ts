import chai from 'chai'
import chaiHttp from 'chai-http'
import {
	Product,
	ProductMedia,
} from '../../../types-and-interfaces/products.js'
import StoresData from '../../../types-and-interfaces/stores-data.js'
import { UserData } from '../../../types-and-interfaces/user.js'
import { registration } from '../helper-functions/auth/index.js'
import {
	testCreateProduct,
	testGetAllProducts,
	testGetProduct,
	testUploadProductMedia,
	testUpdateProduct,
	testDeleteProduct,
	testGetNonExistentProduct,
} from '../helper-functions/products/index.js'
import { testCreateStore } from '../helper-functions/store/index.js'
import { testCreateVendor } from '../helper-functions/vendor/index.js'
import db from '../../../db/pg/index.js'

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
		server = process.env.DEV_APP_SERVER!
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
	})

	let storeIds: Map<string, string | null> = new Map()
	describe('Testing Products In Each Store', async function () {
		before(async () => {
			// Delete all stores
			await db.query({ text: 'delete from stores' })

			for (const store of vendorStores) {
				const { store_id } = await testCreateStore(
					server,
					token,
					storesRoute,
					store
				)
				storeIds.set(store_id, null)
			}
		})

		describe('Product Creation', async () => {
			for (const storeId of storeIds) {
				testCreateProduct(
					server,
					token,
					`${storesRoute}/${storeId}/products`,
					products
				)
			}
		})

		describe('Products Operations', async () => {
			before(async () => {
				let count = 0
				for (const [storeId] of storeIds.entries()) {
					if (count++ >= products.length) break
					for await (const { product_id } of testCreateProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products`,
						products
					)) {
						storeIds.set(storeId, product_id)
					}
				}
			})

			it('it should retrieve all the products from each store', async () => {
				for (const [storeId] of storeIds) {
					await testGetAllProducts(
						server,
						token,
						`${storesRoute}/${storeId}/products`
					)
				}
			})

			it('it should retrieve all products from each store, sorted by net price ascending', async () => {
				for (const [storeId] of storeIds) {
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
				for (const [storeId] of storeIds) {
					await testGetAllProducts(
						server,
						token,
						`${storesRoute}/${storeId}/products`,
						{
							offset: 1,
							limit: 2,
						}
					)
				}
			})

			it('it should retrieve a specific product a vendor has for sale', async () => {
				for (const [storeId, productId] of storeIds) {
					await testGetProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products/${productId}`
					)
				}
			})

			it("it should add the product's media to an existing product", async () => {
				for (const [storeId, productId] of storeIds) {
					await testUploadProductMedia(
						server,
						token,
						`${storesRoute}/${storeId}/products/${productId}/media`,
						productMedia
					)
				}
			})

			it('it should update all the products a vendor has for sale', async () => {
				let idx = 0
				for (const [storeId, productId] of storeIds) {
					await testUpdateProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products/${productId}`,
						productReplaced[idx++]
					)
				}
			})

			it('it should delete all the product a vendor has for sale', async () => {
				for (const [storeId, productId] of storeIds) {
					await testDeleteProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products/${productId}`
					)
				}
			})

			it('it should fail to retrieve any of the deleted products', async () => {
				for (const [storeId, productId] of storeIds) {
					await testGetNonExistentProduct(
						server,
						token,
						`${storesRoute}/${storeId}/products/${productId}`
					)
				}
			})

			//end
		})
	})
}
