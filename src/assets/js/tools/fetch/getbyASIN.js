import delay from "../delay";
import getItemData from "../getItemData";
const browser_cr = chrome ? chrome : browser;

const BATCH_SIZE = 5;
const DELAY = 2000;
let isWorking = false;
let allRequested = [];
let allProcessed = [];

export default async function getbyASIN(arr) {
  let filteredArr = [...arr];

  // retrieves gpCache from browser_cr storage
  browser_cr.storage.local.get("gpCache", (payload) => {
    console.log(payload);
    let state = payload.gpCache ? payload.gpCache : []
    if (state.length)
      filteredArr = filteredArr.filter(f => !state.some(i => i.asin === f));

    // sends message after filtering
    fetchOnBackendInBatch(filteredArr)
    console.log('getbyASIN sendMessage: (filtered, orig, state)', filteredArr, arr, payload);
  });
}


async function recieveFetchFromBackend(payload) {
  console.log("recieveFetchFromBackend", payload);
  if (payload && payload.error) {
    console.error(payload.error);
  } else if (payload) {
    Promise.all(payload.map(item => getDataFromSSR(item.data)
      .then(data => ({
        asin: item.asin,
        timestamp: item.timestamp,
        data: data
      }))
    ))
      .then(scrapped => {
        console.log("recieveFetchFromBackend scrapped", scrapped);
        updateCache(scrapped);
        scrapped.forEach(e => {
          if (e?.asin)
            allProcessed.push(e.asin)
        })
      })
      .catch(error => {
        console.warn('recieveFetchFromBackend getDataFromSSR error:', error);
      });
  }
}



async function fetchOnBackendInBatch(asins, isRetry) {
  allRequested.push(...asins)
  allRequested = allRequested.filter((e, i) => allRequested.indexOf(e) === i)


  if (!isWorking) {
    isWorking = true;
    for (let i = 0; i < allRequested.length; i += BATCH_SIZE) {
      const currentBatch = allRequested.slice(i, i + BATCH_SIZE).filter(e => allProcessed.indexOf(e) === -1);
      console.log('Requesting batch:', currentBatch);

      // Fetching with callback to recieveFetchFromBackend
      if (currentBatch && currentBatch.length) {
        await browser_cr.runtime.sendMessage({ action: 'fetchData', arr: currentBatch }, response => {
          recieveFetchFromBackend(response);
        });
        await delay(DELAY);
      }
    }
    isWorking = false;
  }
}

async function getDataFromSSR(page) {
  const parser = new DOMParser();
  const soup = parser.parseFromString(page, 'text/html');
  const data = await getItemData(null, [], soup, 1, 1);
  return data;
}

function updateCache(payload) {
  browser_cr.storage.local.get("gpCache", cache => {
    let new_cache;
    if (cache && cache.gpCache && cache.gpCache.length)
      new_cache = [...cache.gpCache, ...payload]
    else
      new_cache = [...payload]
    browser_cr.storage.local.set({ "gpCache": new_cache })

  })
}