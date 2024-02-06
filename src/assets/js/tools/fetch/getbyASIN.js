export default async function getbyASIN(arr) {
  let filteredArr = [...arr];

  // retrieves gpCache from chrome storage
  chrome.storage.local.get("gpCache", (payload) => {
    console.log(payload);
    if(payload.gpCache) {
      // filters filteredArr based on gpCache
      filteredArr = filteredArr.filter(i => !payload.gpCache.some(l => {
        l.asin
        return l.asin === i
      } ));

      // sends message after filtering
      chrome.runtime.sendMessage({ action: 'fetchData', arr: filteredArr });
      console.log('getbyASIN sendMessage: (filtered, orig, state)', filteredArr, arr, payload);
    } else {
      chrome.runtime.sendMessage({ action: 'fetchData', arr: filteredArr });
    }
  });
}
