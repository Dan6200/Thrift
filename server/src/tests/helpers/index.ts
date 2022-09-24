import registration from './registration';
import login from './login';
import createShipping from './create-shipping';
import {
	deleteUser,
	getDeletedUser,
	getUser,
	patchUser,
	patchUserPassword,
} from './user';

export {
	registration,
	login,
	getUser,
	patchUser,
	patchUserPassword,
	deleteUser,
	getDeletedUser,
	createShipping,
};
