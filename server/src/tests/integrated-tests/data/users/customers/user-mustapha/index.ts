// cspell: disable
import { UserRequestData } from '../../../../../../types-and-interfaces/user.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

const accountInfo: UserRequestData & { password: string } = {
  first_name: 'Mustapha',
  last_name: 'Mohammed',
  email: 'mustymomo1019@outlook.com',
  phone: '2348063245973',
  password: '!23AishaBaggy9384',
  dob: new Date('2000-10-19'),
  country: 'Nigeria',
}

const updatedAccountInfo = {
  first_name: 'Mustapha',
  last_name: 'Mohammed',
  dob: new Date('2000-1-24'),
} as UserRequestData

export {
  accountInfo,
  updatedAccountInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
