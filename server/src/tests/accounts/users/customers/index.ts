import "express-async-errors";
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
import {
  newUsers,
  shippingInfoList,
  updatedShippingInfoList,
} from "../../../helpers/load-yaml.js";
import db from "../../../../db/index.js";

export default function (agent: ChaiHttp.Agent, index: number) {
  after(async () => db.query("delete from user_accounts"));

  const path = "/v1/user/customer";

  it("it should register a new user", () =>
    registration(agent, newUsers[index]));

  it("it should create a customer account for the user", () =>
    testCreateCustomer(agent, path));

  it("it should get the user's customer account", () =>
    testGetCustomer(agent, path));

  const shippingInfo = shippingInfoList[index];
  const shippingPath = path + "/shipping-info";

  it(`it should add shipping addresses for the customer then retrieve it`, async () => {
    const { address_id } = await testCreateShipping(
      agent,
      shippingPath,
      shippingInfo
    );
    await testGetShipping(agent, shippingPath + "/" + address_id);
  });

  const updatedShippingInfo = updatedShippingInfoList[index];

  it(`it should add a shipping addresses for the customer then update it`, async () => {
    const { address_id } = await testCreateShipping(
      agent,
      shippingPath,
      shippingInfo
    );
    await testUpdateShipping(
      agent,
      shippingPath + "/" + address_id,
      updatedShippingInfo
    );
  });

  it(`it should add a shipping addresses for the customer then delete it`, async () => {
    const { address_id } = await testCreateShipping(
      agent,
      shippingPath,
      shippingInfo
    );
    await testDeleteShipping(agent, shippingPath + "/" + address_id);
  });

  it(`it should fail to retrieve the deleted shipping information`, async () => {
    const { address_id } = await testCreateShipping(
      agent,
      shippingPath,
      shippingInfo
    );
    await testDeleteShipping(agent, `${shippingPath}/${address_id}`);
    await testGetNonExistentShipping(agent, `${shippingPath}/${address_id}`);
  });

  it("it should delete the user's customer account", () =>
    testDeleteCustomer(agent, path));

  it("it should fail to get the user's customer account", () =>
    testGetNonExistentCustomer(agent, path));
}
