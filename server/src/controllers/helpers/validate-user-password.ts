import db from '../../db/pg/index.js'
import { validatePassword } from '../../security/password.js'
import { SelectFromTable } from './generate-sql-commands/index.js'

export default async (
	Id: string,
	candidatePassword: string
): Promise<boolean> => {
	let { password }: { password: Buffer } = (
		await db.query({
			text: SelectFromTable('user_accounts', ['password'], 'user_id=$1'),
			values: [Id],
		})
	).rows[0]
	const isMatch: boolean = await validatePassword(
		candidatePassword,
		password.toString()
	)
	return isMatch
}
