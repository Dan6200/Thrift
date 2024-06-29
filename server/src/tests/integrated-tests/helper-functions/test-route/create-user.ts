import { auth } from '../../../../auth/firebase/testing.js'
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'
import UnauthorizedError from '../../../../errors/unauthorized.js'

export async function createUserWithEmailAndPasswordWrapper(
  email: string,
  password: string
) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }: UserCredential) => user.getIdToken())
    .catch((error) => {
      throw new UnauthorizedError('Could not Authenticate user')
    })
}