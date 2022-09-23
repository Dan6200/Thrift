import Authentication from 'authentication';
import testUserAccount from 'accounts/user-account';
import testShippingInfo from 'accounts/customer-account/shipping-info';

describe('Authentication Routes', Authentication);
describe('User Account Routes', testUserAccount);
describe('Customer Shipping Routes', testShippingInfo);
