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
      chrome.tabs.create({ url: "/content/preferences.html" });
    }
  });
});


// browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScGXGlaC1KUSji5XzrVtB7PpRdoBbmRhoEVig1BPPrUY2ShKg/viewform?usp=sf_link");
