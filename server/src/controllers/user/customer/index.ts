// import { StatusCodes } from 'http-status-codes'
// import {
//   ProcessRouteWithoutBody,
//   QueryParams,
// } from '../../../types-and-interfaces/process-routes.js'
// import createRouteProcessor from '../../routes/process.js'
// import { knex } from '../../../db/index.js'
// import { QueryResult, QueryResultRow } from 'pg'
// import { isSuccessful } from '../../utils/query-validation.js'
// import { CustomerSchemaID } from '../../../app-schema/customers.js'
//
// const { CREATED, OK } = StatusCodes
//
// /**
//  * @description Add a customer account to the database
//  **/
// const createQuery = async <T>({
//   userId: customerId,
// }: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
//   knex('customers').insert({ customer_id: customerId }).returning('customer_id')
//
// /**
//  * @description Delete the customer account from the database
//  **/
// const deleteQuery = async <T>({
//   userId: customerId,
// }: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
//   knex('customers')
//     .where('customer_id', customerId)
//     .del()
//     .returning('customer_id')
//
// const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
// const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor
//
// export const postCustomer = processPostRoute({
//   Query: createQuery,
//   status: CREATED,
//   validateResult: isSuccessful(CustomerSchemaID),
// })
//
// export const deleteCustomer = processDeleteRoute({
//   Query: deleteQuery,
//   status: OK,
//   validateResult: isSuccessful(CustomerSchemaID),
// })
