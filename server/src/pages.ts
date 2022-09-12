import application from 'application';
import { Request, Response } from 'express';
import authenticateUser from 'middleware/authentication';

application.get('/', (_request: Request, response: Response) => {
	response.render('index');
});

application.get('/register', (_request: Request, response: Response) => {
	response.render('register');
});

application.get('/login', (_request: Request, response: Response) => {
	response.render('login');
});

application.get('/user', (_request: Request, response: Response) => {
	response.render('user');
});
