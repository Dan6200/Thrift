// cspell:disable
import chai from "chai";
import {
  Insert,
  Update,
} from "../../controllers/helpers/generate-sql-commands/index.js";
import { handleSortQuery } from "../../controllers/helpers/generate-sql-commands/query-params-handler.js";

chai.should();

const SQLINSERT = `insert into my_table (
first_name,
last_name,
address,
age,
dob,
sex
) values ($1, $2, $3, $4, $5, $6)`;

const SQLUPDATE = `update my_table
set first_name = $2,
address = $3,
age = $4,
sex = $5
where my_id = $1`;

export default () => {
  it("it should generate sql statements given the inputs", () =>
    Insert("my_table", [
      "first_name",
      "last_name",
      "address",
      "age",
      "dob",
      "sex",
    ]).should.equal(SQLINSERT));

  it("it should generate sql statements given the inputs", () =>
    Update("my_table", "my_id", [
      "first_name",
      "address",
      "age",
      "sex",
    ]).should.equal(SQLUPDATE));

  it("it should create a database query from a query parameter input", () =>
    handleSortQuery("-list_price,-net_price,product_id").should.equal(
      `order by list_price desc, net_price desc, product_id asc`
    ));
};
