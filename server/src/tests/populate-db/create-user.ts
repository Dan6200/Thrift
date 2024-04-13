import axios from 'axios'
import { AccountData } from '../../types-and-interfaces/account.js'

export default async function (server: string, accountInfo: AccountData) {
  try {
    const response = await axios.post(`${server}/v1/auth/register`, accountInfo)
    return response.data
  } catch (error) {
    throw error
  }
}
