import Authentication from 'authentication';
import testUserAccount from 'accounts/user-account';
import testShippingInfo from 'accounts/customer-account/shipping-info';
import testShop from './accounts/vendor-account/shop';

describe('Authentication Routes', Authentication);
describe('User Account Routes', testUserAccount);
describe('Customer Shipping Routes', testShippingInfo);
describe('Vendor Shop Routes', testShop);
