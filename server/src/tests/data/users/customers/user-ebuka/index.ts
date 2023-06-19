import * as shipping from './shipping-info.js'
import * as payments from './payment-info.js'
import { UserData } from '../../../../../types-and-interfaces/user.js'

const userInfo: UserData = {
	first_name: 'Ebuka',
	last_name: 'Eze',
	email: 'ebukachibueze5489@gmail.com',
	phone: '+2348063249250',
	password: 'EbukaDa1!',
	dob: new Date('1999-07-01'),
	country: 'Nigeria',
}

const updatedUserInfo: UserData = {
	country: 'Ghana',
	first_name: 'John',
	dob: new Date('2003-06-08'),
}

const updatedPassword: UserData = {
	password: 'EbukaDa1!',
	new_password: 'jayafd3245XF*!&$',
}

export { userInfo, updatedUserInfo, updatedPassword, shipping, payments }
