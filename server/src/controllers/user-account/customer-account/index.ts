import { StatusCodes } from "http-status-codes";
import db from "../../../db";
import processRoute from "../../helpers/process-route";
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;

type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
  status: Status;
  data?: string | object;
};

const createQuery = [
    ({ userId }) => db.query(`insert into customer values($1)`, [userId]),
  ],
  readQuery = [
    ({ userId }) =>
      db.query(`select * from customer where customer_id=$1`, [userId]),
  ],
  deleteQuery = [() => db.query(`delete from customer`)],
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
