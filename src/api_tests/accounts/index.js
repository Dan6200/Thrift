require('express-async-errors')

const {
	testGetUserAccount,
	testDeleteUserAccount,
	testUpdateUserAccount,
	testGetUserAccountAfterDelete,
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
	testGetUserAccountAfterDelete,

	testCreateCustomerAccount,
	testGetCustomerAccount,
	testUpdateCustomerAccount,
	testDeleteCustomerAccount,
	testGetCustomerAccountAfterDelete,

	testCreateVendorAccount,
	testGetVendorAccount,
	testUpdateVendorAccount,
	testDeleteVendorAccount,
	testGetVendorAccountAfterDelete,
}
