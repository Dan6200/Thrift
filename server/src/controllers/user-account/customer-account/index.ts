import { StatusCodes } from "http-status-codes";
import db from "../../../db/index.js";
import processRoute from "../../helpers/process-route.js";
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;

type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
  status: Status;
  data?: string | object;
};

const createQuery = [
    ({ userId }) => db.query(`insert into customers values($1)`, [userId]),
  ],
  readQuery = [
    ({ userId }) =>
      db.query(`select * from customers where customer_id=$1`, [userId]),
  ],
  deleteQuery = [() => db.query(`delete from customers`)],
  validateResult = (result: any, status: Status): ResponseData => {
    if (result.rowCount === 0)
      return {
        status: 404,
        data: "Route does not exit",
      };
    return {
      status,
      data: result.rows[result.rowCount - 1],
    };
  };

let createCustomerAccount = processRoute(createQuery, { status: CREATED }),
  getCustomerAccount = processRoute(
    readQuery,
    { status: OK },
    undefined,
    validateResult
  ),
  deleteCustomerAccount = processRoute(
    deleteQuery,
    { status: NO_CONTENT },
    undefined
  );

export { createCustomerAccount, getCustomerAccount, deleteCustomerAccount };
