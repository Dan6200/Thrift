import assert from "assert";
import { log } from "console";
import { StatusCodes } from "http-status-codes";
import { ProductSchemaReq } from "../../../../app-schema/products.js";
import db from "../../../../db/index.js";
import { BadRequestError } from "../../../../errors/index.js";
import {
  Insert,
  Update,
} from "../../../helpers/generate-sql-commands/index.js";
import { handleSortQuery } from "../../../helpers/generate-sql-commands/query-params-handler.js";
import processRoute from "../../../helpers/process-route.js";

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
  status: Status;
  data?: string | object;
};

const createQuery = [
  async ({ reqData, userId }) => {
    // this makes sure the Vendor account exists before accessing the /user/vendor/products endpoint
    const dbQuery = await db.query(
      "select vendor_id from vendor where vendor_id=$1",
      [userId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError(
        "Vendor account does not exist. Create a vendor account"
      );
    const vendorId = dbQuery.rows[0].vendor_id;
    return await db.query(
      `${Insert("products", [
        ...Object.keys(reqData),
        "vendor_id",
      ])} returning product_id`,
      [...Object.values(reqData), vendorId]
    );
  },
];

const readAllQuery = [
  async ({ query, limit, offset, userId }) => {
    let { sort } = query;
    const dbQuery = await db.query(
      "select vendor_id from vendor where vendor_id=$1",
      [userId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError(
        "Vendor account does not exist. Create a vendor account"
      );
    const vendorId = dbQuery.rows[0].vendor_id;
    let queryString = `select products.* from products inner join product_media using (product_id) where vendor_id=$1`;
    if (sort) {
      queryString += ` ${handleSortQuery(sort)}`;
    }
    if (limit) queryString += ` limit ${limit}`;
    if (offset) queryString += ` offset ${offset}`;
    log(queryString);
    return await db.query(queryString, [vendorId]);
  },
];

const readQuery = [
  async ({ params, userId }) => {
    let { productId } = params;
    const dbQuery = await db.query(
      "select vendor_id from vendor where vendor_id=$1",
      [userId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError(
        "Vendor account does not exist. Create a vendor account"
      );
    const vendorId = dbQuery.rows[0].vendor_id;
    return await db.query(
      `select * from products where product_id=$1 and vendor_id=$2`,
      [productId, vendorId]
    );
  },
];

const updateQuery = [
  async ({ params, reqData, userId }) => {
    const dbQuery = await db.query(
      "select vendor_id from vendor where vendor_id=$1",
      [userId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError(
        "Vendor account does not exist. Create a vendor account"
      );
    const vendorId = dbQuery.rows[0].vendor_id;
    let { productId } = params,
      updateCommand = Update("products", "product_id", Object.keys(reqData));
    return await db.query(updateCommand + " and vendor_id=$2", [
      productId,
      ...Object.values(reqData),
      vendorId,
    ]);
  },
];

const deleteQuery = [
  async ({ params, userId }) => {
    let { productId } = params;
    const dbQuery = await db.query(
      "select vendor_id from vendor where vendor_id=$1",
      [userId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError(
        "Vendor account does not exist. Create a vendor account"
      );
    const vendorId = dbQuery.rows[0].vendor_id;
    return await db.query(
      `delete from products where product_id=$1 and vendor_id=$2`,
      [productId, vendorId]
    );
  },
];

let validateBody = (data: object): object => {
  const validData = ProductSchemaReq.validate(data);
  if (validData.error)
    throw new BadRequestError(
      "Invalid Data Schema: " + validData.error.message
    );
  return validData.value;
};

let validateListResult = (result: any, status: Status): ResponseData => {
  if (result.rowCount === 0)
    return {
      status: 404,
      data: { msg: "No products found. Please add a product for sale" },
    };
  return {
    status,
    data: result.rows,
  };
};

let validateResult = (result: any, status: Status): ResponseData => {
  if (result.rowCount === 0)
    return {
      status: 404,
      data: { msg: "Product not found" },
    };
  return {
    status,
    data: result.rows[result.rowCount - 1],
  };
};

let createProduct = processRoute(
  createQuery,
  { status: CREATED },
  validateBody,
  validateResult
);

let getAllProducts = processRoute(
  readAllQuery,
  { status: OK },
  undefined,
  validateListResult
);

let getProduct = processRoute(
  readQuery,
  { status: OK },
  undefined,
  validateResult
);

let updateProduct = processRoute(
  updateQuery,
  { status: OK },
  undefined,
  validateResult
);

let deleteProduct = processRoute(
  deleteQuery,
  { status: OK },
  undefined,
  validateResult
);

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
