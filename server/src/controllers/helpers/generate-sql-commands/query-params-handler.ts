export function handleSortQuery(queryString: string): string {
  let sortCriteria: string[] = queryString.split(",");
  let dbQueryString = "order by ";
  sortCriteria.forEach((str, index) => {
    if (index !== 0) dbQueryString += ", ";
    if (str[0] === "-") {
      dbQueryString += str.slice(1) + " desc";
    } else {
      dbQueryString += str + " asc";
    }
  });
  return dbQueryString;
}
