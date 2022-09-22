import { testRegistration, testLogin } from 'authentication';

import {
	testGetUserAccount,
	testUpdateUserAccount,
	testUpdateUserPassword,
	testDeleteUserAccount,
	testCreateShippingInfo,
	testGetShippingInfo,
	testGetAllShippingInfo,
	testUpdateShippingInfo,
	testDeleteShippingInfo,
} from 'accounts';

const deleted = true;

describe('Authentication Routes', testRegistration);
describe('Authentication Routes', testLogin.bind(null, 1));

describe('User Accounts Route', testGetUserAccount.bind(null, !deleted));
describe('User Info Route', testUpdateUserAccount);
describe('User Password Route', testUpdateUserPassword);
describe('User Info Route', testGetUserAccount.bind(null, !deleted));
describe('User Info Route', testDeleteUserAccount);
describe('User Info Route', testGetUserAccount.bind(null, deleted));
describe('Authentication Routes', testRegistration);

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
