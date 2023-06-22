import joi from 'joi'

const StoreSchemaReq = joi
	.object({
		store_name: joi.string().min(3).max(50).required(),
		store_page: joi
			.object({
				heading: joi.string().required(),
				navigation: joi.array().items(joi.string()).required(),
				hero: joi.object({
					video: joi.array().items(joi.string()).allow(null),
					slideshow_images: joi.array().items(joi.string()).allow(null),
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

const StoreSchemaUpdateReq = joi.object({
	store_name: joi.string().min(3).max(50).required(),
	store_page: joi
		.object({
			heading: joi.string().required(),
			navigation: joi.array().items(joi.string()).required(),
			hero: joi.object({
				video: joi.array().items(joi.string()).allow(null),
				slideshow_images: joi.array().items(joi.string()).allow(null),
			}),
			body: joi.object({
				product_listings: joi.object({
					product_ids: joi.array().items(joi.string()),
				}),
			}),
		})
		.required(),
})

const StoreSchemaResLean = joi.object({
	store_id: joi.string().pattern(/d+/).required(),
})

const StoreSchemaRes = joi
	.object({
		store_id: joi.string().pattern(/\d+/).required(),
		store_name: joi.string().min(3).max(50).required(),
		vendor_id: joi.number().required(),
		store_page: joi
			.object({
				heading: joi.string().required(),
				navigation: joi.array().items(joi.string()).required(),
				hero: joi.object({
					video: joi.array().items(joi.string()).allow(null),
					slideshow_images: joi.array().items(joi.string()).allow(null),
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

export {
	StoreSchemaReq,
	StoreSchemaUpdateReq,
	StoreSchemaRes,
	StoreSchemaResLean,
}
