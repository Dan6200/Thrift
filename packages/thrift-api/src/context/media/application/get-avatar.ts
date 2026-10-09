import { MediaRepository } from '../ports/media-repository.js'

export const getAvatarUseCase =
  (repository: MediaRepository) => (userId: string) =>
    repository.getAvatar(userId)
