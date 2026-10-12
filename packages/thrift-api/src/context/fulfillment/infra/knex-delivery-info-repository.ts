import { knex } from '#src/db/index.js'
import NotFoundError from '#src/errors/not-found.js'
import {
  DeliveryInfoRepository,
  CreateDeliveryInput,
  UpdateDeliveryInput,
} from '../ports/delivery-info-repository.js'

export const knexDeliveryInfoRepository: DeliveryInfoRepository = {
  async create(input: CreateDeliveryInput) {
    const trx = await knex.transaction()
    try {
      const [address] = await trx('address')
        .insert({
          address_line_1: input.addressLine1,
          address_line_2: input.addressLine2,
          city: input.city,
          state: input.state,
          zip_postal_code: input.zipPostalCode,
          country: input.country,
        })
        .returning('*')

      const [result] = await trx('delivery_info')
        .insert({
          customer_id: input.customerId,
          address_id: address.address_id,
          recipient_full_name: input.recipientFullName,
          phone_number: input.phoneNumber,
          delivery_instructions: input.deliveryInstructions,
        })
        .returning('*')

      await trx.commit()
      return { ...result, ...address }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  },

  async getAll(customerId) {
    return knex('delivery_info')
      .join('address', 'delivery_info.address_id', 'address.address_id')
      .where('delivery_info.customer_id', customerId)
      .select('*')
  },

  async getById(customerId, deliveryInfoId) {
    return knex('delivery_info')
      .join('address', 'delivery_info.address_id', 'address.address_id')
      .where('delivery_info.delivery_info_id', deliveryInfoId)
      .where('delivery_info.customer_id', customerId)
      .select('*')
      .first()
  },

  async update(input: UpdateDeliveryInput) {
    const deliveryInfoUpdate: Record<string, unknown> = {}
    if (input.deliveryInstructions !== undefined) {
      deliveryInfoUpdate.delivery_instructions = input.deliveryInstructions
    }
    if (input.recipientFullName !== undefined) {
      deliveryInfoUpdate.recipient_full_name = input.recipientFullName
    }
    if (input.phoneNumber !== undefined) {
      deliveryInfoUpdate.phone_number = input.phoneNumber
    }

    const addressUpdate: Record<string, unknown> = {}
    if (input.addressLine1 !== undefined) {
      addressUpdate.address_line_1 = input.addressLine1
    }
    if (input.addressLine2 !== undefined) {
      addressUpdate.address_line_2 = input.addressLine2
    }
    if (input.city !== undefined) addressUpdate.city = input.city
    if (input.state !== undefined) addressUpdate.state = input.state
    if (input.zipPostalCode !== undefined) {
      addressUpdate.zip_postal_code = input.zipPostalCode
    }
    if (input.country !== undefined) addressUpdate.country = input.country

    const trx = await knex.transaction()
    try {
      const [currentDeliveryInfo] = await trx('delivery_info')
        .where('delivery_info_id', input.deliveryInfoId)
        .where('customer_id', input.customerId)
        .select('address_id')

      if (!currentDeliveryInfo) {
        throw new NotFoundError('Delivery info not found.')
      }

      const { address_id } = currentDeliveryInfo

      let updatedDeliveryInfo: any
      if (Object.keys(deliveryInfoUpdate).length > 0) {
        ;[updatedDeliveryInfo] = await trx('delivery_info')
          .where('delivery_info_id', input.deliveryInfoId)
          .where('customer_id', input.customerId)
          .update(deliveryInfoUpdate)
          .returning('*')
      } else {
        ;[updatedDeliveryInfo] = await trx('delivery_info')
          .where('delivery_info_id', input.deliveryInfoId)
          .where('customer_id', input.customerId)
          .select('*')
      }

      let updatedAddress: any
      if (Object.keys(addressUpdate).length > 0) {
        ;[updatedAddress] = await trx('address')
          .where('address_id', address_id)
          .update(addressUpdate)
          .returning('*')
      } else {
        ;[updatedAddress] = await trx('address')
          .where('address_id', address_id)
          .select('*')
      }

      await trx.commit()

      const latestUpdatedAt =
        updatedDeliveryInfo && updatedAddress
          ? new Date(
              Math.max(
                updatedDeliveryInfo.updated_at?.getTime() || 0,
                updatedAddress.updated_at?.getTime() || 0,
              ),
            )
          : undefined

      const earliestCreatedAt =
        updatedDeliveryInfo && updatedAddress
          ? new Date(
              Math.min(
                updatedDeliveryInfo.created_at?.getTime() || Infinity,
                updatedAddress.created_at?.getTime() || Infinity,
              ),
            )
          : undefined

      return {
        ...updatedDeliveryInfo,
        ...updatedAddress,
        created_at: earliestCreatedAt,
        updated_at: latestUpdatedAt,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  },

  async remove(customerId, deliveryInfoId) {
    const deletedCount = await knex('delivery_info')
      .where('delivery_info_id', deliveryInfoId)
      .where('customer_id', customerId)
      .del()

    if (deletedCount === 0) {
      throw new NotFoundError('Delivery info not found.')
    }
  },
}
