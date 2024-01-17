//   - This file is part of GainseApp Extension
//  <https://github.com/gerwld/GainseApp-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present GainseApp Extension
//   -
//   - GainseApp Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - GainseApp Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with GainseApp Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.

const initialState = {
  disabled: false,
  dark_mode: true,
  focus_mode: true,
  bigger_navbar: true,
  header_btns: false,
  static_aside: true,

  block_images: false,
  block_videos: false,
  rect_avatars: false,
  square_shaped: false,
  now_play_disable: false,
  theme: "purple_dark",
  font: "inter",
};

const browser_cr = chrome ? chrome : browser;

function initStateIfNotExist() {
  browser_cr.storage.local.get("formState", (result) => {
    if (!result.formState || Object.keys(result.formState).length === 0) browser_cr.storage.local.set({ formState: { ...initialState } });
  });
}

initStateIfNotExist();

browser_cr.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.get('welcomePageDisplayed', function (data) {
      if (!data.welcomePageDisplayed && details.reason === 'install') {
        chrome.tabs.create({ url: "https://chesscolibri.pro/welcome-sp" });
        chrome.storage.local.set({ 'welcomePageDisplayed': true });
      } else {
        // chrome.tabs.create({ url: "https://chesscolibri.pro/update-sp" });
      }
    });
  }
});

browser_cr.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScGXGlaC1KUSji5XzrVtB7PpRdoBbmRhoEVig1BPPrUY2ShKg/viewform?usp=sf_link");
