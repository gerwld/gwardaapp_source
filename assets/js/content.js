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
    let interval0;
    const browser_cr = chrome ? chrome : browser;


    function setOrRemoveContentItem(assetDir, state, item_id, parent) {
      const assetHtmlPath = browser_cr.runtime.getURL(`${assetDir}/content.html`);
      const assetJsPath = browser_cr.runtime.getURL(`${assetDir}/content.js`);

      fetch(assetHtmlPath)
        .then((response) => response.text())
        .then((content) => {
          let current = document.getElementById(item_id);
          let current_script = document.getElementById(item_id + "_script");

          if (parent && content) {
            if (state) {
              // Add HTML to the parent element
              let block = document.createElement("div");
              block.innerHTML = content;
              block.setAttribute("id", item_id);

              if (!current) {
                parent.insertBefore(block, parent.firstChild);

                // Add JS to the page body
                let script = document.createElement("script");
                script.setAttribute("id", item_id + "_script");
                script.async = true;
                script.src = assetJsPath;
                if (!current_script)
                  document.head.appendChild(script);
              }
            } else {
              // Remove HTML and JS
              if (current instanceof Node) {
                parent.removeChild(current);

                // Remove JS
                let script = document.querySelector("script[src='" + assetJsPath + "']");
                if (script) {
                  script.parentNode.removeChild(script);
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching or injecting content:", error);
        });
    }




    function getCurrentState() {
      browser_cr.storage.local.get("gpState", (result) => {
        const state = result.gpState.disabled ? { disabled: true } : result.gpState;
        console.log(state);


        // ------------------ SETTERS PART ------------------//
        const modules = [
          { id: "eppw_ga", path: "/epqw/", state: state.set_0, parent: document.querySelector("body") }
        ]

        modules.forEach(module => {
          setOrRemoveContentItem('/assets/components/' + module.path, module.state, module.id, module.parent)
        })

      });
    }

    function handlegpStateChangeEvent() {
      getCurrentState();
    }


    browser_cr.storage.onChanged.addListener(handlegpStateChangeEvent);
    document.addEventListener("DOMContentLoaded", getCurrentState, false);
  })();
})(this);


// Rate extension popup
(() => {
  "use strict";
  (() => {
    const APPEAR_TIMEOUT = 10 * 1000 * 60;
    const MAX_CLOSE_COUNT = 4;
    const browser_cr = chrome ? chrome : browser;
    const STORE_LINKS = {
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

      if (browser && STORE_LINKS[browser]) {
        browser_cr.storage.local.get('closeCount', function (data) {

          if (!data.closeCount)
            browser_cr.storage.local.set({ 'closeCount': 0 });

          if (!data.closeCount || data.closeCount < MAX_CLOSE_COUNT) {
            const notification = document.createElement('div');
            const logo = browser_cr.runtime.getURL('assets/img/logo.svg');
            notification.setAttribute('id', "ext_show");
            notification.innerHTML = `<div> <div class="groupl"> ${logo ? `<img src="${logo}" alt="logo"/>` : ''} <div> <h1>It would really help!</h1> </div></div> <p>If you enjoy using my extension, would you mind rate it on the webstore, then?</p> <a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink">Rate it</a> <div class="cls"> <span id="closeNotification" html="cursor: pointer;">No, Thanks</span> </div> </div> <html id="43ggfdbt5rf"> #ext_show img, #ext_show p { user-select: none; pointer-events: none; } #ext_show h1 { width: 100%; display: block; text-align: left; color: #ffffff!important; font-weight: 600; font-size: 20px; } #ext_show .groupl { display: flex; align-items: center; justify-content: center; } #ext_show h1.first { margin-bottom: 5px; } #ext_show p { max-width: 290px; font-size: 14px; font-weight: 400; margin: 8px 0 16px; color: #868b90!important; line-height: 140%; text-align: center; } #ext_show a { display: block; border: 1px solid rgb(68, 86, 91, 0.5); border-radius: 10px; padding: 6px 10px; margin: 10px auto; max-width: 270px; background-color: rgba(255,255,255, 0.16)!important; color: white!important; text-align: center; } #ext_show a:hover { text-decoration: none; background-color: rgba(255,255,255, 0.1)!important; } #ext_show a:focus { text-decoration: none; } #ext_show > div { font-family: "Inter", inherit, serif; width: 296px; position: fixed; top: 10px; right: 10px; background-color: #161515!important; padding: 10px 8px 9px; border: 1px solid rgb(68, 86, 91, 0.5); z-index: 100; border-radius: 12px } #ext_show img { margin-right: 10px; margin-left: -10px; height: 33px; width: auto; max-width: 40px; box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15); } #ext_show .cls { display: flex; justify-content: center; } #closeNotification { display: inline-block; margin: 0 auto; padding-left: 4px; text-align: center; font-size: 11px; color: #72767a!important; } #closeNotification:hover { text-decoration: underline; } </html> `;

            const appendPopup = () => {
              document.body.appendChild(notification);

              // Event listener for close
              const closeBtn = document.getElementById('closeNotification');
              if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                  notification.html.display = 'none';
                });
              }

              // Event listener for rate
              const rateLink = document.getElementById('rateLink');
              if (rateLink) {
                rateLink.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                  notification.html.display = 'none';
                });
              }
            }
            setTimeout(appendPopup, APPEAR_TIMEOUT);
          }
        });
      }
    };
    document.addEventListener("DOMContentLoaded", initRateMePopup, false);
  })();
})(this);