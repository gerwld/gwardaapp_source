export async function fetchInBackground(batch) {
  const batchPromises = batch.map(async (asin) => {
    const url = `https://www.amazon.com/dp/${asin}?psc=1`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        return { asin, timestamp: Date.now(), data: final };
      }
    } catch (e) {
      console.log(e);
    } finally {
      // processNextInQueue();
    }
  });

  return Promise.all(batchPromises);
}


// function processNextInQueue() {
//   if (requestQueue.length > 0 && totalRequests < 3 && processingASINs.size < 3) {
//     const nextBatch = requestQueue.shift();
//     processBatch(nextBatch);
//   }
// }