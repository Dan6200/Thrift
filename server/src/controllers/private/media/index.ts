import { StatusCodes } from 'http-status-codes'
import {
	InsertInTable,
	UpdateInTable,
} from '../../helpers/generate-sql-commands/index.js'
import db from '../../../db/pg/index.js'

const uploadProductMedia = async (req: any, res: any) => {
	const { product_id: productId } = req.query
	const { description } = req.body
	let files = <any>await Promise.all(
		req.files.map(async (file: any) => {
			const { filename, path: filepath, is_display_image } = file
			// Returns filename as Id instead of product_id
			const res = (
				await db.query({
					text: InsertInTable(
						'product_media',
						['product_id', 'filename', 'filepath', 'description'],
						'filename'
					),
					values: [productId, filename, filepath, description],
				})
			).rows[0]

			if (is_display_image)
				await db.query({
					text: UpdateInTable('product_display_image', 'filename', [
						'filename',
					]),
					values: [filename],
				})

			return res
		})
	)

	res.status(StatusCodes.CREATED).send(files)
}

export { uploadProductMedia }
