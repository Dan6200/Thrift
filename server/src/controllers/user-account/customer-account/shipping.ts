import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult } from 'pg'
import {
	ShippingInfoSchemaReq,
	ShippingInfoSchemaDBList,
	ShippingInfoSchemaDBLean,
	ShippingInfoSchemaDB,
} from '../../../app-schema/customer/shipping.js'
import db from '../../../db/index.js'
import { BadRequestError } from '../../../errors/index.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../../types-and-interfaces/request.js'
import {
	Insert,
	Select,
	Update,
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
	let dbQuery: QueryResult = await db.query({
		text: Insert(
			'shipping_info',
			['customer_id', ...Object.keys(shippingData)],
			'address_id'
		),
		values: [customerId, ...Object.values(shippingData)],
	})
	let shippingAddress = dbQuery.rows[0]
	response.status(StatusCodes.CREATED).send(shippingAddress)
}

const getAllShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId } = request.user
	const rows: any[] = (
		await db.query({
			text: Select('shipping_info', ['*'], 'customer_id=$1'),
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
	const { addressId } = request.params
	if (!addressId) throw new BadRequestError('Id parameter not available')
	const row = (
		await db.query({
			text: Select('shipping_info', ['*'], 'address_id=$1'),
			values: [addressId],
		})
	).rows[0]
	if (!row)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Shipping Information cannot be found')
	const validData = ShippingInfoSchemaDB.validate(row[0])
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const shippingInfo = validData.value
	response.status(StatusCodes.OK).send(shippingInfo)
}

const updateShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params
	const validData = ShippingInfoSchemaReq.validate(request.body)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const shippingData = validData.value
	let fields = Object.keys(shippingData),
		data = Object.values(shippingData)
	const paramList = [...data, addressId]
	const pos: number = paramList.length
	const row = (
		await db.query({
			text: Update('shipping_info', 'address_id', fields, `address_id=$${pos}`),
			values: paramList,
		})
	).rows[0]
	const validResult = ShippingInfoSchemaDBLean.validate(row)
	if (!validResult.error)
		throw new BadRequestError('Failed to update shipping info')
	const shippingInfo = validResult.value
	response.status(StatusCodes.OK).send(shippingInfo)
}

const deleteShippingInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { addressId } = request.params
	await db.query({
		text: `delete from shipping_info
			where address_id=$1`,
		values: [addressId],
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
