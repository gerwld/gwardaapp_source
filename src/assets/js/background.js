//   - This file is part of GwardaApp Extension
//  <https://github.com/gerwld/GwardaApp-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present GwardaApp Extension
//   -
//   - GwardaApp Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - GwardaApp Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with GwardaApp Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.

import fetchInBackground from "./tools/fetch/fetchInBackground";
import fetchStocksInBackground from "./tools/fetch/fetchStocksInBackground";

const initialState = {
  disabled: true,
  dark_mode: false,
  gn_keywords: true,
  stock_status: true,
  lqs: true,
  quick_view: true,
  public_data: true
};

const browser_cr = chrome ? chrome : browser;


// Show accept cookies if not cookies_gal20 (state prop)
browser_cr.runtime.onInstalled.addListener(function () {
  browser_cr.storage.sync.get("cookies_gal20", (result) => {
    // If no cookies accept, disable extension & open accept window
    if (!result?.cookies_gal20) {
      browser_cr.storage.local.set({ "gpState": { ...initialState, disabled: true } })
      browser_cr.tabs.create({ url: "/content/preferences.html" });
    }
  });
});

// Init gpState (state prop)
browser_cr.storage.local.get("gpState", (result) => {
  browser_cr.storage.local.set({ "gpState": { ...initialState, ...result?.gpState } });
});


// Clear cache if > 4mb or item
function clearCache(bytesInUse) {
  let currentStorageUsage = bytesInUse / 1024 / 1024;
  let storageLimit = 4;
  if (currentStorageUsage > storageLimit) {
    browser_cr.storage.local.remove("gpCache", function () {
      console.warn("gwardaApp: cache removed due to storage limit");
    });
  }
}
if (browser_cr.storage.local?.getBytesInUse)
  browser_cr.storage.local.getBytesInUse(null, function (b) {
    clearCache(b);
  });
else {
  browser_cr.storage.local.get(null, function (items) {
    clearCache(JSON.stringify(items).length);
  })
}

// Clear cache if expired
browser_cr.storage.local.get('gpCache', function (payload) {
  let oneDayInMillis = 1000 * 60 * 60 * 24;
  if (payload?.gpCache && payload.gpCache.length) {

    let exp = []
    let new_cache = payload.gpCache.filter(e => {
      let not_expired = (e?.timestamp + oneDayInMillis) > Date.now()
      if (!not_expired)
        exp.push(e)
      return not_expired && e;
    });
    console.log('gpCache old cache clear (24h)', exp);
    console.log('gpCache after clear:', new_cache);
    browser_cr.storage.local.set({ "gpCache": [...new_cache] });
  }
});

// fetchData message, message.arr = batch from frontend
browser_cr.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
    fetchInBackground(message.arr)
      .then(data => {
        if (browser_cr.runtime.lastError) {
          console.error("Runtime error:", browser_cr.runtime.lastError);
        } else {
          console.log(data);
          sendResponse(data);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        sendResponse({ error: "Error fetching data" });
      });
    // Return true to approve the async type of the listener
    return true;
  }
  else if (message.action === 'fetchStocks') {
    fetchStocksInBackground(message.arr)
      .then(data => {
        if (browser_cr.runtime.lastError) {
          console.error("Runtime error:", browser_cr.runtime.lastError);
        } else {
          console.log(data);
          sendResponse(data);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        sendResponse({ error: "Error fetching data" });
      });
    // Return true to approve the async type of the listener
    return true;
  }
});



// browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSfECVugYsy9buYIcIu6mMuHqTZPylcBJPl60Dz6mc7Pboz9Pg/viewform?usp=sf_link");
