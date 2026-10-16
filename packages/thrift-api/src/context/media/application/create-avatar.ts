import { MediaRepository } from '../ports/media-repository.js'
import { MediaStorage, RawUpload } from '../ports/media-storage.js'

export const createAvatarUseCase =
  (storage: MediaStorage, repository: MediaRepository) =>
  async (input: { userId: string; file: RawUpload; description?: string }) => {
    const stored = await storage.upload(input.file, 'avatars')
    return repository.createAvatar({
      userId: input.userId,
      file: {
        filename: stored.filename,
        filepath: stored.filepath,
        filetype: stored.filetype,
      },
      description: input.description,
    })
  }
