export default async function retryQuery(
  query: (...rest: any[]) => Promise<any>,
  args: any[],
  retries: number,
  ms: number
): Promise<any> {
  let res: any;
  try {
    if (!retries) {
      console.log(`db connection failed...quitting`);
      return;
    }
    res = query(...args);
    return res;
  } catch (err) {
    console.error(err);
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    }).then(() => {
      if (retries > 1)
        console.log(`db connection failed...retrying after ${ms}ms`);
      res = retryQuery(query, args, retries - 1, ms);
      return res;
    });
  }
}
