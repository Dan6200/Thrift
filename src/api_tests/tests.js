const { testRegistration, testLogin } = require('./authentication')
const { 
	testGetUserAccount, 
	testCreateVendorAccount, 
	testCreateCustomerAccount, 
	testUpdateUserAccount,
}									  = require('./accounts')

describe('Authentication Routes', testRegistration)
describe('Authentication Routes', testLogin.bind(null, 2))

describe('User Accounts Routes, Vendor account', testCreateVendorAccount)
describe('User Accounts Routes, Customer account', testCreateCustomerAccount)
describe('User Accounts Route', testGetUserAccount)
describe('User Accounts Route', testUpdateUserAccount)
describe('User Accounts Route', testGetUserAccount)
describe('Authentication Routes', testLogin.bind(null, 2))
