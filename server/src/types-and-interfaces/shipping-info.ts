export default interface ShippingInfo {
  recipient_first_name: string
  recipient_last_name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  delivery_contact: string
  delivery_instructions: string
}

export const isValidShippingInfo = (
  shippingInfo: unknown
): shippingInfo is ShippingInfo => {
  return (
    typeof shippingInfo === 'object' &&
    shippingInfo != null &&
    'recipient_first_name' in shippingInfo &&
    'recipient_last_name' in shippingInfo &&
    'address' in shippingInfo &&
    'city' in shippingInfo &&
    'state' in shippingInfo &&
    'postal_code' in shippingInfo &&
    'country' in shippingInfo &&
    'delivery_contact' in shippingInfo &&
    'delivery_instructions' in shippingInfo
  )
}
