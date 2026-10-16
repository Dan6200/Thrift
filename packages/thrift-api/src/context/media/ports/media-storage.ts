export type RawUpload = {
  buffer: Buffer
  originalname: string
  mimetype: string
}

export type StoredMedia = {
  filename: string
  filepath: string
  filetype: string
}

export type MediaStorage = {
  upload(file: RawUpload, folder: 'avatars' | 'products'): Promise<StoredMedia>
}
