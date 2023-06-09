import { StatusCodes } from "http-status-codes";
import { ProductSchemaReq } from "../../../../app-schema/products.js";
import db from "../../../../db/index.js";
import { BadRequestError } from "../../../../errors/index.js";
import {
  Insert,
  Update,
} from "../../../helpers/generate-sql-commands/index.js";
import processRoute from "../../../helpers/process-route.js";

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
  status: Status;
  data?: string | object;
};

const createQuery = [
  async ({ reqData, userId }) => {
    return await db.query(
      `${Insert("products", [
        ...Object.keys(reqData),
        "vendor_id",
      ])} returning product_id`,
      [...Object.values(reqData), userId]
    );
  },
];

const readAllQuery = [
  async ({ params }) => {
    return await db.query(`select * from products`);
  },
];

const readQuery = [
  async ({ params }) => {
    let { productId } = params;
    return await db.query(`select * from products where product_id=$1`, [
      productId,
    ]);
  },
];

const updateQuery = [
  async ({ params, reqData }) => {
    let { productId } = params,
      updateCommand = Update("products", "product_id", Object.keys(reqData));
    return await db.query(updateCommand, [
      productId,
      ...Object.values(reqData),
    ]);
  },
];

const deleteQuery = [
  async ({ params }) => {
    let { productId } = params;
    return await db.query(`delete from products where product_id=$1`, [
      productId,
    ]);
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
