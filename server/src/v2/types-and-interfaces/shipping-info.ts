export default interface ShippingInfo {
	recipient_first_name: string
	recipient_last_name: string
	address: string
	city: string
	state: string
	postal_code: string
	country: string
	delivery_contact: string
	delivery_instructions: string[]
}
