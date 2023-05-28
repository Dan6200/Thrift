import integratedTests from "./integrated-tests";

/*
 * All Passed ...
 */
const NumberOfTests = 3;
let count = 0;
while (count < NumberOfTests)
  describe(`Testing User ${count + 1}`, integratedTests.bind(null, count++));
