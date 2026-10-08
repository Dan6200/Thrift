import { knex } from '#src/db/index.js'
import NotFoundError from '#src/errors/not-found.js'
import { StoreRepository, StoreData } from '../ports/store-repository.js'

const insertPagesAndSections = async (
  trx: any,
  storeId: number,
  pages: any[],
) => {
  const pagesWithSections = []
  for (const page of pages) {
    const currentSections = []
    const { sections, ...restOfPage } = page
    const [pageResult] = await trx('pages')
      .insert({ ...restOfPage, store_id: storeId })
      .returning('*')

    if (sections) {
      for (const section of sections) {
        const { section_data, styles, ...restOfSection } = section
        const [sectionResult] = await trx('page_sections')
          .insert({
            ...restOfSection,
            page_id: pageResult.page_id,
            section_data: section_data ? JSON.stringify(section_data) : null,
            styles: styles ? JSON.stringify(styles) : null,
          })
          .returning('*')
        currentSections.push(sectionResult)
      }
    }
    pagesWithSections.push({ ...pageResult, sections: currentSections })
  }
  return pagesWithSections
}

const stripNestedIds = (pagesWithSections: any[]) =>
  pagesWithSections.map((pageWithSections: any) => {
    const { store_id, ...corePageResult } = pageWithSections
    return {
      ...corePageResult,
      sections: corePageResult.sections.map((section: any) => {
        const { page_id, ...coreSection } = section
        return coreSection
      }),
    }
  })

const fetchPagesAndSections = async (
  storeIds: number[],
): Promise<Record<number, any[]>> => {
  if (!storeIds.length) return {}
  const allPages = await knex('pages').whereIn('store_id', storeIds).select()
  const pageIds = allPages.map((page) => page.page_id)

  const allSections = await knex('page_sections')
    .whereIn('page_id', pageIds)
    .select(
      'section_id',
      'page_id',
      'section_title',
      'section_type',
      'section_data',
      'sort_order',
      'styles',
      'created_at',
      'updated_at',
    )

  const sectionsByPageId = allSections.reduce(
    (acc: Record<number, any[]>, section: any) => {
      if (!acc[section.page_id]) acc[section.page_id] = []
      const { page_id, ...coreSection } = section
      acc[section.page_id].push(coreSection)
      return acc
    },
    {},
  )

  const pagesByStoreId = allPages.reduce(
    (acc: Record<number, any[]>, page: any) => {
      if (!acc[page.store_id]) acc[page.store_id] = []
      const { store_id, ...corePage } = page
      acc[page.store_id].push({
        ...corePage,
        sections: sectionsByPageId[page.page_id] || [],
      })
      return acc
    },
    {},
  )

  return pagesByStoreId
}

const shapeStore = (store: any, pages: any[]) => {
  const {
    address_id,
    address_line_1,
    address_line_2,
    city,
    state,
    zip_postal_code,
    country,
    address_created_at,
    address_updated_at,
    ...coreStoreData
  } = store
  return {
    ...coreStoreData,
    store_address: {
      address_id,
      address_line_1,
      address_line_2,
      city,
      state,
      zip_postal_code,
      country,
      created_at: address_created_at,
      updated_at: address_updated_at,
    },
    pages,
  }
}

export const knexStoreRepository: StoreRepository = {
  async create({
    vendorId,
    storeData,
  }: {
    vendorId: string
    storeData: StoreData
  }) {
    const { store_address, pages, ...restOfStoreData } = storeData
    const trx = await knex.transaction()
    try {
      const [address] = await trx('address')
        .insert(store_address)
        .returning('*')

      const [store] = await trx('stores')
        .insert({
          vendor_id: vendorId,
          ...restOfStoreData,
          address_id: address.address_id,
        })
        .returning('*')

      const pagesWithSections = pages
        ? await insertPagesAndSections(trx, store.store_id, pages)
        : []

      await trx.commit()
      const { address_id, ...coreStore } = store
      return {
        ...coreStore,
        store_address: address,
        pages: stripNestedIds(pagesWithSections),
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  },

  async getAll(vendorId) {
    const baseQuery = knex('stores')
      .join('address', 'stores.address_id', 'address.address_id')
      .select(
        'stores.store_id',
        'stores.store_name',
        'stores.custom_domain',
        'stores.vendor_id',
        'stores.favicon',
        'stores.global_styles',
        'stores.created_at',
        'stores.updated_at',
        'address.address_id',
        'address.address_line_1',
        'address.address_line_2',
        'address.city',
        'address.state',
        'address.zip_postal_code',
        'address.country',
        'address.created_at as address_created_at',
        'address.updated_at as address_updated_at',
      )

    if (vendorId) baseQuery.where('stores.vendor_id', vendorId)

    const stores = await baseQuery
    const pagesByStoreId = await fetchPagesAndSections(
      stores.map((store) => store.store_id),
    )

    return stores.map((store: any) =>
      shapeStore(store, pagesByStoreId[store.store_id] || []),
    )
  },

  async getById(storeId, vendorId) {
    const baseQuery = knex('stores')
      .join('address', 'stores.address_id', 'address.address_id')
      .where('stores.store_id', storeId)
      .select(
        'stores.store_id',
        'stores.store_name',
        'stores.custom_domain',
        'stores.vendor_id',
        'stores.favicon',
        'stores.global_styles',
        'stores.created_at',
        'stores.updated_at',
        'address.address_id',
        'address.address_line_1',
        'address.address_line_2',
        'address.city',
        'address.state',
        'address.zip_postal_code',
        'address.country',
        'address.created_at as address_created_at',
        'address.updated_at as address_updated_at',
      )
      .first()

    if (vendorId) baseQuery.where('stores.vendor_id', vendorId)

    const store = await baseQuery
    if (!store) return []

    const pagesByStoreId = await fetchPagesAndSections([store.store_id])
    return shapeStore(store, pagesByStoreId[store.store_id] || [])
  },

  async update({
    storeId,
    storeData,
  }: {
    storeId: number
    storeData: StoreData
  }) {
    const { store_address, pages, ...restOfStoreData } = storeData
    const trx = await knex.transaction()
    try {
      const store = await trx('stores')
        .where('store_id', storeId)
        .select('address_id')
        .first()

      if (!store) {
        throw new NotFoundError('Store not found')
      }

      let updatedStoreAddress = null
      if (store_address) {
        ;[updatedStoreAddress] = await trx('address')
          .where('address_id', store.address_id)
          .update(store_address)
          .returning('*')
      } else {
        updatedStoreAddress = await trx('address')
          .where('address_id', store.address_id)
          .first()
      }

      const [updatedStore] = await trx('stores')
        .where('store_id', storeId)
        .update(restOfStoreData)
        .returning('*')

      const pageIds = await trx('pages')
        .where('store_id', storeId)
        .select('page_id')
      const pageIdList = pageIds.map((p) => p.page_id)
      await trx('page_sections').whereIn('page_id', pageIdList).del()
      await trx('pages').where('store_id', storeId).del()

      const updatedPages = pages
        ? await insertPagesAndSections(trx, storeId, pages)
        : []

      await trx.commit()
      const { address_id, ...coreUpdatedStore } = updatedStore
      return {
        ...coreUpdatedStore,
        store_address: updatedStoreAddress,
        pages: stripNestedIds(updatedPages),
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  },

  async remove(storeId) {
    return knex('stores').where('store_id', storeId).del().returning('store_id')
  },
}
