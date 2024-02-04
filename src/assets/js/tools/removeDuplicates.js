export default function removeDuplicates(tofetch, fetched) {
  const fetchedMap = {};
  fetched.forEach(item => {
    if (item.asin) {
      fetchedMap[item.asin] = item;
    }
  });

  const filteredToFetch = tofetch.filter(asin => !fetchedMap[asin]);
  return filteredToFetch;
}