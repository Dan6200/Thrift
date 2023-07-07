import { StatusCodes } from 'http-status-codes'
import { InsertInTable } from '../../helpers/generate-sql-commands/index.js'
import db from '../../../db/pg/index.js'

const uploadProductMedia = async (req: any, res: any) => {
	const { product_id: productId } = req.query
	const { description } = req.body
	let files = <any>await Promise.all(
		req.files.map(async (file: any) => {
			const { filename, path: filepath } = file
			// Returns filename as Id instead of product_id
			return (
				await db.query({
					text: InsertInTable(
						'product_media',
						['product_id', 'filename', 'filepath', 'description'],
						'filename, description'
					),
					values: [productId, filename, filepath, description],
				})
			).rows[0]
		})
	)
	res.status(StatusCodes.CREATED).send(files)
}

export { uploadProductMedia }