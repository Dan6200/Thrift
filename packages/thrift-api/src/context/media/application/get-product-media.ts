import { MediaRepository } from '../ports/media-repository.js'

export const getProductMediaUseCase =
  (repository: MediaRepository) => (mediaId: number) =>
    repository.getProductMedia(mediaId)
