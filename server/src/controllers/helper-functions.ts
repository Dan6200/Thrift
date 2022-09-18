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
	fields: string[],
	offset: number
): string => {
	let setFieldsToNewValues = 'set ';
	const last = fields.length - 1;
	for (let i = 0; i < last; i++) {
		setFieldsToNewValues += `${fields[i]} = $${i + offset}, `;
	}
	setFieldsToNewValues += `${fields[last]} = $${last + offset}`;
	return `update ${table}
		${setFieldsToNewValues}
		where ${idName} = $1`;
};

export { validateUserPassword, genSqlUpdateCommands };
