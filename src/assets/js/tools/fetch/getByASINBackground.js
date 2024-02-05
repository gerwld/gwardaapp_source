import { DOMParser } from 'linkedom';
import getItemData from '../getItemData';

const parser = new DOMParser()

let ongoingRequests = new Set();
let processedAsins = new Set();

export async function fetchInBackground(batch) {
  const batchSize = 6;
  const delayBetweenBatches = 3000; // 3 seconds delay

  const filteredBatch = batch.filter(asin => !ongoingRequests.has(asin) && !processedAsins.has(asin));

  const uniqueBatch = await filterByCached(filteredBatch)
  console.log('uniqueBatch left:', uniqueBatch?.length, uniqueBatch);

  async function filterByCached(batch) {
    return new Promise((resolve) => {
      const hoursInMillis = 12 * 60 * 60 * 1000;
      const deadline = Date.now();

      chrome.storage.local.get("gpCache", (state) => {
        if (state?.gpCache) {
          const fresh_cache = [...state.gpCache].filter((e) => {
            // console.log("fresh_cache validation:", e.timestamp, deadline);
            return e.timestamp + hoursInMillis > deadline
          });
          console.log('fresh_cache left (in state):', state, fresh_cache);
          chrome.storage.local.set({ "gpCache": [...fresh_cache] })

          if (state && Array.isArray(state.gpCache) && fresh_cache && Array.isArray(fresh_cache)) {
            console.log(
              'filtered (before & after):',
              batch,
              batch.filter((asin) => !fresh_cache.some((item) => item.asin === asin))
            );
            resolve(batch.filter((asin) => !fresh_cache.some((item) => item.asin === asin)));
          } else {
            resolve(batch);
          }
        } else {
          resolve(batch);
        }
      });
    });
  }

  if (uniqueBatch) {
    for (let i = 0; i < uniqueBatch.length; i += batchSize) {
      const currentBatch = uniqueBatch.slice(i, i + batchSize);
      console.log('Requesting batch:', currentBatch);

      // Add ongoing requests to the set
      ongoingRequests = new Set([...ongoingRequests, ...currentBatch]);

      const promises = currentBatch.map(asin => fetchAndUpdateState(asin));

      // Wait for either all requests to finish or 5 seconds
      await Promise.race([Promise.all(promises), delay(delayBetweenBatches)]);

      // Remove completed and processed requests from ongoing requests set
      ongoingRequests.clear();

      if (i + batchSize < uniqueBatch.length) {
        // Wait for the specified delay before making the next batch of requests
        await delay(delayBetweenBatches);
      }
    }
  } else {
    console.log('No items in batch. Stopping...');
  }
}

async function fetchAndUpdateState(asin) {
  const url = `https://www.amazon.com/dp/${asin}?psc=1`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      processedAsins.add(asin);
      const data = await response.text();
      const parsedData = parser.parseFromString(data, 'text/html');
      const final = await getItemData(null, [], parsedData, true).then((data) => data);

      setInState({ asin, timestamp: Date.now(), data: final });
    }
  } catch (e) {
    console.log(e);
  } finally {
    // Remove completed and processed requests from ongoing requests set
    ongoingRequests.delete(asin);
  }
}

// Utility function for introducing a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




function setInState(newItem) {
  chrome.storage.local.get("gpCache", (state) => {
    console.log("gpCache update with:", newItem, state);
    if (state.gpCache?.length) {
      let updated = [...state.gpCache, newItem]
      chrome.storage.local.set({ "gpCache": updated });
    }
    else
      chrome.storage.local.set({ "gpCache": [newItem] });
  });
}


// function processNextInQueue() {
//   if (requestQueue.length > 0 && totalRequests < 3 && processingASINs.size < 3) {
//     const nextBatch = requestQueue.shift();
//     processBatch(nextBatch);
//   }
// }