//cspell:ignore cloudinary
import { ProfileRequestData } from '#src/types/profile/index.js'
import {
  testCreateAvatar,
  testGetAvatar,
  testUpdateAvatar,
  testDeleteAvatar,
} from './definitions/index.js'
import { deleteUserForTesting } from '../../helpers/delete-user.js'
import { createUserForTesting } from '../../helpers/create-user.js'
import { signInForTesting } from '../../helpers/signin-user.js'

// globals
const avatarMediaRoute = '/v1/media/avatar'
const server: string = process.env.SERVER!

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  let token: string
  let userId: string

  before(async () => {
    userId = await createUserForTesting(userInfo)
    token = await signInForTesting(userInfo)
  })

  const avatarMedia = {
    name: 'avatar.jpg',
    path: './src/tests/integrated/data/users/vendors/user-aliyu/profile/avatar.jpg',
    description: 'User avatar',
  }

  it('it should upload an avatar for the user', async () => {
    await testCreateAvatar(server, avatarMediaRoute, avatarMedia, token)
  })

  it("it should get the user's avatar", async () => {
    await testGetAvatar(server, avatarMediaRoute, token)
  })

  it("it should update the user's avatar", async () => {
    await testUpdateAvatar(server, avatarMediaRoute, avatarMedia, token)
  })

  it("it should delete the user's avatar", async () => {
    await testDeleteAvatar(server, avatarMediaRoute, token)
  })

  after(async () => {
    await deleteUserForTesting(userId)
  })
}
