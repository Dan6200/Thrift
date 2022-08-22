var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusCode } from 'http-status-codes';
import { NotFoundError } from '../errors/';
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCode.OK).json({ jobs, count: jobs.length });
});
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.createdBy = req.user.userId;
    const job = yield Job.create(req.body);
    res.status(StatusCode.CREATED).json({ job });
});
const getJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { userId }, params: { id: jobId }, } = req;
    const job = yield Job.findOne({
        _id: jobId,
        createdBy: userId,
    });
    if (!job)
        throw new NotFoundError(`No job with id ${jobId}`);
    res.status(StatusCode.OK).json({ job });
});
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { company, position }, user: { userId }, params: { id: jobId }, } = req;
    if (company === '' || position === '') {
        throw new BadRequestError(`Company and Position fields cannot be empty`);
    }
    const job = yield Job.findOneAndUpdate({
        _id: jobId,
        createdBy: userId,
    }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!job)
        throw new NotFoundError(`No job with id ${jobId}`);
    res.status(StatusCode.OK).json({ job });
});
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { company, position }, user: { userId }, params: { id: jobId }, } = req;
    const job = yield Job.findOneAndDelete({
        _id: jobId,
        createdBy: userId,
    });
    if (!job)
        throw new NotFoundError(`No job with id ${jobId}`);
    res.status(StatusCode.OK).json({ job });
});
export { getAllJobs, createJob, getJob, updateJob, deleteJob };
