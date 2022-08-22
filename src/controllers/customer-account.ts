import { RequestWithPayload } from '../types-and-interfaces'
import { Response } from 'express'
import db from '../db';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/';
import './helper-functions';
import { hashPassword, validatePassword } from '../security/password';
import path from 'path'
import { UserPayload } from '../types-and-interfaces'
const fileName = path.basename(__filename)


const createCustomerAccount = async (request : RequestWithPayload, response: Response) => {
	const { userId } : UserPayload = request.user
	await db.query(
		`insert into marketplace.customer values ($1)`, 
		[ userId ])
	response.status(StatusCodes.CREATED).end()
}

const getCustomerAccount = async (request : RequestWithPayload, response: Response) => {
	const { userId } : UserPayload = request.user
	const customerData = (await db.query (
		`select * from marketplace.customer
		where customer_id=$1`,
		[ userId ] )).rows[0]
	if (!customerData)
		throw new NotFoundError('Customer Account cannot be found')
	response.status(StatusCodes.OK).send({
		customerData
	})
}

const updateCustomerAccount = async (request : RequestWithPayload, response: Response) => {}

const deleteCustomerAccount = 
	async (request : RequestWithPayload, response : Response) => {
		const { userId } : UserPayload = request.user
		await db.query (
			`delete from marketplace.customer
			where customer_id=$1`,
			[ userId ] )
		response.status(StatusCodes.OK).end()
	}

export {
	createCustomerAccount,
	getCustomerAccount,
	updateCustomerAccount,
	deleteCustomerAccount
};
