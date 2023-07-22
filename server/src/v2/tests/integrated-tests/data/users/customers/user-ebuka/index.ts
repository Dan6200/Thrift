// cspell: disable
import { AccountData } from '../../../../../../types-and-interfaces/account.js'
import {
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
} from './shipping-info.js'

const accountInfo: AccountData = {
	first_name: 'Ebuka',
	last_name: 'Eze',
	email: 'ebukachibueze5489@gmail.com',
	phone: '+2348032649250',
	password: 'EbukaDa1!',
	dob: new Date('1999-07-01'),
	country: 'Nigeria',
}

const updatedAccountInfo: AccountData = {
	country: 'Ghana',
	first_name: 'John',
	dob: new Date('2003-06-08'),
}

const updatedPassword: AccountData = {
	password: 'EbukaDa1!',
	new_password: 'jayafd3245XF*!&$',
}

export {
	accountInfo,
	updatedAccountInfo,
	updatedPassword,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}
