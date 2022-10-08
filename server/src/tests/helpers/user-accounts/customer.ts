import chai from 'chai';
import chaiHttp from 'chai-http';
import { UserDataSchemaDB } from 'app-schema/users';
import application from 'application';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import {
	updateUser,
	updateUserPassword,
	users,
} from 'tests/authentication/user-data';

chai.use(chaiHttp).should();

/*
 */
