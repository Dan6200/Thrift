// cspell:disable
import { Pool, QueryResult } from "pg";
import retryQuery from "../controllers/helpers/retryQuery";

const pool = new Pool({
  // user: process.env.LPGUSER,
  user: process.env.PGUSER,
  // host: process.env.LPGHOST,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT as string),
  ssl: true,
});

export default {
  async end(): Promise<void> {
    await pool.end();
  },

  lastQuery: null,

  // Copied from official docs, slightly modified
  async query(text: string, params?: Array<any>): Promise<QueryResult<any>> {
    const start = Date.now();
    setTimeout(function () {
      this.lastQuery = arguments;
    });
    // allow a retry if DB fails to connect
    let res: any;
    const retryCount = 3;
    const delay = 500;
    res = await retryQuery(
      pool.query.bind(pool),
      [text, params],
      retryCount,
      delay
    );
    const duration = Date.now() - start;
    console.log("\nexecuted query", {
      text,
      params,
      duration,
      rows: res.rowCount,
    });
    return res;
  },

  async getClient(): Promise<any> {
    const client: any = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error("A client has been checked out for more than 5 seconds!");
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
