import { MediaRepository } from '../ports/media-repository.js'

export const createAvatarUseCase =
  (repository: MediaRepository) =>
  (input: { userId: string; file: any; description?: string }) =>
    repository.createAvatar(input)
