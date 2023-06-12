import assert from "assert";
import { log } from "console";
import { StatusCodes } from "http-status-codes";
import {
  ProductSchemaReq,
  ProductSchemaUpdateReq,
} from "../../../../../app-schema/products.js";
import db from "../../../../../db/index.js";
import BadRequestError from "../../../../../errors/bad-request.js";
import {
  Insert,
  Update,
} from "../../../../helpers/generate-sql-commands/index.js";
import { handleSortQuery } from "../../../../helpers/generate-sql-commands/query-params-handler.js";
import processRoute from "../../../../helpers/process-route.js";

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
  status: Status;
  data?: string | object;
};

const createQuery = [
  async ({ reqData, params, userId: vendorId }) => {
    // this makes sure the Store exists before accessing the /user/stores/products endpoint
    const { storeId } = params;
    const dbQuery = await db.query(
      "select store_id from stores where store_id=$1",
      [storeId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError("Store does not exist. Create a store");
    assert(storeId === dbQuery.rows[0].store_id);
    return await db.query(
      `${Insert("products", [
        ...Object.keys(reqData),
        "store_id",
        "vendor_id",
      ])} returning product_id`,
      [...Object.values(reqData), storeId, vendorId]
    );
  },
];

const readAllQuery = [
  async ({ query, limit, offset, params }) => {
    let { sort } = query;
    const { storeId } = params;
    const dbQuery = await db.query(
      "select store_id from stores where store_id=$1",
      [storeId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError("Store does not exist. Create a store");
    assert(storeId === dbQuery.rows[0].store_id);
    // TODO: you may not need to store anything except the public_id of image in db
    let queryString = `select select products.*, product_media.filepath from products inner join product_media using (product_id) where store_id=$1`;
    if (sort) {
      queryString += ` ${handleSortQuery(sort)}`;
    }
    if (limit) queryString += ` limit ${limit}`;
    if (offset) queryString += ` offset ${offset}`;
    log(queryString);
    return await db.query(queryString, [storeId]);
  },
];

const readQuery = [
  async ({ params }) => {
    let { storeId, productId } = params;
    const dbQuery = await db.query(
      "select store_id from stores where store_id=$1",
      [storeId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError("Store does not exist. Create a store");
    assert(storeId === dbQuery.rows[0].store_id);
    return await db.query(
      `select * from products where product_id=$1 and store_id=$2`,
      [productId, storeId]
    );
  },
];

const updateQuery = [
  async ({ params, reqData }) => {
    const { productId, storeId } = params;
    const dbQuery = await db.query(
      "select store_id from stores where store_id=$1",
      [storeId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError("Store does not exist. Create a store");
    assert(storeId === dbQuery.rows[0].store_id);
    const updateCommand = Update(
      "products",
      "product_id",
      Object.keys(reqData)
    );
    return await db.query(updateCommand, [
      productId,
      ...Object.values(reqData),
    ]);
  },
];

const deleteQuery = [
  async ({ params, userId }) => {
    const { productId, storeId } = params;
    const dbQuery = await db.query(
      "select store_id from stores where store_id=$1",
      [storeId]
    );
    if (!dbQuery.rowCount)
      throw new BadRequestError("Store does not exist. Create a store");
    assert(storeId === dbQuery.rows[0].store_id);
    return await db.query(
      `delete from products where product_id=$1 and store_id=$2`,
      [productId, storeId]
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

let validateBodyPatchUpdate = (data: object): object => {
  const validData = ProductSchemaUpdateReq.validate(data);
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
  validateBodyPatchUpdate,
  validateResult
);

let updateProductBulkEdit = processRoute(
  updateQuery,
  { status: OK },
  validateBody,
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
  updateProductBulkEdit,
  deleteProduct,
};
