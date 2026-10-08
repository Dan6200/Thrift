import { knex } from '#src/db/index.js'
import { ProfileRepository } from '../ports/profile-repository.js'

export const knexProfileRepository: ProfileRepository = {
  async getProfile(userId) {
    return knex('profiles').where({ id: userId }).select('*').first()
  },
}
