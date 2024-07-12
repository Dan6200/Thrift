//cspell:ignore cloudinary

import { cloudinary } from '@/controllers/utils/media-storage.js'

export async function bulkDeleteImages() {
  while (true) {
    try {
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'thrift-app-media',
        max_results: 100,
      })
      const publicIds = resources.map((resource: any) => resource.public_id)
      if (publicIds.length > 0) {
        const result = await cloudinary.api.delete_resources(publicIds)
        console.log('Deleted assets: ', result)
      } else {
        console.log('No assets found in the folder')
        break
      }
    } catch (err) {
      console.error('Error deleting assets: ', err)
    }
  }
}
bulkDeleteImages()
