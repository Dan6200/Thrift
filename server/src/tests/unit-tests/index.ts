// cspell:disable
import chai from 'chai'
import {
  InsertRecord,
  SelectRecord,
  UpdateRecord,
} from '../../controllers/helpers/generate-sql-commands/index.js'
import { handleSortQuery } from '../../controllers/helpers/generate-sql-commands/query-params-handler.js'

chai.should()

const SQLSELECT1 = `select first_name,
last_name,
address,
age,
dob,
sex from my_table where my_id=$1`

const SQLSELECT2 = `select * from my_table where my_id=$1`

const SQLINSERT = `insert into my_table (
first_name,
last_name,
address,
age,
dob,
sex
) values ($1, $2, $3, $4, $5, $6) returning my_id`

const SQLINSERT2 = `insert into my_table (
first_name
) values ($1) returning my_id`

const SQLUPDATE = `update my_table
set first_name = $2,
address = $3,
age = $4,
sex = $5
where my_id=$1 returning my_id`

const SQLUPDATE2 = `update my_table
set address = $2
where my_id=$1 returning my_id`

export default () => {
  it('it should generate the correct sql INSERT statement given its inputs', () =>
    InsertRecord(
      'my_table',
      ['first_name', 'last_name', 'address', 'age', 'dob', 'sex'],
      'my_id'
    ).should.equal(SQLINSERT))

  it('it should generate the correct sql INSERT statement given its inputs', () =>
    InsertRecord('my_table', ['first_name'], 'my_id').should.equal(SQLINSERT2))

  it('it should generate the correct sql UPDATE statement given its inputs', () =>
    UpdateRecord(
      'my_table',
      'my_id',
      ['first_name', 'address', 'age', 'sex'],
      2,
      'my_id=$1'
    ).should.equal(SQLUPDATE))

  it('it should generate the correct sql UPDATE statement given its inputs', () =>
    UpdateRecord('my_table', 'my_id', ['address'], 2, 'my_id=$1').should.equal(
      SQLUPDATE2
    ))

  it('it should create a database query from a query parameter input', () =>
    handleSortQuery('-list_price,-net_price,product_id').should.equal(
      `order by list_price desc, net_price desc, product_id asc`
    ))

  it('it should create a database query from a query parameter input', () =>
    handleSortQuery('product_id,list_price,-net_price').should.equal(
      `order by product_id asc, list_price asc, net_price desc`
    ))

  it('it should generate the correct sql SELECT statement given its inputs', () =>
    SelectRecord('my_table', ['*'], 'my_id=$1').should.equal(SQLSELECT2))

  it('it should generate the correct sql SELECT statement given its inputs', () =>
    SelectRecord(
      'my_table',
      ['first_name', 'last_name', 'address', 'age', 'dob', 'sex'],
      'my_id=$1'
    ).should.equal(SQLSELECT1))
}
