import stripSoup from "../stripSoup";

export default async function fetchStocksInBackground(asins, domain = "www.amazon.com") {
  console.log('fetchInBackground:', asins, domain);
  if (!asins || !asins.length)
    return new Error("No data recieved in fetchInBackground (asin argument)");

  async function fetchPages(asin) {
    try {
      const response = await fetch(`https:///${domain}/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`);
      if (response.ok) {
        const data = await response.text();
        let soup = stripSoup(data + '');
        if (soup)
          return soup;
        else
          return retry(asin, 'Failed to strip soup after response.ok');
      }
    }
    catch (e) {
      return retry(asin, e);
    }
  }

  let retryTotal = 3;
  async function retry(asin, error) {
    if (retryTotal > 0) {
      retryTotal--;
      console.log(`Retrying for ASIN ${asin}, retry count: ${retryTotal}`);
      return fetchPages(asin);
    } else {
      return new Error('Maximum retry limit reached.', error);
    }
  }

  return Promise.all(asins.map(asin => fetchPages(asin)));
}
