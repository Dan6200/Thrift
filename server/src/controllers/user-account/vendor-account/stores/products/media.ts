import { StatusCodes } from "http-status-codes";
import db from "../../../../../db/index.js";
import { Insert } from "../../../../helpers/generate-sql-commands/index.js";

const uploadProductMedia = async (req: any, res: any) => {
  const { productId } = req.params;
  const { description } = req.body;
  let results = <any>await Promise.all(
    req.files.map((file: any) => {
      const { filename, path: filepath } = file;
      return db.query(
        `${Insert("product_media", [
          "product_id",
          "filename",
          "filepath",
          "description",
        ])} returning filename`,
        [productId, filename, filepath, description]
      );
    })
  );
  const fileNames = results.map((result: any) => result.rows[0]);
  res.status(StatusCodes.CREATED).send(fileNames);
};

export { uploadProductMedia };
