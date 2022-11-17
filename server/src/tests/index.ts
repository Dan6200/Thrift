import Authentication from 'authentication';
import testUserAccount from 'accounts/user';
import testCustomerAccount from './accounts/user/customer-account';
import testVendorAccount from './accounts/user/vendor-account';
import testShippingInfo from 'accounts/user/customer-account/shipping-info';
import testShop from './accounts/user/vendor-account/shop';
import testProduct from './accounts/user/vendor-account/product';

/*
 * TODO: fix concurrency issues with these tests
 */
/*
describe('Customer Shipping Routes', testShippingInfo);
describe('Vendor Shop Routes', testShop);
describe('User Account Routes', testUserAccount);
describe('Customer Account Routes', testCustomerAccount);
*/
describe('Authentication Routes', Authentication);
describe('Vendor Account Routes', testVendorAccount);
describe('Product Routes', testProduct);
