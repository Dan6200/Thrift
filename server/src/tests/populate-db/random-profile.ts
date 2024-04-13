//cspell:ignore birthdate
import { AccountData } from '../../types-and-interfaces/account.js'
import { faker } from './faker.js'

export default function (): AccountData {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    dob: faker.date.birthdate({ min: 12 }),
    country: 'Nigeria',
  }
}
