import stripSoup from "../stripSoup";

export default async function fetchInBackground(asins, domain = "www.amazon.com") {
  console.log('fetchInBackground:', asins, domain);
  if (!asins || !asins.length)
    return new Error("No data recieved in fetchInBackground (asin argument)");

  async function fetchPages(asin) {
    const date = Date.now();
    try {
      const response = await fetch(`https://${domain}/dp/${asin}?psc=1`);
      if (response.ok) {
        const data = await response.text();
        let soup = stripSoup(data + '');
        if (soup)
          return { asin, data: soup, timestamp: date };
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
