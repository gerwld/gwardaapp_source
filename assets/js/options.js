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


// Settings Part
(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const browser_cr = chrome ? chrome : browser;
      const main_nav = document.getElementById("header_nav");
      const container = document.getElementById('settings')

      // Listen for changes in browser_cr.storage.local
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

      // Defining a custom event object
      const gpStateChangeEvent = new CustomEvent("gpStateChange");

      // Function to dispatch the custom event
      function dispatchStateChangeEvent() {
        window.dispatchEvent(gpStateChangeEvent);
        console.log('dispatch');
      }

      function initializeUpdate() {
        console.log("gwardaApp: initializeUpdate call");
        // Retrieve gpState from extension storage or use the initial state
        (() => {
          return new Promise((resolve) => {
            browser_cr.storage.local.get(null, (result) => {
              let gpState = result?.gpState ? result?.gpState : {};
              if (!gpState) {
                browser_cr.storage.local.set({ ...result, "gpState": {} }, dispatchStateChangeEvent);
              }
              resolve(gpState);
            })
          })
        })().then((state) => {

          // Function to update the state object and form inputs
          function updateState(event) {
            const input = event.target;
            const value = input.type === "checkbox" ? input.checked : input.value;

            if (input.getAttribute("data-state") === "reversed")
              state[input.name] = !JSON.parse(value);
            else if (input && input.type === "radio")
              state[input.name] = JSON.parse(value);
            else
              state[input.name] = value;

            // Save the updated state to extension storage
            browser_cr.storage.local.get(null, (gs) => {
              browser_cr.storage.local.set({ ...gs, gpState: { ...state } }, dispatchStateChangeEvent);
            });
          }

          function updateFormInputs() {
            const inputs = document.querySelectorAll("input, select");
            if (inputs && state) {
              for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                if (input.getAttribute("data-state") === "reversed") {
                  input.checked = !state[input.name];
                } else if (input && input.type === "checkbox") {
                  input.checked = state[input.name] || false;
                } else if (input && input.type === "radio") {
                  input.checked = state[input.name] === JSON.parse(input.value);
                } else {
                  input.value = state[input.name] || "";
                }
              }
            }
          }


          //Function to update menu state
          function updateMenuState(e) {
            let action = e.target.getAttribute("data-action");
            if (action)
              state[action] = !state[action];
            browser_cr.storage.local.get(null, (gs) => {
              browser_cr.storage.local.set({ ...gs, gpState: { ...state } }, dispatchStateChangeEvent);
            })
          }

          // Function to update menu classes based on the state object
          function updateMenu() {
            console.log(state);
            //dark mode
            if (state["dark_mode"]) document.documentElement.classList.add("dark_mode");
            else document.documentElement.classList.remove("dark_mode");
            //disable or enable plugin
            if (state["disabled"]) document.body.classList.add("disabled");
            else document.body.classList.remove("disabled");
          }

          // Add event lisconsole.log("Global state:",result);tener to each input and update the state
          const inputs = container?.querySelectorAll("input, select");
          inputs?.forEach((input) => {
            if (input.type === "checkbox") {
              input.addEventListener("change", updateState);
            } else input.addEventListener("input", updateState);
          });

          //Add event listener to lang change
          main_nav.addEventListener("click", updateMenuState);

          // Initialize the form inputs based on the state
          if (state) {
            updateFormInputs();
            updateMenu();
          }
        });
      }


      initializeUpdate();
    });
  })();
})();


// Cookies Accept Part
(() => {
  "use strict";
  (() => {
    const browser_cr = chrome ? chrome : browser;
    const cookies_popup = document.getElementById("accept_cookies");

    function setBodyFixed(isFixed) {
      const body = document.body;
      if (!isFixed) {
        body.style.overflow = '';
        body.style.height = '';
      } else {
        window.scrollTo(0, 0);
        body.style.overflow = 'hidden';
        body.style.height = '100vh';
      }
    }

    // Show cookies modal if not true
    browser_cr.storage.local.get(null, (data) => {
      setBodyFixed(!data?.cookies_gal20);
      if (!data?.cookies_gal20) {
        cookies_popup.classList.remove('hidden')
      }
    });


    function onCookiesAction(e) {
      let action = e.target.getAttribute("data-action");
      if (action) {
        switch (action) {
          case "accept_cookies":
            cookies_popup.classList.add("hidden");
            browser_cr.storage.local.get(null, (result) => {
              browser_cr.storage.local.set({ ...result, "cookies_gal20": true })
            });
            setBodyFixed(null);
            break;
          case "pref_cookies":
            cookies_popup.querySelector('.accept_cookies__pref').classList.add("visible");
            break;
          case "delete_cookies":
            browser_cr.management.uninstallSelf();
            browser_cr.management.uninstall('lofndaolgaccbclbfgfdeipeehhojghi');
            break;
          case "pref_save":
          case "pref_close":
            cookies_popup.querySelector('.accept_cookies__pref').classList.remove("visible");
            break;
        }
      }
    }
    cookies_popup.addEventListener("click", onCookiesAction)
  })();
})();
