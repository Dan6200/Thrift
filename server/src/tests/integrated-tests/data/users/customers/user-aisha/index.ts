import { UserData } from '../../../../../../types-and-interfaces/user.js'
import {
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
} from './shipping-info.js'

// Make sure test data is correct especially dates
const userInfo: UserData = {
	first_name: 'Aisha',
	last_name: 'Mohammed',
	email: 'aisha.mohammed@school.edu',
	phone: '234902539488',
	password: '236!A15HA04',
	dob: new Date('2004-6-23'),
	country: 'Nigeria',
}

const updatedUserInfo: UserData = {
	dob: new Date('2000-10-23'),
}

const updatedPassword: UserData = {
	password: '236!A15HA04',
	new_password: 'sgsdlaWEWRsdf23@#%#@',
}

export {
	userInfo,
	updatedUserInfo,
	updatedPassword,
	listOfShippingInfo,
	listOfUpdatedShippingInfo,
}
