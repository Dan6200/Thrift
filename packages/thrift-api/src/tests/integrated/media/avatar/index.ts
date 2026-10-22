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

const avatarMediaRoute = '/v1/media/avatar'
const server: string = process.env.SERVER!

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  const avatarMedia = {
    name: 'avatar.jpg',
    path: './src/tests/integrated/data/users/vendors/user-aliyu/profile/avatar.jpg',
    description: 'User avatar',
  }

  // Each test seeds its own user (and uploads an avatar where one must exist),
  // so no test depends on state left behind by another.
  const withUser = async (fn: (token: string) => Promise<void>) => {
    const userId = await createUserForTesting(userInfo)
    const token = await signInForTesting(userInfo)
    try {
      await fn(token)
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  const upload = (token: string) =>
    testCreateAvatar(server, avatarMediaRoute, avatarMedia, token)

  it('it should upload an avatar for the user', () =>
    withUser(async (token) => {
      await upload(token)
    }))

  it("it should get the user's avatar", () =>
    withUser(async (token) => {
      await upload(token)
      await testGetAvatar(server, avatarMediaRoute, token)
    }))

  it("it should update the user's avatar", () =>
    withUser(async (token) => {
      await upload(token)
      await testUpdateAvatar(server, avatarMediaRoute, avatarMedia, token)
    }))

  it("it should delete the user's avatar", () =>
    withUser(async (token) => {
      await upload(token)
      await testDeleteAvatar(server, avatarMediaRoute, token)
    }))
}
