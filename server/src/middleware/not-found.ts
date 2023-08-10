import { Response } from 'express'
const notFound = (_, res: Response) => {
  res.status(404).json({ msg: 'Resource not found' })
}

export default notFound
