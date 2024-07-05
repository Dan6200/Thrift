import { VendorSchemaID } from '../../app-schema/vendors.js'

interface VendorId {
  vendor_id: string
}

export const isValidVendorId = (data: unknown): data is VendorId =>
  !VendorSchemaID.validate(data).error
