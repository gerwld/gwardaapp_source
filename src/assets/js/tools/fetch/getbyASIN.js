import getItemData from "../getItemData";
const browser_cr = chrome ? chrome : browser;


if (!window.globalParser)
  window.globalParser = new DOMParser();

// const processedASINs = new Set();
// const processingASINs = new Set();
const arrGlobal = [];
// let totalRequests = 0;
// const requestQueue = [];

// const CACHE_PREFIX = 'gwardaCache_';
// const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

let prevstate;
browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
  if (
    changes.gpCache &&
    changes.gpCache.newValue &&
    JSON.stringify({ ...changes.gpCache.newValue }) !== prevstate
  ) {
    prevstate = JSON.stringify({ ...changes.gpCache.newValue });
    initializeUpdate();
  }
});


function initializeUpdate(state) {
  browser_cr.storage.local.get("gpCache", (result) => {
    console.log(result);

  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processNextInQueue') {
    // processNextInQueue();
  }
  else if (message.action === 'dataFetched') {
    readDataFromStorage();
  }
});

// async function processBatch(batch) {
// console.log("processBatch call, args:", batch);
// const batchPromises = batch.map(async (asin) => {
// if (!processedASINs.has(asin) && !processingASINs.has(asin)) {
// processingASINs.add(asin);
// const cacheKey = CACHE_PREFIX + asin;
// const cachedData = await getCachedData(cacheKey);

// function onDataProcessed(payload) {
//   processedASINs.add(asin);
//   // callback({ asin, data: payload });
//   console.log({ asin, data: payload });
// }

// if (cachedData) {
//   const { data } = cachedData;
//   console.log("cached:", data, asin);
//   onDataProcessed(asin, data);

//   processingASINs.delete(asin);
//   totalRequests--;
//   sendProcessNextInQueueMessage();
// } else {
// totalRequests++;
// Send a message to background.js to fetch data
// chrome.runtime.sendMessage({ action: 'fetchData', arr: [asin] });
// }
// }
// });
// return Promise.all(batchPromises);
// }




// async function processBatch(batch) {
//   const batchPromises = batch.map(async (asin) => {
//     if (!processedASINs.has(asin) && !processingASINs.has(asin)) {
//       processingASINs.add(asin);
//       totalRequests++;

//       function onDataProcessed(payload) {
//         processedASINs.add(asin);
//         callback({ asin, data: payload });
//         console.log({ asin, data: payload });
//       }

//       const cacheKey = CACHE_PREFIX + asin;
//       const cachedData = await getCachedData(cacheKey);

//       if (cachedData) {
//         const { data } = cachedData;
//         console.log("cached:", data, asin);
//         onDataProcessed(asin, data);

//         processingASINs.delete(asin);
//         totalRequests--;
//         processNextInQueue();
//       }
//       else {
//         const url = `https://www.amazon.com/dp/${asin}?psc=1`;
//         try {
//           const response = await fetch(url);
//           if (response.ok) {
//             const data = await response.text();
//             const parsedData = window.globalParser.parseFromString(data, 'text/html');
//             const find = [];
//             const final = await getItemData(null, find, parsedData).then(data => data);
//             // Save data to Cache Storage with a timestamp
//             const timestampedData = { asin: asin, timestamp: Date.now(), data: final };
//             await cacheData(cacheKey, timestampedData);
//             getItemData(onDataProcessed, find, parsedData);
//           }
//         } catch (e) {
//           console.log(e);
//         } finally {
//           processingASINs.delete(asin);
//           totalRequests--;
//           processNextInQueue();
//         }
//       }

//     }
//   });

//   await Promise.all(batchPromises);
// }



function sendProcessNextInQueueMessage() {
  chrome.runtime.sendMessage({ action: 'processNextInQueue' });
}

function readDataFromStorage() {
  // Read data from chrome.storage.local
  chrome.storage.local.get('gpCache', (result) => {
    const gpCache = result.gpCache;
    if (gpCache) {
      // Process the data as needed
      console.log('Data fetched from storage:', gpCache);
    }
  });
}


export default async function getbyASIN(arr, callback) {
  const combinedArr = [...new Set([arr])];
  if (combinedArr?.length) {
    arrGlobal.push(...arr, "123123", "123123123");
    arrGlobal.splice(0, arr.length);

    // const batchSize = 3;
    // const batches = [];

    // for (let i = 0; i < combinedArr.length; i += batchSize) {
    //   const batch = combinedArr.slice(i, i + batchSize);
    //   batches.push(batch);
    // }

    chrome.runtime.sendMessage({ action: 'fetchData', arr: arrGlobal });
  }
}



