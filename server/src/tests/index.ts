import testCustomerAccount from "./accounts/user/customer-account";
import testShippingInfo from "./accounts/user/customer-account/shipping-info";
import testVendorAccount from "./accounts/user/vendor-account";
import testShop from "./accounts/user/vendor-account/shop";
import testProduct from "./accounts/user/vendor-account/product";
import testUserAccount from "./accounts/user";
import integratedTests from "./integrated-tests";

/*
 * All Passed ...
 */
const NumberOfTests = 2;
let count = 0;
while (count < NumberOfTests)
  describe(`Testing User ${count + 1}`, integratedTests.bind(null, count++));
// describe('User Account Routes', testUserAccount);
// describe('Customer Account Routes', testCustomerAccount);
// describe('Vendor Account Routes', testVendorAccount);
// describe('Vendor Shop Routes', testShop);
// describe('Customer Shipping Routes', testShippingInfo);
// describe('Product Routes', testProduct);
