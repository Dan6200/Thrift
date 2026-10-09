import { supabase } from '#supabase-config'
import { AuthGateway } from '../ports/auth-gateway.js'

export const supabaseAuthGateway: AuthGateway = {
  async signUp(input) {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          dob: input.dob,
          country: input.country,
          is_vendor: input.isVendor,
          is_customer: !input.isVendor,
        },
      },
    })
    return { data, error }
  },
}
