import db from '../../db/index.js'
import { validatePassword } from '../../security/password.js'
import { Select } from './generate-sql-commands/index.js'

export default async (
	Id: string,
	candidatePassword: string
): Promise<boolean> => {
	let { password }: { password: Buffer } = (
		await db.query({
			text: Select('user_accounts', ['password'], 'user_id=$1'),
			values: [Id],
		})
	).rows[0]
	const isMatch: boolean = await validatePassword(
		candidatePassword,
		password.toString()
	)
	return isMatch
}
