import { MediaRepository } from '../ports/media-repository.js'

export const createProductMediaUseCase =
  (repository: MediaRepository) =>
  (input: {
    userId: string
    productId: number
    files: any[]
    descriptions: Record<string, string>
    isDisplayImage: Record<string, boolean>
    isThumbnailImage: Record<string, boolean>
    filetypes: Record<string, string>
  }) =>
    repository.createProductMedia(input)
