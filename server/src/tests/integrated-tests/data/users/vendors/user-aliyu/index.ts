import { AccountData } from '../../../../../../types-and-interfaces/account.js'

export { stores, updatedStores } from './stores/index.js'
export {
	products,
	productReplaced,
	productPartialUpdate,
	productMedia,
	updatedProductMedia,
} from './stores/products/index.js'

const accountInfo: AccountData = {
	first_name: 'Aliyu',
	last_name: 'Mustapha',
	email: 'aliyumustapha@gmail.com',
	phone: '+2348063249250',
	password: 'Aliyo99!',
	dob: new Date('1999-07-01'),
	country: 'Nigeria',
}

const updatedAccountInfo: AccountData = {
	dob: new Date('2000-06-08'),
}

const updatedPassword: AccountData = {
	password: 'Aliyo99!',
	new_password: 'AliMu99$',
}

export { accountInfo, updatedAccountInfo, updatedPassword }
