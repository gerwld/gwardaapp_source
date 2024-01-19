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

(() => {
  "use strict";
  (() => {

    let interval0, interval1, interval2;
    const browser_cr = chrome ? chrome : browser;
    const fonts = ["roboto", "poppins", "caprasimo", "playfair", "merriweather", "noto_sans", "nunito", "montserrat", "pixelify", "gabarito", "roboto_condensed", "inter"];
    const themes = ["light_green", "purple_dark", "dark_pink", "light_purple", "dark_red", "dark_yellow", "dark_blue", "amoled", "amoled_night"];

    function setTheme(selectedTheme) {
      // Set theme if exists, then delete others
      if (themes.indexOf(selectedTheme) !== -1) {
        setOrRemoveStylesOfItem(`/assets/styles/themes/${selectedTheme}.css`, true, selectedTheme);
      }
      themes.filter((e) => e !== selectedTheme).forEach((theme) => document.getElementById(theme)?.remove());
    }

    function setFont(selectedFont) {
      // Set font if exists, then delete others
      if (fonts.indexOf(selectedFont) !== -1) {
        setOrRemoveStylesOfItem(`/assets/styles/fonts/${selectedFont}.css`, true, selectedFont);
      }
      fonts.filter((e) => e !== selectedFont).forEach((font) => document.getElementById(font)?.remove());
    }

    function setOrRemoveStylesOfItem(assetPath, item, item_id) {
      // Fetch the CSS file and append it
      fetch(browser_cr.runtime.getURL(assetPath))
        .then((response) => response.text())
        .then((css) => {
          let current = document.getElementById(item_id);
          let style = document.createElement("style");
          style.textContent = css;
          style.setAttribute("id", item_id);
          if (item && !current) document.head.appendChild(style);
          else if (!item && current instanceof Node) document.head.removeChild(current);
        }).catch(_ => { });;
    }

    function toggleNowPlayBlock(assetPath, state, localStorageIDs) {
      setOrRemoveStylesOfItem(assetPath, state, "now_play_disable");
      function toggle() {
        localStorageIDs.forEach((localStorageKey) => {
          const current = localStorage.getItem(localStorageKey);
          if (state && current != 0) {
            localStorage.setItem(localStorageKey, 0);
          }
        });
      }

      if (state) interval0 = setInterval(toggle, 700);
      else clearInterval(interval0);
    }

    function toggleStaticAside(assetPath, state) {
      setOrRemoveStylesOfItem(assetPath, state, "static_aside");
      function setStatic() {
        const currentWidth = localStorage.getItem("182yfcl2wcrumva06hlhooydu:ylx-default-state-nav-bar-width");
        const isClosed = localStorage.getItem("182yfcl2wcrumva06hlhooydu:ylx-sidebar-state");
        if ((currentWidth < 400 || isClosed == 1) && state) {
          localStorage.setItem("182yfcl2wcrumva06hlhooydu:library-row-mode", 1);
          localStorage.setItem("182yfcl2wcrumva06hlhooydu:ylx-sidebar-state", 0);
          localStorage.setItem("182yfcl2wcrumva06hlhooydu:ylx-default-state-nav-bar-width", 400);
          window.location.reload();
        }
      }
      if (state) interval1 = setInterval(setStatic, 700);
      else clearInterval(interval1);
    }

    function toggleClassicMode(assetPath, state) {
      setOrRemoveStylesOfItem(assetPath, state, "focus_mode");
      function setClassic() {
        const mode = localStorage.getItem("182yfcl2wcrumva06hlhooydu:library-row-mode");
        if (mode == 0 && state) {
          localStorage.setItem("182yfcl2wcrumva06hlhooydu:library-row-mode", 1);
          window.location.reload();
        }
      }
      if (state) interval2 = setInterval(setClassic, 200);
      else clearInterval(interval2);
    }

    function getCurrentState() {
      browser_cr.storage.local.get("formState", (result) => {
        const state = result.formState.disabled ? { disabled: true } : result.formState;

        //Styles setters
        setOrRemoveStylesOfItem("/assets/styles/header_btns.css", state.header_btns, "header_btns");
        setOrRemoveStylesOfItem("/assets/styles/rect_avatars.css", state.rect_avatars, "rect_avatars");
        setOrRemoveStylesOfItem("/assets/styles/block_images.css", state.block_images, "block_images");
        setOrRemoveStylesOfItem("/assets/styles/block_videos.css", state.block_videos, "block_videos");
        setOrRemoveStylesOfItem("/assets/styles/bigger_navbar.css", state.bigger_navbar, "bigger_navbar");
        toggleNowPlayBlock("/assets/styles/now_play_disable.css", state.now_play_disable, [
          "182yfcl2wcrumva06hlhooydu:ui-panel-state",
          "182yfcl2wcrumva06hlhooydu:ylx-sidebar-state",
        ]);
        toggleStaticAside("/assets/styles/static_aside.css", state.static_aside);
        toggleClassicMode("/assets/styles/focus_mode.css", state.focus_mode);
        setOrRemoveStylesOfItem("/assets/styles/square_shaped.css", state.square_shaped, "square_shaped");
        setTheme(state.theme);
        setFont(state.font);
      });
    }

    function handleFormStateChangeEvent() {
      getCurrentState();
    }


    // Add event listener to the state change
    browser_cr.storage.onChanged.addListener(handleFormStateChangeEvent);

    //Init get state and do delay
    document.addEventListener("DOMContentLoaded", getCurrentState, false);

  })();
})(this);


// ---- Rate extension popup ---- //

(() => {
  "use strict";
  (() => {
    const APPEAR_TIMEOUT = 10 * 1000 * 60;
    const MAX_CLOSE_COUNT = 4;
    const browser_cr = chrome ? chrome : browser;
    const store_links = {
      "chrome": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
      "firefox": "https://addons.mozilla.org/en-US/firefox/addon/GwardaApp/reviews/",
      "edge": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
      "opera": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write"
    }

    function detectBrowser() {
      const agent = navigator.userAgent;
      if (agent.includes("Edg")) return "edge";
      if (agent.includes("OPR")) return "opera";
      if (agent.includes("Chrome")) return "chrome";
      if (agent.includes("Firefox")) return "firefox";

      // Default to Chrome
      return "chrome";
    }

    const initRateMePopup = () => {
      const browser = detectBrowser();

      if (browser && store_links[browser]) {
        browser_cr.storage.local.get('closeCount', function (data) {

          if (!data.closeCount) {
            browser_cr.storage.local.set({ 'closeCount': 0 });
          }

          if (!data.closeCount || data.closeCount < MAX_CLOSE_COUNT) {
            const notification = document.createElement('div');
            const logo = browser_cr.runtime.getURL('assets/img/logo.svg');
            notification.setAttribute('id', "ext_show");
            notification.innerHTML = `<div> <div class="groupl"> ${logo ? `<img src="${logo}" alt="logo"/>` : ''} <div> <h1>It would really help!</h1> </div></div> <p>If you enjoy using my extension, would you mind rate it on the webstore, then?</p> <a href="${store_links[browser]}" target="_blank" id="rateLink">Rate it</a> <div class="cls"> <span id="closeNotification" style="cursor: pointer;">No, Thanks</span> </div> </div> <style id="43ggfdbt5rf"> #ext_show img, #ext_show p { user-select: none; pointer-events: none; } #ext_show h1 { width: 100%; display: block; text-align: left; color: #ffffff!important; font-weight: 600; font-size: 20px; } #ext_show .groupl { display: flex; align-items: center; justify-content: center; } #ext_show h1.first { margin-bottom: 5px; } #ext_show p { max-width: 290px; font-size: 14px; font-weight: 400; margin: 8px 0 16px; color: #868b90!important; line-height: 140%; text-align: center; } #ext_show a { display: block; border: 1px solid rgb(68, 86, 91, 0.5); border-radius: 10px; padding: 6px 10px; margin: 10px auto; max-width: 270px; background-color: rgba(255,255,255, 0.16)!important; color: white!important; text-align: center; } #ext_show a:hover { text-decoration: none; background-color: rgba(255,255,255, 0.1)!important; } #ext_show a:focus { text-decoration: none; } #ext_show > div { font-family: "Inter", inherit, serif; width: 296px; position: fixed; top: 10px; right: 10px; background-color: #161515!important; padding: 10px 8px 9px; border: 1px solid rgb(68, 86, 91, 0.5); z-index: 100; border-radius: 12px } #ext_show img { margin-right: 10px; margin-left: -10px; height: 33px; width: auto; max-width: 40px; box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15); } #ext_show .cls { display: flex; justify-content: center; } #closeNotification { display: inline-block; margin: 0 auto; padding-left: 4px; text-align: center; font-size: 11px; color: #72767a!important; } #closeNotification:hover { text-decoration: underline; } </style> `;

            const appendPopup = () => {
              // Check if tab is active or Visibility API is not supported, if so - append popup
              // if (!document?.visibilityState || (document?.visibilityState === "visible")) {

              // Append the notification to the body
              document.body.appendChild(notification);

              // Event listener to the close button
              const closeBtn = document.getElementById('closeNotification');
              if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                  notification.style.display = 'none';
                });
              }

              // Event listener to the rate link
              const rateLink = document.getElementById('rateLink');
              if (rateLink) {
                rateLink.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                  notification.style.display = 'none';
                });
              }

              // }
            }
            setTimeout(appendPopup, APPEAR_TIMEOUT);
          }
        });
      }
    };
    //Init get state and do delay
    document.addEventListener("DOMContentLoaded", initRateMePopup, false);
  })();
})(this);