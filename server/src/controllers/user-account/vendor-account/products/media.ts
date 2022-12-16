import { StatusCodes } from 'http-status-codes';
import db from '../../../../db';

const uploadProductMedia = async (req: any, res: any) => {
	const { productId } = req.params;
	const {
		filename,
		path: filepath,
		size: filesize,
		mimetype,
		encoding,
	} = req.file;
	const { description } = req.body;
	let dbQuery = await db.query(
		`insert into product_media values ($1, $2, $3, $4, $5, $6, $7) returning product_id`,
		[
			productId,
			filename,
			filepath,
			filesize,
			mimetype,
			encoding,
			description,
		]
	);
	let { rowCount }: { rowCount: number } = dbQuery;
	let lastInsert = rowCount ? rowCount - 1 : rowCount;
	res.status(StatusCodes.CREATED).send(dbQuery.rows[lastInsert]);
};

export { uploadProductMedia };
