import integratedTests from "./integrated-tests";
import unitTests from "./unit-tests";

/*
 * All Passed ...
 */
const NumberOfUsers = 1;
let count = 0;

describe("Testing sql command generators", unitTests);
while (count < NumberOfUsers)
  describe(`Testing User ${count + 1}`, integratedTests.bind(null, count++));
