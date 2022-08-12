require('express-async-errors')

const {
	testGetUserAccount,
	testDeleteUserAccount,
	testUpdateUserAccount,
} = require ('./user-account'), 

	{
	testGetCustomerAccount,
	testCreateCustomerAccount,
	testDeleteCustomerAccount,
	testUpdateCustomerAccount,
} = require ('./customer-account'),

	{
	testGetVendorAccount,
	testCreateVendorAccount,
	testDeleteVendorAccount,
	testUpdateVendorAccount,
} = require ('./vendor-account')

module.exports = {
	testGetUserAccount,
	testUpdateUserAccount,
	testDeleteUserAccount,

	testCreateCustomerAccount,
	testGetCustomerAccount,
	testUpdateCustomerAccount,
	testDeleteCustomerAccount,

	testCreateVendorAccount,
	testGetVendorAccount,
	testUpdateVendorAccount,
	testDeleteVendorAccount,
}
