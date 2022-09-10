import db from '../db';
import { validatePassword } from '../security/password';

const changeUserPasswd = async (
	Id: string,
	oldPassword: string,
	newPassword: string
) => {
	let { password }: { password: Buffer } = (
		await db.query(
			`select password from user_account
		where user_id = $1`,
			[Id]
		)
	).rows[0];

	return await validatePassword(oldPassword, password.toString());
};

const genSqlUpdateCommands = (fields: string[], offset: number) => {
	let command = 'set ';
	const last = fields.length - 1;
	for (let i = 0; i < last; i++) {
		command += `${fields[i]} = $${i + offset}, `;
	}
	command += `${fields[last]} = $${last + offset}`;
	return command;
};

export { changeUserPasswd, genSqlUpdateCommands };
