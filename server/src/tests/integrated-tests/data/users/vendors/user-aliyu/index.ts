// cspell:disable
import { UserRequestData } from '../../../../../../types-and-interfaces/user.js'

export { stores, updatedStores } from './stores/index.js'
export {
  products,
  productReplaced,
  productPartialUpdate,
  productMedia,
  updatedProductMedia,
} from './stores/products/index.js'

const accountInfo: UserRequestData & { password: string } = {
  first_name: 'Aliyu',
  last_name: 'Mustapha',
  email: 'aliyumustapha@gmail.com',
  phone: '+2348063249250',
  password: 'Aliyo99!',
  dob: new Date('1999-07-01'),
  country: 'Nigeria',
}

const updatedAccountInfo = {
  dob: new Date('2000-06-08'),
} as UserRequestData

export { accountInfo, updatedAccountInfo }
