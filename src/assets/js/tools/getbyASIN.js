import getItemData from "./getItemData";

if (!window.globalParser)
  window.globalParser = new DOMParser();

const processedASINs = new Set();
const processingASINs = new Set();
const arrGlobal = [];
let totalRequests = 0;
const requestQueue = [];

const CACHE_PREFIX = 'gwardaCache_';
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default async function getbyASIN(arr, callback) {
  const combinedArr = [...new Set([...arr])];
  if (combinedArr?.length) {
    arrGlobal.push(...arr);
    arrGlobal.splice(0, arr.length);

    console.log(combinedArr);

    const batchSize = 3;
    const batches = [];

    for (let i = 0; i < combinedArr.length; i += batchSize) {
      const batch = combinedArr.slice(i, i + batchSize);
      batches.push(batch);
    }

    async function processBatch(batch) {
      const batchPromises = batch.map(async (asin) => {
        if (!processedASINs.has(asin) && !processingASINs.has(asin)) {
          processingASINs.add(asin);
          totalRequests++;

          function onDataProcessed(payload) {
            processedASINs.add(asin);
            callback({ asin, data: payload });
            console.log({ asin, data: payload });
          }

          const cacheKey = CACHE_PREFIX + asin;
          const cachedData = await getCachedData(cacheKey);

          if (cachedData) {
            const { data } = cachedData;
            console.log("cached:", data, asin);
            onDataProcessed(asin, data);

            processingASINs.delete(asin);
            totalRequests--;
            processNextInQueue();
          }
          else {
            const url = `https://www.amazon.com/dp/${asin}?psc=1`;
            try {
              const response = await fetch(url);
              if (response.ok) {
                const data = await response.text();
                const parsedData = window.globalParser.parseFromString(data, 'text/html');
                const find = [];
                const final = await getItemData(null, find, parsedData).then(data => data);
                // Save data to Cache Storage with a timestamp
                const timestampedData = { asin: asin, timestamp: Date.now(), data: final };
                await cacheData(cacheKey, timestampedData);
                getItemData(onDataProcessed, find, parsedData);
              }
            } catch (e) {
              console.log(e);
            } finally {
              processingASINs.delete(asin);
              totalRequests--;
              processNextInQueue();
            }
          }

        }
      });

      await Promise.all(batchPromises);
    }

    function processNextInQueue() {
      if (requestQueue.length > 0 && totalRequests < 3 && processingASINs.size < 3) {
        const nextBatch = requestQueue.shift();
        processBatch(nextBatch);
      }
    }

    for (const batch of batches) {
      if (totalRequests < 3) {
        await processBatch(batch);
      } else {
        console.log("Maximum total requests reached. Adding to the queue.");
        requestQueue.push(batch);
      }
    }
  }
}

// const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

async function cacheData(cacheKey, data) {
  const cache = await caches.open('gwardaCache');

  // Create a timestamped data object
  const timestampedData = {
    timestamp: Date.now(),
    ...data
  };

  // Convert the data object to a JSON string
  const dataString = JSON.stringify(timestampedData);
  // Create a Response object with the JSON string
  const cacheResponse = new Response(dataString);
  // Put the Response object into the cache
  await cache.put(cacheKey, cacheResponse);
}

async function getCachedData(cacheKey) {
  const cache = await caches.open('gwardaCache');
  const cachedResponse = await cache.match(cacheKey);

  if (cachedResponse) {
    // Parse the JSON data from the cached response
    const timestampedData = JSON.parse(await cachedResponse.text());
    const { timestamp, data } = timestampedData;
    // Check if the cached data is still valid
    if (Date.now() - timestamp <= CACHE_EXPIRATION_TIME) {
      return { data };
    } else {
      // Remove expired data from the cache
      await cache.delete(cacheKey);
    }
  }

  return null;
}


