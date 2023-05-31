// cspell:disable
import genSqlInsertCommand from "../../controllers/helpers/generate-sql-commands/insert";
import genSqlUpdateCommand from "../../controllers/helpers/generate-sql-commands/update";
import chai from "chai";

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
    genSqlInsertCommand("my_table", [
      "first_name",
      "last_name",
      "address",
      "age",
      "dob",
      "sex",
    ]).should.equal(SQLINSERT));

  it("it should generate sql statements given the inputs", () =>
    genSqlUpdateCommand("my_table", "my_id", [
      "first_name",
      "address",
      "age",
      "sex",
    ]).should.equal(SQLUPDATE));
};
