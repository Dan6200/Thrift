import application from './app';
import { Request, Response } from 'express';

application.get('/', (_request: Request, response: Response) => {
	response.render('index');
});

application.get('/register', (_request: Request, response: Response) => {
	response.render('register');
});

application.get('/login', (_request: Request, response: Response) => {
	response.render('login');
});
