import { DOMParser } from 'linkedom';
import getItemData from '../getItemData';

const parser = new DOMParser();

let ongoingRequests = new Set();
let processedAsins = new Set();
let allRequested = [];

export async function fetchInBackground(payload) {



  //TODO: TEST MODE
  const hasCommonItems = payload.some(item => allRequested.includes(item));

  if (hasCommonItems) {
    console.log('New payload has common items with the existing requests. Updating allRequested.');
    allRequested = [...allRequested, ...payload];
  } else {
    console.log('New payload is entirely different. Resetting ongoing requests and updating allRequested.');
    allRequested = payload;
    // Cancel ongoing fetches and reset state
    ongoingRequests.clear();
    processedAsins.clear();
  }

  //TODO: TEST MODE


  allRequested.filter((e, i) => allRequested.indexOf(e) === i)
  processBatches();
}



async function processBatches() {

  const batchSize = 3;
  const delayBetweenBatches = 1000; // 3 seconds delay

  const filteredBatch = allRequested.filter(asin => !ongoingRequests.has(asin) && !processedAsins.has(asin));

  const uniqueBatch = await filterByCached(filteredBatch);

  console.log('uniqueBatch left:', uniqueBatch?.length, uniqueBatch);

  async function filterByCached(batch) {
    // (unchanged) Your implementation for filtering by cache
    return batch;
  }

  if (uniqueBatch) {
    for (let i = 0; i < uniqueBatch.length; i += batchSize) {
      const currentBatch = uniqueBatch.slice(i, i + batchSize);
      console.log('Requesting batch:', currentBatch);

      ongoingRequests = new Set([...ongoingRequests, ...currentBatch]);

      const promises = currentBatch.map(asin => fetchAndUpdateState(asin));

      await Promise.race([Promise.all(promises), delay(delayBetweenBatches)]);

      ongoingRequests.clear();

      if (i + batchSize < uniqueBatch.length) {
        await delay(delayBetweenBatches);
      }
    }
  } else {
    console.log('No items in batch. Stopping...');
  }

}

async function fetchAndUpdateState(asin) {
  processedAsins.add(asin);
  const url = `https://www.amazon.com/dp/${asin}?psc=1`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.text();
      const parsedData = parser.parseFromString(data, 'text/html');
      const final = await getItemData(null, [], parsedData, true).then((data) => data);

      setInState({ asin, timestamp: Date.now(), data: final });
    }
  } catch (e) {
    console.log(e);
  } finally {
    ongoingRequests.delete(asin);
  }
}

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