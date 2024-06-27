/*
//cspell:disable
import {
  AdminAndResourceOptions,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary'
import retryQuery from '../../controllers/helpers/retryQuery.js'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
})

export default {
  /////////////////////////////////////
  // Gets details of an uploaded image
  /////////////////////////////////////
  async getAssetInfo(publicId: string): Promise<any> {
    // Return colors in the response
    const options: AdminAndResourceOptions = {
      colors: true,
    }

    try {
      // Get details about the asset
      const result = await retryQuery(
        cloudinary.api.resource.bind(cloudinary.api),
        [publicId, options],
        3,
        500
      )
      console.log(result)
      return result.colors
    } catch (error) {
      console.error(error)
    }
  },
  //////////////////////////////////////////////////////////////
  // Creates an HTML image tag
  //////////////////////////////////////////////////////////////
  async createImageTag(
    publicId: string,
    { effectColor, backgroundColor },
    transformation: object[]
  ) {
    // Set the effect color and background color
    // Create an image tag with transformations applied to the src URL
    // let imageTag = cloudinary.image(publicId, {
    // transformation: [
    //   { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
    //   { radius: 'max' },
    //   { effect: 'outline:10', color: effectColor },
    //   { background: backgroundColor },
    // ],
    // });
    // return imageTag;
  },
}
*/
