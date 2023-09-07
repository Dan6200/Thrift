import { AccountData } from '../../../../../../types-and-interfaces/account.js'
import {
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
} from './shipping-info.js'

// Make sure test data is correct especially dates
const accountInfo: AccountData = {
  first_name: 'Aisha',
  last_name: 'Mohammed',
  email: 'aisha.mohammed@school.edu',
  phone: '234902539488',
  password: '236!a15HA04',
  dob: new Date('2004-6-23'),
  country: 'Nigeria',
}

const updatedAccountInfo: AccountData = {
  dob: new Date('2000-10-23'),
}

const updatedPassword: AccountData = {
  password: '236!a15HA04',
  // cspell:disable
  new_password: 'sgsdlaWEWRsdf23@#%#@',
}

export {
  accountInfo,
  updatedAccountInfo,
  updatedPassword,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}
