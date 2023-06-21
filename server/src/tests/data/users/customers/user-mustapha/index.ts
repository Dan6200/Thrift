import { UserData } from '../../../../../types-and-interfaces/user.js'
import {
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
} from './shipping-info.js'

const userInfo: UserData = {
	first_name: 'Mustapha',
	last_name: 'Mohammed',
	email: 'mustymomo1019@outlook.com',
	phone: '2348063245973',
	password: '123AishaBaggy9384',
	dob: new Date('2000-10-19'),
	country: 'Nigeria',
}

const updatedUserInfo: UserData = {
	first_name: 'Mustapha',
	last_name: 'Mohammed',
	dob: new Date('2000-1-24'),
}

const updatedPassword: UserData = {
	password: '123AishaBaggy9384',
	new_password: 'jay^a3245XF*!&$',
}

export {
	userInfo,
	updatedUserInfo,
	updatedPassword,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}
