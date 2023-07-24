import joi from 'joi'

export const StoreSchemaReqData = joi
  .object({
    store_name: joi.string().min(3).max(50).required(),
    store_page: joi
      .object({
        heading: joi.string().required(),
        navigation: joi.array().items(joi.string()).required(),
        hero: joi.object({
          media: joi.array().items(joi.string()).allow(null),
        }),
        body: joi.object({
          product_listings: joi.object({
            product_ids: joi.array().items(joi.string()),
          }),
        }),
      })
      .required(),
  })
  .required()

export const StoreSchemaReqDataPartial = joi.object({
  store_name: joi.string().min(3).max(50),
  store_page: joi.object({
    heading: joi.string().required(),
    navigation: joi.array().items(joi.string()).required(),
    hero: joi.object({
      media: joi.array().items(joi.string()).allow(null),
    }),
    body: joi.object({
      product_listings: joi.object({
        product_ids: joi.array().items(joi.string()),
      }),
    }),
  }),
})

export const StoreSchemaDBResultID = joi.object({
  store_id: joi.number().required(),
})

export const StoreSchemaDBResultList = joi
  .array()
  .items(
    joi
      .object({
        store_id: joi.number().required(),
        store_name: joi.string().min(3).max(50).required(),
        vendor_id: joi.number().required(),
        store_page: joi
          .object({
            heading: joi.string().required(),
            navigation: joi.array().items(joi.string()).required(),
            hero: joi.object({
              media: joi.array().items(joi.string()).allow(null),
            }),
            body: joi.object({
              product_listings: joi.object({
                product_ids: joi.array().items(joi.string()),
              }),
            }),
          })
          .required(),
        date_created: joi
          .alternatives()
          .try(joi.string().required(), joi.date().required()),
      })
      .required()
  )
  .required()

export const StoreSchemaDBResult = joi
  .object({
    store_id: joi.number().required(),
    store_name: joi.string().min(3).max(50).required(),
    vendor_id: joi.number().required(),
    store_page: joi
      .object({
        heading: joi.string().required(),
        navigation: joi.array().items(joi.string()).required(),
        hero: joi.object({
          media: joi.array().items(joi.string()).allow(null),
        }),
        body: joi.object({
          product_listings: joi.object({
            product_ids: joi.array().items(joi.string()),
          }),
        }),
      })
      .required(),
    date_created: joi
      .alternatives()
      .try(joi.string().required(), joi.date().required()),
  })
  .required()
