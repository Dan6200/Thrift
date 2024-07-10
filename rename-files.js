import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const renameFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.lstatSync(fullPath)
    if (stat.isDirectory()) renameFiles(fullPath)
    else if (path.extname(fullPath) === '.js') {
      const newFullPath = fullPath.slice(0, -3) + '.mjs'
      fs.renameSync(fullPath, newFullPath)
    }
  })
}

renameFiles(path.join(fileURLToPath(import.meta.url), '../built/'))
