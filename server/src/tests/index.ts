import integratedTests from "./integrated-tests/index.js";
import unitTests from "./unit-tests/index.js";

/*
 * All Passed ...
 */
const NumberOfUsers = 1;
let count = 0;

describe("Testing sql command generators", unitTests);
while (count < NumberOfUsers)
  describe(`Testing User ${count + 1}`, integratedTests.bind(null, count++));
