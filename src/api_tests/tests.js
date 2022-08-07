const { testRegistration, testLogin } = require('./authentication')
const { testGetUserAccount, testCreateVendorAccount, testCreateCustomerAccount } = require('./accounts')

describe('Authentication Routes', testRegistration)
describe('Authentication Routes', testLogin)

describe('User Accounts Routes, Vendor account', testCreateVendorAccount)
describe('User Accounts Routes, Customer account', testCreateCustomerAccount)
describe('User Accounts Route', testGetUserAccount)
