import { log } from "console";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import db from "../../../../../db/index.js";
import { testCreateVendor } from "../../../../helpers/user/vendor/index.js";
import { testCreateStore } from "../../../../helpers/user/vendor/store/index.js";
import {
  testCreateProduct,
  testGetAllProduct,
  testGetProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
  testUpdateProduct,
} from "../../../../helpers/user/vendor/store/products/index.js";

const storesDataYaml = fileURLToPath(
  new URL(
    "../../../../data/users/vendors/stores/store-data.yaml",
    import.meta.url
  )
);
const storesData = <any[]>load(readFileSync(storesDataYaml, "utf8"));

const productData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          "../../../../data/users/vendors/stores/products/product.yaml",
          import.meta.url
        )
      ),
      "utf8"
    )
  )
);

const updatedProductData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          "../../../../data/users/vendors/stores/products/updated-product.yaml",
          import.meta.url
        )
      ),
      "utf8"
    )
  )
);

const productMediaData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          "../../../../data/users/vendors/stores/products/media/media.yaml",
          import.meta.url
        )
      ),
      "utf8"
    )
  )
);

// const updatedProductMediaData = <any[]>(
//   load(
//     readFileSync(
//       fileURLToPath(
//         new URL(
//           "../../../../data/users/vendors/stores/products/updated-product-media.yaml",
//           import.meta.url
//         )
//       ),
//       "utf8"
//     )
//   )
// );

export default function (agent: ChaiHttp.Agent, index: number) {
  beforeEach(async () => await db.query("delete from stores"));

  const path = "/v1/user/vendor/stores";

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
      ).then(({ product_id }) =>
        testGetAllProduct(agent, `${path}/${store_id}/products/${product_id}`)
      )
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
    testDeleteProduct(agent, `${path}/${store_id}/products/${product_id}`);
    testGetNonExistentProduct(
      agent,
      `${path}/${store_id}/products/${product_id}`
    );
  });
}
