import { ProfileRepository } from '../ports/profile-repository.js'

export const getProfileUseCase =
  (repository: ProfileRepository) => (userId: string) =>
    repository.getProfile(userId)
