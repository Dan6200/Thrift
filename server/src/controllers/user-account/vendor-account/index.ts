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
    ({ userId }) =>
      db.query(`insert into vendor values($1) returning vendor_id`, [userId]),
  ],
  readQuery = [
    ({ userId }) =>
      db.query(`select * from vendor where vendor_id=$1`, [userId]),
  ],
  deleteQuery = [() => db.query(`delete from vendor`)],
  validateResult = (result: any, status: Status): ResponseData => {
    if (result.rowCount === 0) {
      if (result.command === "SELECT") {
        return {
          status: NOT_FOUND,
          data: "Route does not exit",
        };
      }
      if (result.command === "INSERT")
        throw new Error("INSERT operation failed");
    }
    return {
      status,
      data: result.rows[result.rowCount - 1],
    };
  };

let createVendorAccount = processRoute(
    createQuery,
    { status: CREATED },
    undefined,
    validateResult
  ),
  getVendorAccount = processRoute(
    readQuery,
    { status: OK },
    undefined,
    validateResult
  ),
  deleteVendorAccount = processRoute(
    deleteQuery,
    { status: NO_CONTENT },
    undefined
  );

export { createVendorAccount, getVendorAccount, deleteVendorAccount };
