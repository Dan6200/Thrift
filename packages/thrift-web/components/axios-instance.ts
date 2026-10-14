import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER + '/v1',
})

// Attach the Supabase access token to every request so the API can authenticate
// the user (the API validates the Supabase JWT in the `Authorization` header).
axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    try {
      const { supabase } = await import('@/auth/client/config')
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Ignore token attachment failures (e.g. no active session).
    }
  }
  return config
})
