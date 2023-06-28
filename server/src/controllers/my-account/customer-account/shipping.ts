import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import {
	ShippingInfoSchemaReq,
	ShippingInfoSchemaDBList,
	ShippingInfoSchemaDBLean,
	ShippingInfoSchemaDB,
} from '../../../app-schema/customer/shipping.js'
import db from '../../../db/pg/index.js'
import { BadRequestError } from '../../../errors/index.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../../types-and-interfaces/request.js'
import {
	DeleteInTable,
	InsertInTable,
	SelectFromTable,
	UpdateInTable,
} from '../../helpers/generate-sql-commands/index.js'

const createShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId }: RequestUserPayload = request.user
	const validData = ShippingInfoSchemaReq.validate(request.body)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const shippingData = validData.value
	// Limit the amount of shipping addresses a user can have:
	const LIMIT = 5
	const count: number = (
		await db.query({
			text: SelectFromTable('shipping_info', ['1'], 'customer_id=$1'),
			values: [customerId],
		})
	).rows.length
	if (count > LIMIT)
		throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)
	let dbQuery: QueryResult = await db.query({
		text: InsertInTable(
			'shipping_info',
			['customer_id', ...Object.keys(shippingData)],
			'shipping_info_id'
		),
		values: [customerId, ...Object.values(shippingData)],
	})
	let shippingInfoId = dbQuery.rows[0]
	response.status(StatusCodes.CREATED).send(shippingInfoId)
}

const getAllShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId } = request.user
	const rows: any[] = (
		await db.query({
			text: SelectFromTable('shipping_info', ['*'], 'customer_id=$1'),
			values: [customerId],
		})
	).rows
	if (rows.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('customer has no shipping information available')
	const validData = ShippingInfoSchemaDBList.validate(rows)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const allShippingInfo = validData.value
	response.status(StatusCodes.OK).send(allShippingInfo)
}

const getShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { shippingInfoId } = request.params
	if (!shippingInfoId) throw new BadRequestError('Id parameter not available')
	const result = (
		await db.query({
			text: SelectFromTable('shipping_info', ['*'], 'shipping_info_id=$1'),
			values: [shippingInfoId],
		})
	).rows[0]
	if (!result)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found')
	const validData = ShippingInfoSchemaDB.validate(result)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const shippingInfo = validData.value
	response.status(StatusCodes.OK).send(shippingInfo)
}

const updateShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { shippingInfoId } = request.params
	const validData = ShippingInfoSchemaReq.validate(request.body)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const shippingData = validData.value
	let fields = Object.keys(shippingData),
		data = Object.values(shippingData)
	const paramList = [...data, shippingInfoId]
	const pos: number = paramList.length
	const row = (
		await db.query({
			text: UpdateInTable(
				'shipping_info',
				'shipping_info_id',
				fields,
				`shipping_info_id=$${pos}`
			),
			values: paramList,
		})
	).rows[0]
	const validResult = ShippingInfoSchemaDBLean.validate(row[0])
	if (!validResult.error)
		throw new BadRequestError('Failed to update shipping info')
	const shippingInfo = validResult.value
	response.status(StatusCodes.OK).send(shippingInfo)
}

const deleteShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { shippingInfoId } = request.params
	await db.query({
		text: DeleteInTable(
			'shipping_info',
			'shipping_info_id',
			'shipping_info_id=$1'
		),
		values: [shippingInfoId],
	})
	response.status(StatusCodes.NO_CONTENT).send()
}

export {
	createShippingInfo,
	getShippingInfo,
	getAllShippingInfo,
	updateShippingInfo,
	deleteShippingInfo,
}
