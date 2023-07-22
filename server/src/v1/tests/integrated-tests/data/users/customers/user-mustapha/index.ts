// cspell: disable
import { AccountData } from '../../../../../../types-and-interfaces/account.js'
import {
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
} from './shipping-info.js'

const accountInfo: AccountData = {
	first_name: 'Mustapha',
	last_name: 'Mohammed',
	email: 'mustymomo1019@outlook.com',
	phone: '2348063245973',
	password: '123AishaBaggy9384',
	dob: new Date('2000-10-19'),
	country: 'Nigeria',
}

const updatedAccountInfo: AccountData = {
	first_name: 'Mustapha',
	last_name: 'Mohammed',
	dob: new Date('2000-1-24'),
}

const updatedPassword: AccountData = {
	password: '123AishaBaggy9384',
	new_password: 'jay^a3245XF*!&$',
}

export {
	accountInfo,
	updatedAccountInfo,
	updatedPassword,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}
