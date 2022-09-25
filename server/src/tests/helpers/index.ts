//TODO: consolidate functions with similar logic
import registration from './registration';
import login from './login';
import {
	deleteUser,
	getDeletedUser,
	getUser,
	patchUser,
	patchUserPassword,
} from './user';
import {
	createShipping,
	deleteShipping,
	getAllShipping,
	getShipping,
	updateShipping,
	getDeletedShipping,
	getAllDeletedShipping,
} from './shipping';

export {
	registration,
	login,
	getUser,
	patchUser,
	patchUserPassword,
	deleteUser,
	getDeletedUser,
	createShipping,
	getShipping,
	getAllShipping,
	updateShipping,
	deleteShipping,
	getDeletedShipping,
	getAllDeletedShipping,
};
