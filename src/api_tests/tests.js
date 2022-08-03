const { testRegistration, testLogin } = require('./authentication')
const { testGetAllAccounts, testCreateVendorAccount, testCreateCustomerAccount } = require('./accounts')

describe('Authentication Routes', testRegistration)
describe('Authentication Routes', testLogin)

describe('User Accounts Routes, Vendor account', testCreateVendorAccount)
describe('User Accounts Routes, Customer account', testCreateCustomerAccount)
describe('User Accounts Routes, All', testGetAllAccounts)
