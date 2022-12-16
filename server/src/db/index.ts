// cspell:disable
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: parseInt(process.env.PGPORT as string),
});

export default {
	async end(): Promise<void> {
		await pool.end();
	},

	lastQuery: null,

	// Copied from official docs, slightly modified
	async query(text: string, params?: Array<any>): Promise<QueryResult<any>> {
		// const start = Date.now();
		setTimeout(function () {
			this.lastQuery = arguments;
		});
		/*
		 * uncomment to debug query
		console.log('query', {
			text,
			params,
		});
		 */
		const res = await pool.query(text, params);
		/*
		const duration = Date.now() - start;
		console.log('\nexecuted query', {
			text,
			duration,
			rows: res.rowCount,
			params,
		});
				*/
		return res;
	},

	async getClient(): Promise<any> {
		const client: any = await pool.connect();
		const query = client.query;
		const release = client.release;
		// set a timeout of 5 seconds, after which we will log this client's last query
		const timeout = setTimeout(() => {
			console.error(
				'A client has been checked out for more than 5 seconds!'
			);
			console.error(
				`The last executed query on this client was: ${client.lastQuery}`
			);
		}, 5000);
		// monkey patch the query method to keep track of the last query executed
		client.query = (...args) => {
			client.lastQuery = args;
			return query.apply(client, args);
		};
		client.release = () => {
			// clear our timeout
			clearTimeout(timeout);
			// set the methods back to their old un-monkey-patched version
			client.query = query;
			client.release = release;
			return release.apply(client);
		};
		return client;
	},
};
