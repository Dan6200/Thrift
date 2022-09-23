import Authentication from 'authentication';
import testUserAccount from 'accounts/user-account';

describe('Authentication Routes', Authentication);
describe('User Account Route', testUserAccount);
/*
describe('Create Customer Shipping Information', testCreateShippingInfo);
describe(
	'Customer Shipping Information',
	testGetShippingInfo.bind(null, !deleted)
);
describe('Update Customer Shipping Information', testUpdateShippingInfo);
describe(
	'Customer Shipping Information',
	testGetShippingInfo.bind(null, !deleted)
);
describe(
	'Get All Customer Shipping Information',
	testGetAllShippingInfo.bind(null, !deleted)
);
describe('Delete Customer Shipping Information', testDeleteShippingInfo);
describe(
	'Customer Shipping Information',
	testGetShippingInfo.bind(null, deleted)
);
*/
