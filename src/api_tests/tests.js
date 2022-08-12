const { testRegistration, testLogin } = require('./authentication')
const { 
	testGetUserAccount, 
	testCreateVendorAccount, 
	testCreateCustomerAccount, 
	testUpdateUserAccount,
	testDeleteUserAccount,
}									  = require('./accounts')

describe('Authentication Routes', testRegistration)
describe('Authentication Routes', testLogin.bind(null, 1))

describe('User Accounts Routes, Vendor account', testCreateVendorAccount)
describe('User Accounts Routes, Customer account', testCreateCustomerAccount)
describe('User Accounts Route', testGetUserAccount.bind(null, 2))
describe('User Accounts Route', testUpdateUserAccount)
describe('Authentication Routes', testLogin.bind(null, 2))
describe('User Accounts Route', testDeleteUserAccount)
describe('User Accounts Route', testGetUserAccount.bind(null, 2))
