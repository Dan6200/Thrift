import { MediaRepository } from '../ports/media-repository.js'

export const deleteAvatarUseCase =
  (repository: MediaRepository) => (userId: string) =>
    repository.deleteAvatar(userId)
