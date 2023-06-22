import { log } from 'node:console'
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
	testReplaceProduct,
} from '../../../../helpers/user/vendor/store/products/index.js'
import db from '../../../../../../db/index.js'
import { UserData } from '../../../../../../types-and-interfaces/user.js'
import {
	Product,
	ProductMedia,
	ProductPartial,
} from '../../../../../../types-and-interfaces/products.js'
import StoresData from '../../../../../../types-and-interfaces/stores-data.js'

// { UserData }
// { stores, updatedStores }
// {
// 	products,
// 	productReplaced,
// 	productPartialUpdate,
// 	productMedia,
// }
export default function (
	agent: ChaiHttp.Agent,
	{
		userInfo,
		stores: vendorStores,
		updatedStores: vendorStoresUpdated,
		products,
		productReplaced,
		productPartialUpdate,
		productMedia,
		updatedProductMedia,
	}: {
		userInfo: UserData
		stores: StoresData
		updatedStores: StoresData
		products: Product
		productReplaced: Product
		productPartialUpdate: ProductPartial
		productMedia: ProductMedia
		updatedProductMedia: ProductMedia
	}
) {
	beforeEach(async () => await db.query({ text: 'delete from stores' }))
	before(async () => {
		db.query({ text: 'delete from user_accounts' })
		db.query({ text: 'delete from vendors' })
	})

	const path = '/v1/user-account/vendor-account/stores'

	it('it should register a new user', () => registration(agent, userInfo))

	it('it should create a vendor account for the user', () =>
		testCreateVendor(agent, '/v1/user-account/vendor-account/'))

	it('it should create a product for sale', () =>
		testCreateStore(agent, path, vendorStores).then(({ store_id }) =>
			testCreateProduct(agent, `${path}/${store_id}/products`, products)
		))

	it('it should retrieve all products a vendor has for sale', () =>
		testCreateStore(agent, path, vendorStores).then(({ store_id }) =>
			testCreateProduct(agent, `${path}/${store_id}/products`, products).then(
				() => testGetAllProducts(agent, `${path}/${store_id}/products`)
			)
		))

	it('it should retrieve all products a vendor has for sale, sorted by net price ascending', () =>
		testCreateStore(agent, path, vendorStores).then(({ store_id }) =>
			testCreateProduct(agent, `${path}/${store_id}/products`, products).then(
				() =>
					testGetAllProducts(agent, `${path}/${store_id}/products`, {
						sort: '-net_price',
					})
			)
		))

	it('it should retrieve all products a vendor has for sale, offset by 2 and limited by 10', () =>
		testCreateStore(agent, path, vendorStores).then(({ store_id }) =>
			testCreateProduct(agent, `${path}/${store_id}/products`, products).then(
				() =>
					testGetAllProducts(agent, `${path}/${store_id}/products`, {
						offset: 2,
						limit: 10,
					})
			)
		))

	it('it should retrieve a specific product a vendor has for sale', () =>
		testCreateStore(agent, path, vendorStores).then(({ store_id }) =>
			testCreateProduct(agent, `${path}/${store_id}/products`, products).then(
				productIds =>
					Promise.all(
						productIds.map(({ product_id }) =>
							testGetProduct(
								agent,
								`${path}/${store_id}/products/${product_id}`
							)
						)
					)
			)
		))

	it("it should create a product for sale, add the product's media, then retrieve the product", async () => {
		const { store_id } = await testCreateStore(agent, path, vendorStores)
		const productIds = await testCreateProduct(
			agent,
			`${path}/${store_id}/products`,
			products
		)
		let secondaryIndex = 0
		for (const { product_id } of productIds) {
			await testUploadProductMedia(
				agent,
				`${path}/${store_id}/products/${product_id}/media`,
				productMedia
			)
			await testGetProduct(agent, `${path}/${store_id}/products/${product_id}`)
		}
	})

	it('it should update a specific product a vendor has for sale', () =>
		testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
			testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				productData[index]
			).then(productIds =>
				Promise.all(
					productIds.map(({ product_id }, secondaryIndex) =>
						testUpdateProduct(
							agent,
							`${path}/${store_id}/products/${product_id}`,
							updatedProductData[index][secondaryIndex]
						)
					)
				)
			)
		))

	it('it should replace an existing product with no information', () =>
		testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
			testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				productData[index]
			).then((productIds: any[]) =>
				Promise.all(
					productIds.map(({ product_id }, secondaryIndex) =>
						testReplaceProduct(
							agent,
							`${path}/${store_id}/products/${product_id}`,
							replaceProductData[index][secondaryIndex]
						)
					)
				)
			)
		))

	it('it should delete a product a vendor has for sale', () =>
		testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
			testCreateProduct(
				agent,
				`${path}/${store_id}/products`,
				productData[index]
			).then((productIds: any[]) =>
				Promise.all(
					productIds.map(({ product_id }) =>
						testDeleteProduct(
							agent,
							`${path}/${store_id}/products/${product_id}`
						)
					)
				)
			)
		))

	it('it should fail to retrieve a deleted product', async () => {
		const { store_id } = await testCreateStore(agent, path, storesData[index])
		const productIds: any[] = await testCreateProduct(
			agent,
			`${path}/${store_id}/products`,
			productData[index]
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
	})
}
