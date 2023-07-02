import db from '../../db/pg/index.js'
import { AccountDataSchemaRequest } from '../../app-schema/account.js'
import BadRequestError from '../../errors/bad-request.js'
import { AccountData } from '../../types-and-interfaces/account.js'
import { SelectFromTable } from './generate-sql-commands/index.js'

export async function validateAccountData(userData: AccountData) {
	const schemaValidate = AccountDataSchemaRequest.validate(userData)
	if (schemaValidate.error)
		throw new BadRequestError(
			'Invalid User Data: ' + schemaValidate.error.message
		)
	const validData = schemaValidate.value
	const { phone, email } = validData
	if (email) {
		const emailNotUniq =
			(
				await db.query({
					text: SelectFromTable('user_accounts', ['1'], 'email=$1'),
					values: [email],
				})
			).rows.length > 0
		if (emailNotUniq) throw new BadRequestError(`email already exists`)
		validData.phone = null
	}

	if (phone) {
		const phoneNotUniq =
			(
				await db.query({
					text: SelectFromTable('user_accounts', ['1'], 'phone=$1'),
					values: [phone],
				})
			).rows.length > 0
		if (phoneNotUniq) throw new BadRequestError(`phone number already exists`)
		validData.email = null
	}
	return validData
}
