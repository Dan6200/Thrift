import { Response } from 'express'
import joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import assert from 'node:assert/strict'
import { QueryResult } from 'pg'
import {
	PaymentInfoSchemaReq,
	PaymentInfoSchemaDB,
} from '../../../app-schema/customer/payment.js'
import db from '../../../db/index.js'
import { BadRequestError } from '../../../errors/index.js'
import {
	RequestWithPayload,
	RequestUserPayload,
} from '../../../types-and-interfaces/request.js'
import { Insert, Update } from '../../helpers/generate-sql-commands/index.js'

const selectPaymentInfo = `
select 
	payment_id,
from payment_info`

const createPaymentInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId }: RequestUserPayload = request.user
	const validData = PaymentInfoSchemaReq.validate(request.body)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const paymentData = validData.value
	let dbQuery: QueryResult = await db.query(
		`${Insert(
			'payment_info',
			['customer_id', ...Object.keys(paymentData)],
			'payment_id'
		)}`,
		[customerId, ...Object.values(paymentData)]
	)
	let { rowCount }: { rowCount: number } = dbQuery
	let lastInsert = rowCount ? rowCount - 1 : rowCount
	assert.ok(lastInsert >= 0 && lastInsert < rowCount)
	let paymentAddress = dbQuery.rows[lastInsert]
	response.status(StatusCodes.CREATED).send(paymentAddress)
}

const getAllPaymentInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { userId: customerId } = request.user
	const paymentInfos: any[] = (
		await db.query(selectPaymentInfo + ' where customer_id=$1', [customerId])
	).rows
	assert.ok(Array.isArray(paymentInfos))
	if (paymentInfos.length === 0)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('customer has no payment information available')
	joi.assert(paymentInfos[0], PaymentInfoSchemaDB)
	response.status(StatusCodes.OK).send(paymentInfos)
}

const getPaymentInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { paymentId } = request.params
	if (!paymentId) throw new BadRequestError('Id parameter not available')
	const paymentInfo = (
		await db.query(selectPaymentInfo + ' where payment_id=$1', [paymentId])
	).rows[0]
	if (!paymentInfo)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Payment Information cannot be found')
	joi.assert(paymentInfo, PaymentInfoSchemaDB)
	response.status(StatusCodes.OK).send(paymentInfo)
}

const updatePaymentInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { paymentId } = request.params
	const validData = PaymentInfoSchemaReq.validate(request.body)
	if (validData.error)
		throw new BadRequestError('Invalid Data Schema: ' + validData.error.message)
	const paymentData = validData.value
	let fields = Object.keys(paymentData),
		data = Object.values(paymentData)
	await db.query(`${Update('payment_info', 'payment_id', fields)}`, [
		paymentId,
		...data,
	])
	const paymentInfo = (
		await db.query(selectPaymentInfo + ' where payment_id=$1', [paymentId])
	).rows[0]
	joi.assert(paymentInfo, PaymentInfoSchemaDB)
	if (!paymentInfo)
		return response
			.status(StatusCodes.NOT_FOUND)
			.send('Payment Information cannot be found')
	response.status(StatusCodes.OK).send(paymentInfo)
}

const deletePaymentInfo = async (
	request: RequestWithPayload,
	response: Response
) => {
	const { paymentId } = request.params
	await db.query(
		`delete from payment_info
			where payment_id=$1`,
		[paymentId]
	)
	response.status(StatusCodes.NO_CONTENT).send()
}

export {
	createPaymentInfo,
	getPaymentInfo,
	getAllPaymentInfo,
	updatePaymentInfo,
	deletePaymentInfo,
}
