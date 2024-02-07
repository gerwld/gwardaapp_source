import delay from "../delay";
import getItemData from "../getItemData";

const BATCH_SIZE = 2;
const DELAY = 2000;
let isWorking = false;
let allRequested = []

export default async function getbyASIN(arr) {
  let filteredArr = [...arr];

  // retrieves gpCache from chrome storage
  chrome.storage.local.get("gpCache", (payload) => {
    console.log(payload);
    let state = payload.gpCache ? payload.gpCache : []
    if (state.length)
      filteredArr = filteredArr.filter(f => !state.some(i => i.asin === f));

    // sends message after filtering
    fetchOnBackendInBatch(filteredArr)
    console.log('getbyASIN sendMessage: (filtered, orig, state)', filteredArr, arr, payload);
  });
}


function recieveFetchFromBackend(payload) {
  console.log(payload);
  if (payload && payload.error) {
    console.error(payload.error)
  }
  else if (payload) {
    let scrapped = [...payload].map(item => ({ asin: item.asin, timestamp: item.timestamp, data: getDataFromSSR(item.data) }))
    console.log(scrapped);
    updateCache(scrapped);
  }
}


async function fetchOnBackendInBatch(asins) {
  allRequested.push(...asins)
  allRequested.filter((e, i) => allRequested.indexOf(e) === i)

  if (!isWorking) {
    isWorking = true;
    for (let i = 0; i < allRequested.length; i += BATCH_SIZE) {
      const currentBatch = allRequested.slice(i, i + BATCH_SIZE);
      console.log('Requesting batch:', currentBatch);

      // Fetching with callback to recieveFetchFromBackend
      await chrome.runtime.sendMessage({ action: 'fetchData', arr: currentBatch }, response => {
        recieveFetchFromBackend(response);
      });
      await delay(DELAY);
    }
    isWorking = false;
  }
}

function getDataFromSSR(page) {
  const parser = new DOMParser();
  const soup = parser.parseFromString(page, 'text/html');
  return getItemData(null, [], soup)
}

function updateCache(payload) {
  chrome.storage.local.get("gpCache", cache => {
    let new_cache;
    if (cache && cache.gpCache && cache.gpCache.length)
      new_cache = [...cache.gpCache, ...payload]
    else
      new_cache = [...payload]
    chrome.storage.local.set({ "gpCache": new_cache })

  })
}