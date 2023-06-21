import { UserData } from '../../../../../types-and-interfaces/user.js'
import { stores, updatedStores } from './stores/index.js'

const userInfo: UserData = {
	first_name: 'Aliya',
	last_name: 'Mustapha',
	email: 'aliyumustapha@gmail.com',
	phone: '+2348063249250',
	password: 'Aliyo99',
	dob: new Date('1999-07-01'),
	country: 'Nigeria',
}

const updatedUserInfo: UserData = {
	email: 'aliyumustapha99@gmail.com',
	phone: '+2348063249123',
	dob: new Date('2000-06-08'),
}

const updatedPassword: UserData = {
	password: 'Aliyo99!',
	new_password: 'AliMu99$',
}

export { userInfo, updatedUserInfo, updatedPassword, stores, updatedStores }
