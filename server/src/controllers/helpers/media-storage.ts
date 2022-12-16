import { diskStorage } from 'multer';
import path from 'path';

export default diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../../uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});
