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

    async function setOrRemoveContentItem(assetDir, state, item_class, parentSelector, setDown) {
      const assetHtmlPath = browser_cr.runtime.getURL(`${assetDir}/index.html`);
      const assetJsPath = browser_cr.runtime.getURL(`${assetDir}/index.js`);


      function injectScript() {
        const isScriptExist = document.getElementById(item_class + "_script");
        if (!isScriptExist) {
          // Add JS to the page body
          let script = document.createElement("script");
          script.setAttribute("id", item_class + "_script");
          script.async = true;
          script.defer = false;
          script.src = assetJsPath;
          document.head.appendChild(script);
        }
      }

      async function fetchHTML() {
        console.warn("gwardaApp: fetchHTML exec.")
        return fetch(assetHtmlPath)
          .then((response) => response.text()).then(e => e)
          .catch((error) =>
            console.error("gwardaApp: Error fetching or injecting content:", error)
          );
      }


      let content;
      let totalWaitTime = 0;
      if (state)
        content = await fetchHTML();

      function checkParentAndProceed() {
        if (!state) {
          document.querySelectorAll("." + item_class).forEach(e => e.remove());
          document.querySelectorAll(`script[src="${assetJsPath}"]`).forEach(e => e.remove());
          return;
        }
        else {
          console.warn("gwardaApp: checkParentAndProceed exec.")
          // - else inject script and find parent / parents
          injectScript();
          let parent;
          if (parentSelector && Array.isArray(parentSelector)) {
            let selectedElements = [];
            parentSelector.forEach(selector => {
              let elements = document.querySelectorAll(selector);
              selectedElements = selectedElements.concat(Array.from(elements));
            });
            parent = selectedElements;
          }
          else
            parent = document.querySelector(parentSelector)


          // Repeat for 3000ms (6 times) if not found parent, then break execution
          if (!parent && state || Array.isArray(parentSelector) && parent.length === 0) {
            if (totalWaitTime < 3000) {
              setTimeout(checkParentAndProceed, 500);
              totalWaitTime += 500;
            } else {
              console.log("Maximum wait time reached. Exiting...");
            }
            return;
          }

          // Parent found, proceed injection
          if (parent && content) {
            // Add HTML to the parent element
            if (content) {
              // - If multiple parents
              if (Array.isArray(parentSelector)) {
                parent.forEach(r => {
                  if (!r.querySelector("." + item_class)) {
                    let block = document.createElement("div");
                    block.innerHTML = content;
                    block.setAttribute("class", item_class);
                    if (setDown)
                      r.appendChild(block);
                    else
                      r.insertBefore(block, r.firstChild)
                  }
                })
              }
              // - If single one
              else {
                if (!parent.querySelector("." + item_class)) {
                  let block = document.createElement("div");
                  block.innerHTML = content;
                  block.setAttribute("class", item_class);
                  if (setDown)
                    parent.appendChild(block);
                  else
                    parent.insertBefore(block, parent.firstChild)
                }
              }
            }
          }


        }
      }

      // Entry point
      checkParentAndProceed()
      observeClassChanges(parentSelector[0], checkParentAndProceed)
      document.addEventListener("DOMContentLoaded", observeClassChanges, false);
    }


    function setOrRemoveStylesOfItemLocal(css, item, item_class) {
      let current = document.getElementById(item_class);
      let style = document.createElement("style");
      style.textContent = css;
      style.setAttribute("id", item_class);
      if (item && !current) document.head.appendChild(style);
      else if (!item && current instanceof Node) document.head.removeChild(current);
    }

    function observeClassChanges(parentClass, callback) {
      if (parentClass[0] !== "#") {
        let current = document.querySelector(parentClass);
        if (current.length) {
          const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll(parentClass);
            if (newElements.length !== current.length || !Array.from(newElements).every((element, index) => element === current[index])) {
              callback();
              current = newElements;
            }
          });
          observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
        return observer;
      }
    }

    function getCurrentState() {
      browser_cr.storage.local.get("gpState", (result) => {
        const state = result.gpState.disabled ? { disabled: true } : result.gpState;

        (function appendOverlay(state) {
          const find = document?.querySelectorAll("#gw__overlay");
          const logo_url = browser_cr.runtime.getURL('assets/img/logo.svg');
          if (state && find?.length === 0 && logo_url) {
            const ov_content = `<div><button id="gw__overlay-button"><span>GwardaApp</span><img src="${logo_url}"></button><style>#gw__overlay {z-index: 9999999;position: fixed;bottom: 10vh;right: 0; width: 115px;background: #353c40;  background: rgb(53, 60, 64, 0.8); font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",  "Helvetica Neue", sans-serif;border-top-left-radius: 14px;border-bottom-left-radius: 14px;cursor: pointer;font-size: 12px;}#gw__overlay-button {display: flex;align-items: center;justify-content: flex-end;flex-direction: row-reverse;height: 40px;transition: opacity 100ms ease;}#gw__overlay img,#gw__overlay span {pointer-events: none;user-select: none;}#gw__overlay span {margin-right: 5px;}#gw__overlay img {width: 34px;height: 34px;margin: 4px;}#gw__overlay-button:hover {opacity: 0.8;}#gw__overlay-button {color: #fff;background: none;border: none;padding: 0;cursor: pointer;} </style></div>`;
            const ov = document.createElement('div');
            ov.setAttribute('id', "gw__overlay");
            ov.innerHTML = ov_content;
            document.documentElement.appendChild(ov);

            document.getElementById('gw__overlay-button')?.addEventListener('click', () =>
              browser_cr.runtime.sendMessage({ openPreferences: true }))

            const port = browser_cr.runtime.connect({ name: 'content-script' });
            document.getElementById('gw__overlay-button').addEventListener('click', () => {
              port.postMessage({ openPreferences: true });
            });
          } else if (!state) {
            find?.forEach(e => e.remove());
          }
        })(!state.disabled);



        // ------------------ SETTERS PART ------------------//
        const modules = [
          { className: "eppw_3a554ac1-e810-4e95-93b4-b27d3ad02d49_ga", path: "/quick_view/", state: state.quick_view, parentSelector: ['div[data-component-type="s-search-result"] .a-section.a-spacing-base'], setDown: true },
          { className: "stock_status_abc71734-a087-49b8-bc19-86a3cbc280d7_ga", path: "/stock_status/", state: state.stock_status, parentSelector: [".a-box-group"], setDown: true },
          { className: "lqs_abc71734-a087-49b8-bc49-86a3уbc280d7_ga", path: "/lqs/", state: state.lqs, parentSelector: "#productTitle" },
        ]

        modules.forEach(module => {
          setOrRemoveContentItem('/assets/models/' + module.path, module.state, module.className, module.parentSelector, module.setDown)
        })

      });
    }

    function handlegpStateChangeEvent() {
      getCurrentState();
    }

    function contentLoaded() {
      // getCurrentState();
      setTimeout(() =>
        setOrRemoveStylesOfItemLocal(`.appear_anim {animation: none !important;}`, true, "hideanim_l3_appear"), 800)
    }

    getCurrentState();
    browser_cr.storage.onChanged.addListener(handlegpStateChangeEvent);
    document.addEventListener("DOMContentLoaded", contentLoaded, false);
  })();
})(this);


// Rate extension popup
(() => {
  "use strict";
  (() => {
    const APPEAR_TIMEOUT = 10 * 1000 * 600;
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
            notification.innerHTML = `<div> <div class="groupl"> ${logo ? `<img src="${logo}" alt="logo"/>` : ''} <div> <h1>It would really help.</h1> </div></div> <p>If you enjoy using this extension, would you mind rate it on the webstore, then?</p> <a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink">Rate it</a> <div class="cls"> <span id="closeNotification" style="cursor: pointer;">No, Thanks</span> </div> </div> <style id="43ggfdbt5rf"> #ext_show img, #ext_show p { user-select: none; pointer-events: none; } #ext_show h1 { width: 100%; display: block; text-align: left; color: #ffffff!important; font-weight: 600; font-weight: 500; font-size: 21px; line-height: 21px; margin:0; } #ext_show .groupl { display: flex; align-items: center; justify-content: center; margin: 10px 0; } #ext_show h1.first { margin-bottom: 5px; } #ext_show p { max-width: 290px; font-size: 14px; font-size: 12.8px; font-weight: 400; margin: 8px 0 16px; color: #868b90!important; line-height: 140%; text-align: center; } #ext_show a { text-decoration: none!important; display: block; border: 1px solid rgb(68, 86, 91, 0.5); border-radius: 22px; padding: 7px 10px; margin: 10px auto; max-width: 270px; background-color: rgba(255,255,255, 0.16)!important; color: white!important; text-align: center; } #ext_show a:hover { text-decoration: none; background-color: rgba(255,255,255, 0.1)!important; } #ext_show a:focus { text-decoration: none; } #ext_show > div { transform: scale(0.92);  box-shadow: rgba(149, 157, 165, 1) 0px 8px 24px; z-index: 100000!important;   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; width: 296px; position: fixed; top: 10px; right: 10px; background-color: #161515!important; background-color: rgb(22, 21, 21, 0.96)!important; padding: 5px 12px 15px; box-sizing: border-box; border: 1px solid rgb(68, 86, 91, 0.5); z-index: 100; border-radius: 12px } #ext_show img { margin-right: 10px; margin-left: -10px; height: 33px; width: auto; max-width: 40px; box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15); } #ext_show .cls { display: flex; justify-content: center; } #closeNotification { display: inline-block; margin: 0 auto; padding-left: 4px; text-align: center; font-size: 11px; font-size: 10.5px; color: #72767a!important; } #closeNotification:hover { text-decoration: underline; } </style> `;

            const appendPopup = () => {
              document.body.appendChild(notification);

              // Event listener for close
              const closeBtn = document.getElementById('closeNotification');
              if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                  notification.style.display = 'none';
                });
              }

              // Event listener for rate
              const rateLink = document.getElementById('rateLink');
              if (rateLink) {
                rateLink.addEventListener('click', function () {
                  browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                  notification.style.display = 'none';
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

