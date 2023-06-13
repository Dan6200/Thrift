import { StatusCodes } from "http-status-codes";
import db from "../../../../../db/index.js";
import { Insert } from "../../../../helpers/generate-sql-commands/index.js";

const uploadProductMedia = async (req: any, res: any) => {
  const { productId } = req.params;
  console.log(req.file);
  const { filename, path: filepath } = req.file;
  const { description } = req.body;
  let dbQuery = await db.query(
    `${Insert("product_media", [
      "product_id",
      "filename",
      "filepath",
      "description",
    ])} returning filename`,
    [productId, filename, filepath, description]
  );
  let { rowCount }: { rowCount: number } = dbQuery;
  let lastInsert = rowCount ? rowCount - 1 : rowCount;
  res.status(StatusCodes.CREATED).send(dbQuery.rows[lastInsert]);
};

export { uploadProductMedia };
