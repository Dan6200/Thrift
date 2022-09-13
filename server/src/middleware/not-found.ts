import { Response } from 'express';
const notFound = (_req, res: Response) =>
	res.status(404).send('Route does not exist');

export default notFound;
