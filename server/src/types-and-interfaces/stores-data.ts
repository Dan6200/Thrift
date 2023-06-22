export default interface StoresData {
	store_name: string
	store_page: {
		heading: string
		navigation: string[]
		hero: {
			media: { [idx: number]: string }
		}
		body: {
			product_listings: { product_ids: { [idx: number]: string } }
		}
	}
}
