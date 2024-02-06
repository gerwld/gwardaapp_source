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

import { fetchInBackground } from "./tools/fetch/getByAsinBackground";
import getItemData from "./tools/getItemData";

const initialState = {
  disabled: true,
  dark_mode: false,
};

const browser_cr = chrome ? chrome : browser;

// Init gpState (state prop)
browser_cr.storage.local.get("gpState", (result) => {
  browser_cr.storage.local.set({ "gpState": { ...initialState, ...result?.gpState } });
});

// Show accept cookies if not cookies_gal20 (state prop)
browser_cr.runtime.onInstalled.addListener(function () {
  browser_cr.storage.local.get(null, (result) => {
    // If no cookies accept, disable extension & open accept window
    if (!result?.cookies_gal20) {
      browser_cr.storage.local.set({ "gpState": { ...result.gpState, disabled: true } })
      browser_cr.tabs.create({ url: "/content/preferences.html" });
    }
  });
});


// Clear cache if > 4mb or item
chrome.storage.local.getBytesInUse(null, function (bytesInUse) {
  let currentStorageUsage = bytesInUse / 1024 / 1024;
  let storageLimit = 4;
  if (currentStorageUsage > storageLimit) {
    chrome.storage.local.remove("gpCache", function () {
      console.warn("gwardaApp: cache removed due to storage limit");
    });
  }
});

// Clear cache if expired
chrome.storage.local.get('gpCache', function(payload) {
  let oneDayInMillis = 1000 * 60 * 60 * 24;
  if (payload?.gpCache && payload.gpCache.length) {
    
    let exp = []
    let new_cache = payload.gpCache.filter(e => {
      let not_expired = (e.timestamp + oneDayInMillis) > Date.now()
      if (!not_expired) 
        exp.push(e)
      return not_expired;
    });
    console.log('gpCache old cache clear (24h)', exp);
    console.log('gpCache after clear:', new_cache);
    chrome.storage.local.set({"gpCache": [...new_cache]});
  }
});

// fetchData message
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
    const { arr } = message;
    console.log('getbyASIN sendMessage recieved:', message);
    if (arr?.length)
      await fetchInBackground(arr)
  }
})




// browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScGXGlaC1KUSji5XzrVtB7PpRdoBbmRhoEVig1BPPrUY2ShKg/viewform?usp=sf_link");
