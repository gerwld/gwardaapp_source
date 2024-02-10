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



// Preferences Part
(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const browser_cr = chrome ? chrome : browser;
      const container = document.getElementById('settings')

      // LISTENER: Listen for changes in local state with debounce
      let prevstate;
      let updateScheduled = false;
      browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
        let newState;
        if (changes?.gpState?.newValue) {
          newState = JSON.stringify({ ...changes?.gpState?.newValue || {} })
        }
        if (
          !changes.gpState?.newValue ||
          changes.gpState.newValue &&
          newState !== prevstate
        ) {
          prevstate = newState;
          if (!updateScheduled) {
            updateScheduled = true;
            setTimeout(() => {
              updateScheduled = false;
              initializeUpdate();
            }, 30);
          }
        }
      });


      // DISPATCH: Defining a custom event
      const gpStateChangeEvent = new CustomEvent("gpStateChange");
      function dispatchStateChangeEvent() {
        window.dispatchEvent(gpStateChangeEvent);
      }

      // UPDATE: Update based on new state
      function initializeUpdate() {
        console.log("gwardaApp: initializeUpdate call");
        const eventListeners = [];
        (() => {
          return new Promise((resolve) => {
            browser_cr.storage.local.get("gpState", (result) => {
              browser_cr.storage.sync.get("cookies_gal20", (syncres) => {

                let gpState;
                if (syncres.cookies_gal20 !== true) {
                  gpState = { ...result.gpState, disabled: true }
                }
                else {
                  gpState = result.gpState;
                }

                resolve(gpState);
              })
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
            browser_cr.storage.local.get("gpState", (gs) => {
              let prevSt = gs?.gpState ?? {};
              browser_cr.storage.local.set({ "gpState": { ...prevSt, ...state } }, dispatchStateChangeEvent);
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

          removeEventListeners();

          // Add event listener to each input and update the state
          const inputs = container?.querySelectorAll("input, select");
          inputs?.forEach((input) => {
            let listener;
            if (input.type === "checkbox") {
              listener = { type: "change", listener: updateState };
            } else {
              listener = { type: "input", listener: updateState };
            }
            eventListeners.push({ target: input, listener });
            input.addEventListener(listener.type, listener.listener);
          });

          function removeEventListeners() {
            eventListeners.forEach(({ target, listener }) => {
              target.removeEventListener(listener.type, listener.listener);
            });
            eventListeners.length = 0;
          }



          // Initialize the form inputs based on the state
          if (state) {
            updateFormInputs();
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
    browser_cr.storage.sync.get("cookies_gal20", (data) => {
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
            browser_cr.storage.sync.set({ "cookies_gal20": true })
            browser_cr.storage.local.get("gpState", (result) => {
              if (result.gpState) {
                browser_cr.storage.local.set({ "gpState": { ...result.gpState, disabled: false } });
              }
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
