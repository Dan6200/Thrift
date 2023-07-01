//
export type Product = {
	title: string
	category: string
	description: string[]
	list_price: number
	net_price: number
	quantity_available: number
}

export type ProductPartial = {
	title?: string
	category?: string
	description?: string[]
	list_price?: number
	net_price?: number
	quantity_available?: number
}

export type ProductMedia = {
	name: string
	path: string
	description: string
}
