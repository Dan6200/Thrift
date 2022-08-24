import { testRegistration, testLogin } from './authentication';
const deleted = true;
describe('Authentication Routes', testRegistration);
describe('Authentication Routes', testLogin.bind(null, 1));
/*
describe('User Accounts Route', testGetUserAccount.bind(null, !deleted));

describe('User Accounts Route', testUpdateUserAccount);
describe('User Accounts Route', testGetUserAccount.bind(null, !deleted));
describe('Authentication Routes', testLogin.bind(null, 2));

describe('User Accounts Route', testDeleteUserAccount);
describe('User Accounts Route', testGetUserAccount.bind(null, deleted));

describe('Authentication Routes', testRegistration);
describe('User Accounts Routes, Vendor account', testCreateVendorAccount);
describe(
    'User Accounts Routes, Vendor account',
    testGetVendorAccount.bind(null, !deleted)
);
describe('User Accounts Routes, Vendor account', testDeleteVendorAccount);
describe(
    'User Accounts Routes, Vendor account',
    testGetVendorAccount.bind(null, deleted)
);

describe('User Accounts Routes, Customer account', testCreateCustomerAccount);
describe(
    'User Accounts Routes, Customer account',
    testGetCustomerAccount.bind(null, !deleted)
);
describe('User Accounts Routes, Customer account', testDeleteCustomerAccount);
describe(
    'User Accounts Routes, Customer account',
    testGetCustomerAccount.bind(null, deleted)
);
*/
