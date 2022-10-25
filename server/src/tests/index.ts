import Authentication from 'authentication';
import testUserAccount from 'accounts/user';
import testCustomerAccount from './accounts/user/customer-account';
import testShippingInfo from 'accounts/user/customer-account/shipping-info';
import testShop from './accounts/user/vendor-account/shop';

//describe('Authentication Routes', Authentication);
//describe('User Account Routes', testUserAccount);
describe('Customer Account Routes', testCustomerAccount);
//describe('Customer Shipping Routes', testShippingInfo);
describe('Vendor Shop Routes', testShop);
