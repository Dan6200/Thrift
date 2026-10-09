import { MediaRepository } from '../ports/media-repository.js'

export const updateAvatarUseCase =
  (repository: MediaRepository) =>
  (input: { userId: string; file?: any; description?: string }) =>
    repository.updateAvatar(input)
