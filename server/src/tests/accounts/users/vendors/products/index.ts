import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import {
  testCreateProduct,
  testGetAllProduct,
  testGetProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from "../../../../helpers/user/vendor/products.js";

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

// const updatedProductData = <any[]>(
//   load(
//     readFileSync(
//       fileURLToPath(
//         new URL(
//           "../../../../data/users/vendors/stores/products/updated-product",
//           import.meta.url
//         )
//       ),
//       "utf8"
//     )
//   )
// );

// const productMediaData = <any[]>(
//   load(
//     readFileSync(
//       fileURLToPath(
//         new URL(
//           "../../../../data/users/vendors/stores/products/product-media.yaml",
//           import.meta.url
//         )
//       ),
//       "utf8"
//     )
//   )
// );

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
  it("it should create a product for sale", () =>
    testCreateProduct(agent, productData[index]));

  it("it should retrieve all products a vendor has for sale", () =>
    testGetAllProduct(agent));

  it("it should retrieve a specific product a vendor has for sale", () =>
    testCreateProduct(agent, productData[index]).then(({ product_id }) =>
      testGetProduct(agent, null, `/${product_id}`)
    ));

  it("it should delete a product a vendor has for sale", () =>
    testCreateProduct(agent, productData[index]).then(({ product_id }) =>
      testDeleteProduct(agent, null, `/${product_id}`)
    ));

  it("it should fail to retrieve a deleted product", async () => {
    const { product_id } = await testCreateProduct(agent, productData[index]);
    testDeleteProduct(agent, null, `/${product_id}`);
    testGetNonExistentProduct(agent, null, `/${product_id}`);
  });
}
