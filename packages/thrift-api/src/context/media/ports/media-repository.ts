export type MediaFile = {
  filename: string
  filepath: string
  filetype?: string
  originalname?: string
}

export type MediaRepository = {
  createAvatar(input: {
    userId: string
    file: MediaFile
    description?: string
  }): Promise<unknown>
  getAvatar(userId: string): Promise<unknown>
  updateAvatar(input: {
    userId: string
    file?: Partial<MediaFile>
    description?: string
  }): Promise<unknown>
  deleteAvatar(userId: string): Promise<void>

  createProductMedia(input: {
    userId: string
    productId: number
    files: MediaFile[]
    descriptions: Record<string, string>
    isDisplayImage: Record<string, boolean>
    isThumbnailImage: Record<string, boolean>
    filetypes: Record<string, string>
  }): Promise<unknown>
  getProductMedia(mediaId: number): Promise<unknown>
  updateProductMedia(input: {
    mediaId: number
    file?: Partial<MediaFile>
    description?: string
    filetype?: string
  }): Promise<unknown>
  deleteProductMedia(mediaId: number): Promise<void>
}
