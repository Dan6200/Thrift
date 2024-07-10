import { fileURLToPath } from 'url'
import app from './app.js'
import dotenv from 'dotenv'
// if (process.env.NODE_ENV === 'production')
//   dotenv.config({ path: `/etc/secrets/.env.production` })
// else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const port = process.env.PORT || 1024

let server: () => void = () => {
  if (process.argv[1] === fileURLToPath(import.meta.url))
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
}

server()
