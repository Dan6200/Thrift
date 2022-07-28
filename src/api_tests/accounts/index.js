require('express-async-errors')
const application		= require('../../app')
const chai				= require('chai')
const chaiHttp			= require('chai-http')
const db				= require('../../db')
const { customerAccount,
	vendorAccount}		= require('./test-data')
const { StatusCodes }	= require('http-status-codes')
const should = chai.should()

const testGetAllAccounts = () => {
}

module.exports = {
	testGetAllAccounts,
}
