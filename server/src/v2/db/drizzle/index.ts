// import { InferModel } from 'drizzle-orm'
// import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

// const users = pgTable('users', {
// 	userId: serial('user_id').primaryKey(),
// 	firstName: varchar('first_name', {
// 		length: 30,
// 	}).notNull(),
// 	lastName: varchar('last_name', {
// 		length: 30,
// 	}).notNull(),
// 	email: varchar('email', {
// 		length: 320,
// 		// unique: true,
// 	}),
// 	phone: varchar('phone', {
// 		length: 40,
// 		// unique: true,
// 	}),
// 	// password: bytea('password',{
// 	// 	notNull: true,
// 	// },
// 	dob: date('dob').notNull(),
// 	country: varchar('country').notNull(),
// })

// export type User = InferModel<typeof users>

// export type NewUser = InferModel<typeof users, 'insert'>
