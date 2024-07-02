import { auth } from '../../../auth/firebase/index.js'
import BadRequestError from '../../../errors/bad-request.js'

export const deleteUser = async ({ uid }: { uid: string }) => {
  if (!uid)
    throw new BadRequestError('Must provide UID for the user to be deleted')
  await auth
    .deleteUser(uid)
    .then(() => console.log(`user with uid: ${uid} deleted`))
    .catch((error) =>
      console.error(`failed to delete user with uid ${uid}: ${error}`)
    )
}
