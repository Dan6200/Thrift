// cspell:disable
import { Pool, QueryResult } from "pg";

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

async function retryQuery(
  retries: number,
  ms: number,
  text: string,
  params?: Array<any>
): Promise<any> {
  let res: any;
  try {
    if (!retries) {
      console.log(`db connection failed...quitting`);
      return;
    }
    debugger;
    res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error(err);
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    }).then(() => {
      if (retries > 1)
        console.log(`db connection failed...retrying after ${ms}ms`);
      res = retryQuery(retries - 1, ms, text, params);
      return res;
    });
  }
}

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
    let res: any;
    const retryCount = 3;
    const delay = 500;
    res = retryQuery(retryCount, delay, text, params);
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
