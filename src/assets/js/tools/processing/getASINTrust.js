let lastFetchTime = 0;
let prevData;
export default async function fetchASINTrust(asins) {
  let current = asins.join(',');
  if(current !== prevData) {
    prevData = current;

  console.log('fetchASINTrust:', asins);
  if (!asins || !asins.length)
    throw new Error("No data received in fetchASINTrust (asin argument)");

  const currentTime = Date.now();
  const timeSinceLastFetch = currentTime - lastFetchTime;

  // 1s Debounce 
  if (timeSinceLastFetch < 1) {
    console.log(`Debouncing fetchASINTrust. Remaining time: ${1000 - timeSinceLastFetch}ms`);
    return;
  }

  lastFetchTime = currentTime;

  async function fetchPages() {
    const data = {
      asins: current,
      tld: "com"
    };
    try {
      const response = await fetch(`https://trustwerty.com/api/bulk-asins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const jsonData = await response.json();
        console.log("TRUST:", jsonData);
        return jsonData;
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (e) {
      return retry(e);
    }
  }

  let retryTotal = 3;
  async function retry(error) {
    if (retryTotal > 0) {
      retryTotal--;
      console.log(`Retrying for ASIN ${asins}, retry count: ${retryTotal}`);
      return fetchPages();
    } else {
      throw new Error('Maximum retry limit reached.', error);
    }
  }

  return fetchPages();
}
}
