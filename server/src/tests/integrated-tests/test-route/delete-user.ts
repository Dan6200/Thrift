import { auth } from '../../../auth/firebase/index.js'
import BadRequestError from '../../../errors/bad-request.js'

export const deleteUser = async ({ uid }: { uid: string }) => {
  if (!uid)
    throw new BadRequestError('Must provide UID for the user to be deleted')
  await auth.deleteUser(uid)
  // .catch((error: Error) =>
  //   console.error(`failed to delete user with uid ${uid}: ${error}`)
  // )
}
