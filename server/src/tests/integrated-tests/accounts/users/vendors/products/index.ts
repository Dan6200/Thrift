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
	ProductPartial,
} from '../../../../../../types-and-interfaces/products.js'
import StoresData from '../../../../../../types-and-interfaces/stores-data.js'

export default function (
	agent: ChaiHttp.Agent,
	{
		userInfo,
		stores: vendorStores,
		products,
		productReplaced,
		productPartialUpdate,
		productMedia,
		updatedProductMedia,
	}: {
		userInfo: UserData
		stores: StoresData[]
		updatedStores?: StoresData[]
		products: Product[]
		productReplaced: Product[]
		productPartialUpdate: ProductPartial[]
		productMedia: ProductMedia[]
		updatedProductMedia: ProductMedia[]
	}
) {
	before(async () => {
		await db.query({ text: 'delete from user_accounts' })
		await db.query({ text: 'delete from vendors' })
	})
	beforeEach(async () => await db.query({ text: 'delete from stores' }))

	const path = '/v1/user-account/vendor-account/stores'

	it('it should register a new user', () => registration(agent, userInfo))

	it('it should create a vendor account for the user', () =>
		testCreateVendor(agent, '/v1/user-account/vendor-account/'))

	it('it should create a product for sale', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			await testCreateProduct(agent, `${path}/${store_id}/products`, products)
		}
	})

	it('it should retrieve all products a vendor has for sale', async () => {
		for (const stores of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, stores)
			await testCreateProduct(agent, `${path}/${store_id}/products`, products)
			await testGetAllProducts(agent, `${path}/${store_id}/products`)
		}
	})

	it('it should retrieve all products a vendor has for sale, sorted by net price ascending', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			await testCreateProduct(agent, `${path}/${store_id}/products`, products)
			await testGetAllProducts(agent, `${path}/${store_id}/products`, {
				sort: '-net_price',
			})
		}
	})

	it('it should retrieve all products a vendor has for sale, offset by 2 and limited by 10', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			await testCreateProduct(agent, `${path}/${store_id}/products`, products)
			await testGetAllProducts(agent, `${path}/${store_id}/products`, {
				offset: 2,
				limit: 10,
			})
		}
	})

	it('it should retrieve a specific product a vendor has for sale', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			const productIds = await testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testGetProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`
				)
			}
		}
	})

	it("it should create a product for sale, add the product's media, then retrieve the product", async () => {
		for (const stores of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, stores)
			const productIds = await testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testUploadProductMedia(
					agent,
					`${path}/${store_id}/products/${product_id}/media`,
					productMedia
				)
				await testGetProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`
				)
			}
		}
	})

	it('it should update a specific product a vendor has for sale', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			const productIds = await testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				products
			)
			let secondaryIndex = 0
			for (const { product_id } of productIds) {
				await testUpdateProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`,
					productReplaced[secondaryIndex++]
				)
			}
		}
	})

	it('it should delete a product a vendor has for sale', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			const productIds = await testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testDeleteProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`
				)
			}
		}
	})

	it('it should fail to retrieve a deleted product', async () => {
		for (const store of vendorStores) {
			const { store_id } = await testCreateStore(agent, path, store)
			const productIds: any[] = await testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				products
			)
			for (const { product_id } of productIds) {
				await testDeleteProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`
				)
				await testGetNonExistentProduct(
					agent,
					`${path}/${store_id}/products/${product_id}`
				)
			}
		}
	})
}
