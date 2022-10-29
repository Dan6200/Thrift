/*
 * Schema:
		title: joi.string().min(3).max(50).required(),
		category: joi.string().min(3).max(100).required(),
		description: joi.string().max(1000),
		list_price: joi.number().required(),
		shop_id: joi.string(),
		quantity_available: joi.number().required(),
	*/

let productData = [
	{
		title: 'Heat sensitive microwaveable ceramic mug',
		category: 'Kitchen Ceramics',
		description:
			'Product is colored black when at room temperature. When heating to 50 degrees Celsius, a smiley faced emoji is displayed on the mug',
		list_price: 7000,
		quantity_available: 17,
	},
];

let updateProductData = [
	{
		list_price: 6650,
		quantity_available: 11,
	},
];

export { updateProductData, productData };
