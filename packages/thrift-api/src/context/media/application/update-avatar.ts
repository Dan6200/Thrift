import { MediaRepository } from '../ports/media-repository.js'
import { MediaStorage, RawUpload } from '../ports/media-storage.js'

export const updateAvatarUseCase =
  (storage: MediaStorage, repository: MediaRepository) =>
  async (input: { userId: string; file?: RawUpload; description?: string }) => {
    let stored
    if (input.file) {
      stored = await storage.upload(input.file, 'avatars')
    }
    return repository.updateAvatar({
      userId: input.userId,
      file: stored
        ? {
            filename: stored.filename,
            filepath: stored.filepath,
            filetype: stored.filetype,
          }
        : undefined,
      description: input.description,
    })
  }
