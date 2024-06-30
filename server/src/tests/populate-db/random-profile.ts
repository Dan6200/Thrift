//cspell:ignore birthdate
import { UserRequestData } from '../../types-and-interfaces/user.js'
import { faker } from './faker.js'

export default function (): UserRequestData & { password: string } {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    dob: faker.date.birthdate({ min: 12 }),
    country: 'Nigeria',
  }
}
