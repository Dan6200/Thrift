export interface StoresData {
  store_name: string
  store_page: {
    heading: string
    theme: 'light' | 'dark'
    navigation: this.pages;
		pages: string[]
    hero: {
      media: { [idx: number]: string }
    }
    body: {
      product_listings: { product_ids: { [idx: number]: string } }
    }
  }
}

export const isValidStoresData = (
  storesData: unknown
): storesData is StoresData => {
  return (
    typeof storesData === 'object' &&
    storesData != null &&
    'store_name' in storesData &&
    'store_page' in storesData &&
    storesData.store_page != null
  )
}
