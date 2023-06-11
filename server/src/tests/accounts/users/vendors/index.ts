import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import {
  testCreateVendor,
  testDeleteVendor,
  testGetNonExistentVendor,
  testGetVendor,
} from "../../../helpers/user/vendor/index.js";
import {
  testCreateStore,
  testGetStore,
  testUpdateStore,
  testDeleteStore,
  testGetNonExistentStore,
} from "../../../helpers/user/vendor/store/index.js";

const storesDataYaml = fileURLToPath(
  new URL("../../../data/users/vendors/stores/store-data.yaml", import.meta.url)
);
const storesData = <any[]>load(readFileSync(storesDataYaml, "utf8"));

const updatedStoresData = <any[]>(
  load(
    readFileSync(
      fileURLToPath(
        new URL(
          "../../../data/users/vendors/stores/updated-store-data.yaml",
          import.meta.url
        )
      ),
      "utf8"
    )
  )
);

export default function (agent: ChaiHttp.Agent, index: number) {
  it("it should create a vendor account for the user", () =>
    testCreateVendor(agent));

  it("it should get the user's vendor account", () => testGetVendor(agent));

  it("should create a store for the vendor", () =>
    testCreateStore(agent, storesData[index]));

  it("should fetch the newly created store", () =>
    testCreateStore(agent, storesData[index]).then(({ store_id }) =>
      testGetStore(agent, null, "/" + store_id)
    ));

  it("should update the store", () =>
    testCreateStore(agent, storesData[index]).then(({ store_id }) =>
      testUpdateStore(agent, updatedStoresData[index], "/" + store_id)
    ));

  it("should delete the created store and fail to retrieve it", () =>
    testCreateStore(agent, storesData[index]).then(({ store_id }) =>
      testDeleteStore(agent, null, "/" + store_id).then(() =>
        testGetNonExistentStore(agent, null, "/" + store_id)
      )
    ));

  it("it should delete the user's vendor account", () =>
    testDeleteVendor(agent));

  it("it should fail to get the user's vendor account", () =>
    testGetNonExistentVendor(agent));
}
