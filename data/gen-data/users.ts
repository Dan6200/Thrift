// cspell:ignore fastcsv birthdate
import { createWriteStream } from 'fs'
import { faker } from '@faker-js/faker'
import * as fastcsv from 'fast-csv'

let users = [
  [
    'user_id',
    'first_name',
    'last_name',
    'email',
    'phone',
    'password',
    'dob',
    'country',
  ],
]

let { person, internet, phone, string, date, location } = faker

for (let i = 1; i <= 50; i++) {
  users.push([
    i.toString(),
    person.fullName(),
    person.lastName(),
    internet.email(),
    phone.number(),
    string.alphanumeric(),
    date.birthdate(),
    location.country(),
  ] as any[])
}

let outFile = 'users.csv'
let wStream = createWriteStream(outFile)

fastcsv
  .write(users as any[], { headers: true })
  .pipe(wStream)
  .on('finish', () => console.log('data written to ' + outFile))
