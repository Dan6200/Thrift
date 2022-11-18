import db from 'db';
import { validatePassword } from 'security/password';

const validateUserPassword = async (
	Id: string,
	candidatePassword: string
): Promise<boolean> => {
	let { password }: { password: Buffer } = (
		await db.query(
			`select password from user_account
		where user_id = $1`,
			[Id]
		)
	).rows[0];
	return await validatePassword(candidatePassword, password.toString());
};

const genSqlUpdateCommands = (
	table: string,
	idName: string,
	fields: string[]
): string => {
	let setFieldsToNewValues = 'set ';
	const last = fields.length - 1;
	// db query param list starts from 2
	const OFFSET = 2;
	for (let i = 0; i < last; i++) {
		setFieldsToNewValues += `${fields[i]} = $${i + OFFSET}, `;
	}
	setFieldsToNewValues += `${fields[last]} = $${last + OFFSET}`;
	let output = `update ${table}
		${setFieldsToNewValues}
		where ${idName} = $1`;
	return output;
};

export { validateUserPassword, genSqlUpdateCommands };
