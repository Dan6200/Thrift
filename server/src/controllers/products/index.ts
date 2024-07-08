import { StatusCodes } from 'http-status-codes'
import {
  ProductResponseSchema,
  ProductIdSchema,
  ProductListResponseSchema,
  ProductRequestSchema,
} from '../../app-schema/products.js'
import {
  ProcessRoute,
  ProcessRouteWithForwarder,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import {
  validateReqData,
  validateResData,
} from '../helpers/query-validation.js'
import {
  getAllQueryForwarder,
  getQueryForwarder,
} from './utils/retrieve-query.js'
import createQuery from './utils/create-query.js'
import updateQuery from './utils/update-query.js'
import deleteQuery from './utils/delete-query.js'
import { QueryResult, QueryResultRow } from 'pg'

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
const processGetAllRoute = <ProcessRouteWithForwarder>processRoute
const processGetRoute = <ProcessRouteWithForwarder>processRoute
const processPutRoute = <ProcessRoute>processRoute
const processDeleteRoute = <ProcessRouteWithoutBody>processRoute

//cspell:ignore DBID
const createProduct = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ProductSchemaReq),
  validateResult: validateResData(ProductSchemaDBID),
})

const getAllProducts = processGetAllRoute({
  QueryForwarder: getAllQueryForwarder,
  status: OK,
  validateResult: validateResData(ProductSchemaDBList),
})

const getProduct = processGetRoute({
  QueryForwarder: getQueryForwarder,
  status: OK,
  validateResult: validateResData(ProductSchemaDB),
})

const updateProduct = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ProductSchemaReq),
  validateResult: validateResData(ProductSchemaDBID),
})

const deleteProduct = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(ProductSchemaDBID),
})

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
