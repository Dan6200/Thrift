const { StatusCode } = require('http-status-codes')
// const Job = require('../models/Job')
const {BadRequestError, NotFoundError} = require('../errors/')

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
	res.status(StatusCode.OK).json({jobs, count: jobs.length})
}

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId
	const job = await Job.create(req.body)
	res.status(StatusCode.CREATED).json({ job })
}

const getJob = async (req, res) => {
	const {
		user:{userId},
		params: {
			id: jobId
		}
	} = req
	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user:{ userId },
		params: {
			id: jobId
		}
	} = req
	if (company===''||position==='') {
		throw new BadRequestError(`Company and Position fields cannot be empty`)
	}
	const job = await Job.findOneAndUpdate({
		_id: jobId,
		createdBy: userId
	}, 
	req.body,{
		new: true,
		runValidators: true
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

const deleteJob = async (req, res) => {
	const {
		body: { company, position },
		user:{ userId },
		params: {
			id: jobId
		}
	} = req
	const job = await Job.findOneAndDelete({
		_id: jobId,
		createdBy: userId
	})
	if (!job)
		throw new NotFoundError(`No job with id ${jobId}`)
	res.status(StatusCode.OK).json({ job })
}

module.exports = {
	getAllJobs,
	createJob,
	getJob,
	updateJob,
	deleteJob
}
