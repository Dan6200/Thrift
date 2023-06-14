import db from "../../../../../db/index.js";
import { registration } from "../../../../helpers/auth/index.js";
import {
  newUsers,
  productData,
  productMediaData,
  storesData,
  updatedProductData,
} from "../../../../helpers/load-yaml.js";
import { testCreateVendor } from "../../../../helpers/user/vendor/index.js";
import { testCreateStore } from "../../../../helpers/user/vendor/store/index.js";
import {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
  testUpdateProduct,
  testUploadProductMedia,
} from "../../../../helpers/user/vendor/store/products/index.js";

export default function (agent: ChaiHttp.Agent, index: number) {
  after(async () => db.query("delete from user_accounts"));
  beforeEach(async () => await db.query("delete from stores"));

  const path = "/v1/user/vendor/stores";

  it("it should register a new user", () =>
    registration(agent, newUsers[index]));

  it("it should create a vendor account for the user", () =>
    testCreateVendor(agent, "/v1/user/vendor/"));

  it("it should create a product for sale", () =>
    testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
      testCreateProduct(
        agent,
        `${path}/${store_id}/products`,
        productData[index]
      )
    ));

  it("it should retrieve all products a vendor has for sale", () =>
    testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
      testCreateProduct(
        agent,
        `${path}/${store_id}/products`,
        productData[index]
      ).then(() => testGetAllProducts(agent, `${path}/${store_id}/products`))
    ));

  it("it should retrieve a specific product a vendor has for sale", () =>
    testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
      testCreateProduct(
        agent,
        `${path}/${store_id}/products`,
        productData[index]
      ).then(({ product_id }) =>
        testGetProduct(agent, `${path}/${store_id}/products/${product_id}`)
      )
    ));

  it("it should create a product for sale, add the product's media, then retrieve the product", async () => {
    const { store_id } = await testCreateStore(agent, path, storesData[index]);
    const { product_id } = await testCreateProduct(
      agent,
      `${path}/${store_id}/products`,
      productData[index]
    );
    await testUploadProductMedia(
      agent,
      `${path}/${store_id}/products/${product_id}/media`,
      productMediaData[index]
    );
    await testGetProduct(agent, `${path}/${store_id}/products/${product_id}`);
  });

  it("it should update a specific product a vendor has for sale", () =>
    testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
      testCreateProduct(
        agent,
        `${path}/${store_id}/products`,
        productData[index]
      ).then(({ product_id }) =>
        testUpdateProduct(
          agent,
          `${path}/${store_id}/products/${product_id}`,
          updatedProductData[index]
        )
      )
    ));

  it("it should delete a product a vendor has for sale", () =>
    testCreateStore(agent, path, storesData[index]).then(({ store_id }) =>
      testCreateProduct(
        agent,
        `${path}/${store_id}/products`,
        productData[index]
      ).then(({ product_id }) =>
        testDeleteProduct(agent, `${path}/${store_id}/products/${product_id}`)
      )
    ));

  it("it should fail to retrieve a deleted product", async () => {
    const { store_id } = await testCreateStore(agent, path, storesData[index]);
    const { product_id } = await testCreateProduct(
      agent,
      `${path}/${store_id}/products`,
      productData[index]
    );
    await testDeleteProduct(
      agent,
      `${path}/${store_id}/products/${product_id}`
    );
    await testGetNonExistentProduct(
      agent,
      `${path}/${store_id}/products/${product_id}`
    );
  });
}
