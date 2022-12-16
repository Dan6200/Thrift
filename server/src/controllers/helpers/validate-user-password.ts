import db from '../../db';
import { validatePassword } from '../../security/password';

export default async (
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
	const isMatch: boolean = await validatePassword(
		candidatePassword,
		password.toString()
	);
	return isMatch;
};
