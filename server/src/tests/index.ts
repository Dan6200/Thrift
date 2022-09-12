import { testRegistration, testLogin } from 'authentication';

import {
	testGetUserAccount,
	testUpdateUserAccount,
	testDeleteUserAccount,
	testCreateShippingInfo,
	testGetShippingInfo,
	testUpdateShippingInfo,
	testDeleteShippingInfo,
} from 'accounts';

const deleted = true;

describe('Authentication Routes', testRegistration);
describe('Authentication Routes', testLogin.bind(null, 1));

describe('User Accounts Route', testGetUserAccount.bind(null, !deleted));
describe('User Accounts Route', testUpdateUserAccount);
describe('User Accounts Route', testGetUserAccount.bind(null, !deleted));
describe('User Accounts Route', testDeleteUserAccount);
describe('User Accounts Route', testGetUserAccount.bind(null, deleted));
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
describe('Delete Customer Shipping Information', testDeleteShippingInfo);
describe(
	'Customer Shipping Information',
	testGetShippingInfo.bind(null, deleted)
);
