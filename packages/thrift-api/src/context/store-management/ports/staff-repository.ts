export type StaffRepository = {
  add(input: {
    storeId: number
    staffId: string
    role: string
  }): Promise<unknown>
  list(storeId: number): Promise<unknown>
  update(input: {
    storeId: number
    staffId: string
    role: string
  }): Promise<unknown>
  remove(input: { storeId: number; staffId: string }): Promise<number>
}
