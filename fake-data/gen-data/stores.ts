// cspell:ignore fastcsv birthdate
import { createWriteStream } from 'fs'
import { faker } from '@faker-js/faker'
import * as fastcsv from 'fast-csv'

let stores = [['store_id', 'store_name', 'vendor_id']]

let { company } = faker

for (let i = 1; i <= 250; i++) {
  stores.push([i.toString(), company.name(), (i + 250).toString()] as any[])
}

let outFile = 'stores.csv'
let wStream = createWriteStream(outFile)

fastcsv
  .write(stores as any[], { headers: true })
  .pipe(wStream)
  .on('finish', () => console.log('data written to ' + outFile))
