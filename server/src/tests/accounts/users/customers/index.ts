import "express-async-errors";
import chai from "chai";
import chaiHttp from "chai-http";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import {
  testCreateCustomer,
  testGetCustomer,
  testDeleteCustomer,
  testGetNonExistentCustomer,
} from "../../../helpers/user/customer/index.js";
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from "../../../helpers/user/customer/shipping.js";
import { registration } from "../../../helpers/auth/index.js";
import { UserData } from "../../../../types-and-interfaces/user.js";

const shippingInfoYaml = fileURLToPath(
  new URL("../../../data/users/customers/shipping-info.yaml", import.meta.url)
);
const shippingInfoList = <any[]>load(readFileSync(shippingInfoYaml, "utf8"));

const updatedShippingInfoYaml = fileURLToPath(
  new URL(
    "../../../data/users/customers/update-shipping-info.yaml",
    import.meta.url
  )
);
const updatedShippingInfoList = <any[]>(
  load(readFileSync(updatedShippingInfoYaml, "utf8"))
);

export default function (agent: ChaiHttp.Agent, index: number) {
  it("it should create a customer account for the user", () =>
    testCreateCustomer(agent, "v1/user/customer"));

  it("it should get the user's customer account", () =>
    testGetCustomer(agent, "v1/user/customer"));

  const shippingInfo = shippingInfoList[index];
  const path = "v1/user/customer/shipping";

  it(`it should add shipping addresses for the customer then retrieve it`, async () => {
    const { address_id } = await testCreateShipping(agent, path, shippingInfo);
    await testGetShipping(agent, path + "/" + address_id);
  });

  const updatedShippingInfo = updatedShippingInfoList[index];

  it(`it should add a shipping addresses for the customer then update it`, async () => {
    const { address_id } = await testCreateShipping(agent, path, shippingInfo);
    await testUpdateShipping(
      agent,
      path + "/" + address_id,
      updatedShippingInfo
    );
  });

  it(`it should add a shipping addresses for the customer then delete it`, async () => {
    const { address_id } = await testCreateShipping(agent, path, shippingInfo);
    await testDeleteShipping(agent, path + "/" + address_id);
  });

  it(`it should fail to retrieve the deleted shipping information`, async () => {
    const { address_id } = await testCreateShipping(agent, path, shippingInfo);
    await testDeleteShipping(agent, `${path}/${address_id}`);
    await testGetNonExistentShipping(agent, `${path}/${address_id}`);
  });

  it("it should delete the user's customer account", () =>
    testDeleteCustomer(agent));

  it("it should fail to get the user's customer account", () =>
    testGetNonExistentCustomer(agent));
}
