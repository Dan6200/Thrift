export type StoreData = Record<string, any>

export type StoreRepository = {
  create(input: { vendorId: string; storeData: StoreData }): Promise<unknown>
  getAll(vendorId?: string): Promise<unknown>
  getById(storeId: number, vendorId?: string): Promise<unknown>
  update(input: { storeId: number; storeData: StoreData }): Promise<unknown>
  remove(storeId: number): Promise<unknown>
}
