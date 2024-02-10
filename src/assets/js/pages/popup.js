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
    document.addEventListener("DOMContentLoaded", () => {
      const browser_cr = chrome ? chrome : browser;
      const lang_set = document.getElementById("lang_set");

      // Listen for changes in gpState
      let prevstate;
      browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
        if (
          changes.gpState &&
          changes.gpState.newValue &&
          JSON.stringify({ ...changes.gpState.newValue }) !== prevstate
        ) {
          prevstate = JSON.stringify({ ...changes.gpState.newValue });
          initializeUpdate();
        }
      });


      // Listen for changes in cookies_gal20
      let prevstateCookies;
      browser_cr.storage.sync.onChanged.addListener((changes, namespace) => {
        if (
          changes.cookies_gal20 &&
          changes.cookies_gal20.newValue &&
          JSON.stringify({ ...changes.cookies_gal20.newValue }) !== prevstateCookies
        ) {
          prevstateCookies = JSON.stringify({ ...changes.cookies_gal20.newValue });
          initializeCookies(prevstateCookies);
        }
      });


      function initializeCookies(updated) {
        browser_cr.storage.sync.get("cookies_gal20", (result) => {
          let state = result?.cookies_gal20;
          if (state !== true) {
            console.log("initializeCookies msg");
            let toggle_disable = document.querySelector('[data-action="disabled"]');
            if (!toggle_disable) {
              setTimeout(initializeCookies, 20);
              return;
            }
            else {
              document.querySelector("footer").remove();
              toggle_disable?.parentElement?.removeChild(toggle_disable);
              toggle_disable?.remove();
              if (toggle_disable?.innerHTML) {
                toggle_disable.innerHTML = '';
              }
            }

            document.querySelector("section.content").innerHTML = `
<h1 class="initializeCookies__title">Click settings option down below to begin:</h1>
<ul class="glb_menu_l2 glb_menu_l2__accept" style="flex: 1; min-height: 80px;">
<li><a href="./preferences.html" target="_blank" data-attr="smart-link">
<i class="ic">
  <svg version="1.1"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 22 23.3" style="enable-background:new 0 0 22 23.3;" xml:space="preserve">
    <g>
      <g>
        <path style="fill:#BDC0CB;"
          d="M19.9,11.8l1.8-3.2c0.1-0.2,0.1-0.4,0.1-0.7c-0.4-1.3-1.2-2.5-2.2-3.7c-0.1-0.2-0.4-0.3-0.6-0.3
      h-3.8l-1.8-3.2c-0.1-0.3-0.4-0.4-0.6-0.4c-1.1-0.2-2.3-0.2-3.4,0c-0.2,0-0.5,0.2-0.6,0.4L6.9,3.9H3.1C2.9,3.9,2.7,4,2.5,4.2
      C1.4,5.4,0.6,6.7,0.2,8c0,0.2,0,0.4,0.1,0.6l1.8,3.1l-1.7,3c-0.1,0.1-0.1,0.3-0.1,0.4c0,0.1,0,0.2,0,0.3C0.8,16.9,1.6,18,2.5,19
      c0.1,0.2,0.4,0.3,0.6,0.3h3.8l1.8,3.2C8.8,22.8,9.1,23,9.4,23c0.5,0.1,1.1,0.1,1.6,0.1l0.2,0c0.5,0,1,0,1.4-0.1
      c0.3,0,0.5-0.2,0.6-0.5l1.9-3.3H19c0.2,0,0.4-0.1,0.6-0.3c0.8-0.9,1.7-2,2.2-3.4c0.1-0.2,0.1-0.5,0-0.7L19.9,11.8z M20.3,15.5
      c-0.4,0.9-1,1.7-1.6,2.3l-0.1,0.1h-4c-0.2,0-0.4,0.1-0.5,0.3l-2,3.5l-0.1,0c-0.3,0-0.7,0.1-1,0.1c-0.4,0-0.7,0-1-0.1l-0.1,0
      l-2-3.5c-0.1-0.2-0.3-0.3-0.5-0.3h-4l-0.1-0.1c-0.6-0.7-1.2-1.5-1.6-2.5l0-0.1l1.8-3.2c0.1-0.2,0.1-0.4,0-0.6L1.6,8.2l0-0.1
      C2,7.2,2.5,6.3,3.3,5.4l0.1-0.1h4c0.2,0,0.4-0.1,0.5-0.3l1.9-3.3l0.1,0c0.7-0.1,1.5-0.1,2.3,0l0.1,0L14.2,5
      c0.1,0.2,0.3,0.3,0.5,0.3h4l0.1,0.1C19.5,6.3,20,7.1,20.4,8l0,0.1l-2,3.4c-0.1,0.2-0.1,0.4,0,0.5l1.9,3.3L20.3,15.5z" />
      </g>
    </g>
    <path style="fill:#BDC0CB;" d="M11,6.6c-2.8,0-5.1,2.3-5.1,5.1c0,2.8,2.3,5.1,5.1,5.1s5.1-2.3,5.1-5.1C16.1,8.9,13.8,6.6,11,6.6z
  M11,15.5c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8s3.8,1.7,3.8,3.8C14.8,13.8,13.1,15.5,11,15.5z" />
  </svg>
</i>
<span>Open Preferences</span></a></li>
<ul>`;

          }
          else if (updated) {
            console.log("initializeCookies reload");
            location.reload()
          }
        })
      }
      initializeCookies()


      function initializeUpdate() {
        browser_cr.storage.local.get("gpState", (result) => {
          let state = result.gpState ? result.gpState : {};

          // Function to update form inputs based on the state object
          function updateFormInputs() {
            const inputs = document.querySelectorAll("input, select")
            if (inputs)
              for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                if (input.type === "checkbox") {
                  input.checked = state[input.name] || false;
                } else {
                  input.value = state[input.name] || "";
                }
              }
            if (lang_set && state['lang_set'])
              lang_set.value = state['lang_set']
          }

          // Initialize the form inputs based on the state
          updateFormInputs();
        });
      }

      initializeUpdate();
    });
  })();
})();
