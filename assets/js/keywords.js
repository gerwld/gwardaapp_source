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

    function setOrRemoveContentItem(assetDir, state, item_id, parentSelector) {
      const assetHtmlPath = browser_cr.runtime.getURL(`${assetDir}/index.html`);
      const assetJsPath = browser_cr.runtime.getURL(`${assetDir}/index.js`);


      function injectScript() {
        const isScriptExist = document.getElementById(item_id + "_script");
        if (!isScriptExist) {
          // Add JS to the page body
          let script = document.createElement("script");
          script.setAttribute("id", item_id + "_script");
          script.async = true;
          script.defer = false;
          script.src = assetJsPath;
          document.head.appendChild(script);
        }
      }

      function checkParentAndProceed() {
        const parent = document.querySelector(parentSelector);

        // Regardless of whether the parent is found or not, inject the script
        injectScript();

        if (!parent && state) {
          // Parent not found, wait for 100ms and check again
          setTimeout(checkParentAndProceed, 100);
          return;
        }

        // Parent found, proceed with the original logic
        fetch(assetHtmlPath)
          .then((response) => response.text())
          .then((content) => {
            let current = document.getElementById(item_id);

            if (parent && content) {
              if (state) {
                let block = document.createElement("div");
                block.innerHTML = content;
                block.setAttribute("id", item_id);

                // Add HTML to the parent element
                if (!current)
                  parent.insertBefore(block, parent.firstChild);
                // Add JS to the page (condition checks inside of it)
                injectScript();
              }
              else {
                // Remove HTML
                if (current instanceof Node)
                  parent.removeChild(current);

                // Remove JS 
                // (forEach if it somehow was added multiple times)
                let script = document.querySelectorAll("script[src='" + assetJsPath + "']");
                script?.forEach(e =>
                  e.parentNode.removeChild(e)
                )
              }
            }
          })
          .catch((error) =>
            console.error("gwardaApp: Error fetching or injecting content:", error)
          );
      }

      // Start the checking process
      checkParentAndProceed();
    }

    function setOrRemoveStylesOfItemLocal(css, item, item_id) {
      let current = document.getElementById(item_id);
      let style = document.createElement("style");
      style.textContent = css;
      style.setAttribute("id", item_id);
      if (item && !current) document.head.appendChild(style);
      else if (!item && current instanceof Node) document.head.removeChild(current);
    }

    function getCurrentState() {
      browser_cr.storage.local.get("gpState", (result) => {
        const state = result.gpState.disabled ? { disabled: true } : result.gpState;
        console.log(state);


        // ------------------ SETTERS PART ------------------//
        const modules = [
          { id: "eppw_ga", dir: "epqw", state: state.set_0, parentSelector: "body" }
        ]

        modules.forEach(module => {
          setOrRemoveContentItem('/assets/models/' + module.dir, module.state, module.id, module.parentSelector)
        })

      });
    }

    function handlegpStateChangeEvent() {
      getCurrentState();
    }

    function contentLoaded() {
      getCurrentState();
      setTimeout(() =>
        setOrRemoveStylesOfItemLocal(`.appear_anim {animation: none !important;}`, true, "hideanim_l3_appear"), 800)
    }

    getCurrentState();
    browser_cr.storage.onChanged.addListener(handlegpStateChangeEvent);
    document.addEventListener("DOMContentLoaded", contentLoaded, false);
  })();
})(this);
