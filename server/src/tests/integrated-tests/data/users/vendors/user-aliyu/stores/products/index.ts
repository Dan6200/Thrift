// cspell:disable
import {
	Product,
	ProductMedia,
	ProductPartial,
} from '../../../../../../../../types-and-interfaces/products.js'

//
export const products: Product[] = [
	{
		title: `"Smart Watch for Men Women, Fitness Watch 1.69" Touch Screen Smartwatch, Fitness Tracker Watch with Heart Rate/Sleep Monitor, 22 Sport Modes IP68 Waterproof Activity Tracker, for Android iOS Black\n`,
		category: 'Electronics',
		description: [
			`* 1.69" HD Full Touch Screen: High texture watch frame with 1.69" LCD full touch colorful screen bring comfortable touch and excellent visual experience.`,
			`There are various watch face styles to choose from in the app. Also you can choose a picture you like to customize the watch face in "QWatch Pro" App. And the smartwatch screen will light up every time you raise your hand.`,
			`Note: Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.\n`,
		],

		list_price: 35000,
		net_price: 30000,
		quantity_available: 17,
	},

	{
		title: `All-new Echo Buds (2023 Release) | True Wireless Bluetooth 5.2 Earbuds with Alexa, multipoint, 20H battery with charging case, fast charging, sweat resistant, semi-in-ear | Glacier White`,
		category: `Electronics`,
		description: [
			`TRUE WIRELESS EARBUDS WITH RICH, BALANCED SOUND — Hear it loud and clear with 12mm drivers delivering crisp audio, balanced bass, and full sound. Be heard with 2 microphones and a voice detection accelerometer for crystal clear communication.`,
			`LONG-LASTING BATTERY — Never pause with up to 5 hours of music playback (6 hours without wake word on), up to 20 total hours with the charging case, and up to 2 hours with a 15-minute quick charge.`,
			`SEAMLESS SWITCHING — Connect to two devices at the same time and automatically move between devices with multipoint pairing. Move from a video call on your laptop to music on your phone without skipping a beat.`,
			`ALEXA ON-THE-GO — Cue music, play podcasts, listen to Audible, make calls, set reminders, and more, all with the sound of your voice. Compatible with iOS and Android, and supports access to Siri and Google Assistant.`,
		],

		list_price: 40000,
		net_price: 35000,
		quantity_available: 18,
	},

	{
		title: `Lenovo Tab M10 Plus 3rd Gen Tablet - 10" FHD - Android 12-32GB Storage - Long Battery Life`,
		category: `Electronics`,
		description: [
			`The dazzling, 10.6" FHD IPS display on this Android tablet lets you stream your video services at up to 1080p, while the quad speaker system optimized for Dolby Atmos envelops you with sound`,
			`A lightweight, portable tablet like the Tab M10 Plus Gen 3 is great for student research and projects, working with the Lenovo Instant Memo app to make on-screen input a breeze`,
			`Keep focused with Immersive Reading Mode, which makes long screen sessions easier on the eyes with enhanced readability, so it's more like reading on paper`,
		],

		list_price: 100000,
		net_price: 100000,
		quantity_available: 7,
	},
]

export const productReplaced: Product[] = [
	{
		title: `"Smart Watch for Men Women, Fitness Watch 1.69" Touch Screen Smartwatch, Fitness Tracker Watch with Heart Rate/Sleep Monitor, 22 Sport Modes IP68 Waterproof Activity Tracker, for Android iOS Black\n`,
		category: 'Electronics',
		description: [
			`* 1.69" HD Full Touch Screen: High texture watch frame with 1.69" LCD full touch colorful screen bring comfortable touch and excellent visual experience.`,
			`There are various watch face styles to choose from in the app. Also you can choose a picture you like to customize the watch face in "QWatch Pro" App. And the smartwatch screen will light up every time you raise your hand.`,
			`Note: Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.\n`,
		],

		list_price: 35000,
		net_price: 30000,
		quantity_available: 17,
	},

	{
		title: `All-new Echo Buds (2023 Release) | True Wireless Bluetooth 5.2 Earbuds with Alexa, multipoint, 20H battery with charging case, fast charging, sweat resistant, semi-in-ear | Glacier White`,
		category: `Electronics`,
		description: [
			`TRUE WIRELESS EARBUDS WITH RICH, BALANCED SOUND — Hear it loud and clear with 12mm drivers delivering crisp audio, balanced bass, and full sound. Be heard with 2 microphones and a voice detection accelerometer for crystal clear communication.`,
			`LONG-LASTING BATTERY — Never pause with up to 5 hours of music playback (6 hours without wake word on), up to 20 total hours with the charging case, and up to 2 hours with a 15-minute quick charge.`,
			`SEAMLESS SWITCHING — Connect to two devices at the same time and automatically move between devices with multipoint pairing. Move from a video call on your laptop to music on your phone without skipping a beat.`,
			`ALEXA ON-THE-GO — Cue music, play podcasts, listen to Audible, make calls, set reminders, and more, all with the sound of your voice. Compatible with iOS and Android, and supports access to Siri and Google Assistant.`,
		],

		list_price: 40000,
		net_price: 35000,
		quantity_available: 17,
	},

	{
		title: `Lenovo Tab M10 Plus 3rd Gen Tablet - 10" FHD - Android 12-32GB Storage - Long Battery Life`,
		category: `Electronics`,
		description: [
			`The dazzling, 10.6" FHD IPS display on this Android tablet lets you stream your video services at up to 1080p, while the quad speaker system optimized for Dolby Atmos envelops you with sound`,
			`A lightweight, portable tablet like the Tab M10 Plus Gen 3 is great for student research and projects, working with the Lenovo Instant Memo app to make on-screen input a breeze`,
			`Keep focused with Immersive Reading Mode, which makes long screen sessions easier on the eyes with enhanced readability, so it's more like reading on paper`,
		],

		list_price: 100000,
		net_price: 100000,
		quantity_available: 17,
	},
]

export const productPartialUpdate: ProductPartial[] = [
	{
		category: 'Electronics',
		description: [
			`Note: Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.\n`,
		],

		list_price: 35000,
		net_price: 30000,
		quantity_available: 17,
	},

	{
		description: [
			`TRUE WIRELESS EARBUDS WITH RICH, BALANCED SOUND — Hear it loud and clear with 12mm drivers delivering crisp audio, balanced bass, and full sound. Be heard with 2 microphones and a voice detection accelerometer for crystal clear communication.`,
			`ALEXA ON-THE-GO — Cue music, play podcasts, listen to Audible, make calls, set reminders, and more, all with the sound of your voice. Compatible with iOS and Android, and supports access to Siri and Google Assistant.`,
		],

		net_price: 35000,
	},

	{
		title: `Lenovo Tab M10 Plus 3rd Gen Tablet - 10" FHD - Android 12-32GB Storage - Long Battery Life`,
		category: `Electronics`,
		list_price: 100000,
		net_price: 100000,
	},
]

export const productMedia: ProductMedia[][] = [
	[
		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/display.jpg',
			description: 'A fitness smartwatch',
		},

		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/71-QFdYVDjL._AC_SL1500_.jpg',
			description: 'A fitness smartwatch',
		},

		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/716xePAwIxL._AC_SL1500_.jpg',
			description: 'A fitness smartwatch',
		},

		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/71DWBxbq1NL._AC_SL1500_.jpg',
			description: 'A fitness smartwatch',
		},

		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/71MNIstzDvL._AC_SL1500_.jpg',
			description: 'A fitness smartwatch',
		},

		{
			name: 'tozo-smartwatch',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/tozo-smartwatch/71UMkMp9d1L._AC_SL1500_.jpg',
			description: 'A fitness smartwatch',
		},
	],

	[
		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/display.jpg',
			description: 'Echo Wireless Earbuds',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/411NxOSWI5L._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/41yDQmJ4ZlL._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/511jS3UQbsL._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/51k0HSzPB5L._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/514OQnrNPmL._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/61H2DdgDuAL._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/61KDOi775cL._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'echo-wireless-buds',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/echo-wireless-buds/71ARULrls-L._AC_SL1000_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},
	],
	[
		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/display.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/410lti6ZAmL._AC_SL1500_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/61n2uja0sIL._AC_SL1500_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/61siR9sOKDL._AC_SL1500_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/71TOJXChXtL._AC_SL1500_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},

		{
			name: 'lenovo-tab',
			path:
				process.env.HOME +
				'/dev_work/thrift/product-media/lenovo-tab-m10-plus/71bG32yslGL._AC_SL1500_.jpg',
			description: 'Lenovo Tablet M10 Plus Gen 3',
		},
	],
]

// should be a matrix
export const updatedProductMedia: ProductMedia[] = [
	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/61s3bP9rdOL._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},

	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/71-QFdYVDjL._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},

	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/716xePAwIxL._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},

	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/71DWBxbq1NL._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},

	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/71MNIstzDvL._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},

	{
		name: 'tozo-smartwatch',
		path:
			process.env.HOME +
			'/dev_work/thrift/product-media/tozo-smartwatch/71UMkMp9d1L._AC_SL1500_.jpg',
		description: 'A fitness smartwatch',
	},
]
