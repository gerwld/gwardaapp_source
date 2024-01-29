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


// Navigate to settings message listener
let preferencesTabId = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.openPreferences) {
    if (preferencesTabId) {
      chrome.tabs.get(preferencesTabId, (tab) => {
        if (chrome.runtime.lastError || !tab) {
          preferencesTabId = null;
          createNewTab();
        } else {
          chrome.tabs.update(preferencesTabId, { active: true }, () => {
            if (chrome.runtime.lastError) {
              preferencesTabId = null;
              createNewTab();
            }
          });
        }
      });
    } else {
      createNewTab();
    }
  }
});

function createNewTab() {
  chrome.tabs.create({ url: "/content/preferences.html" }, (tab) => {
    preferencesTabId = tab.id;
  });
}

// If was closed set to null
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === preferencesTabId) {
    preferencesTabId = null;
  }
});



// TEST: CONTENT SCRIPT PART, to fix invalidated context
const contentScriptPorts = {};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'content-script') {
    contentScriptPorts[port.sender.tab.id] = port;

    port.onDisconnect.addListener(() => {
      delete contentScriptPorts[port.sender.tab.id];
    });
  }
});

function openPreferences(tabId) {
  const preferencesTabId = contentScriptPorts[tabId];

  if (preferencesTabId) {
    chrome.tabs.update(preferencesTabId, { active: true });
  } else {
    chrome.tabs.create({ url: "/content/preferences.html" }, (tab) => {
      contentScriptPorts[tabId] = tab.id;
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.openPreferences) {
    openPreferences(sender.tab.id);
  }
});







// browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScGXGlaC1KUSji5XzrVtB7PpRdoBbmRhoEVig1BPPrUY2ShKg/viewform?usp=sf_link");
