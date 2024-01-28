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
      const container = document.getElementById("l3_settings");
      const main_nav = document.getElementById("header_nav");
      const lang_set = document.getElementById("lang_set");

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
      }

      function initializeUpdate() {
        console.log("re-render popup");
        // Retrieve state from extension storage or use the initial state
        browser_cr.storage.local.get("gpState", (result) => {
          let state = result.gpState ? result.gpState : {};

          if (!result.gpState) {
            browser_cr.storage.local.set({ gpState: state }, () => {
              dispatchStateChangeEvent();
            });
          }

          // Function to update the state object and form inputs
          function updateState(event) {
            const input = event.target;
            const value = input.type === "checkbox" ? input.checked : input.value;
            state[input.name] = value;

            // Save the updated state to extension storage
            browser_cr.storage.local.set({ gpState: state }, () => {
              dispatchStateChangeEvent();
            });
          }

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

          //Function to update menu state
          function updateMenuState(e) {
            let action = e.target.getAttribute("data-action");
            if (action)
              state[action] = !state[action];
            browser_cr.storage.local.set({ gpState: state }, () => {
              dispatchStateChangeEvent();
            });
          }

          //Function to update lang state
          function updateLangState(e) {
            state["lang_set"] = e.target.value || "en";
            console.log(e.target.value);
            // Save the updated state to extension storage
            browser_cr.storage.local.set({ gpState: state }, () => {
              dispatchStateChangeEvent();
            });
          }

          // Function to update menu classes based on the state object
          function updateHTMLBase() {
            //dark mode
            if (state["dark_mode"]) document.documentElement.classList.add("dark_mode");
            else document.documentElement.classList.remove("dark_mode");
            //disable or enable plugin
            if (state["disabled"]) document.body.classList.add("disabled");
            else document.body.classList.remove("disabled");
          }

          // Add event listener to each input and update the state
          const inputs = container?.querySelectorAll("input, select");
          inputs?.forEach((input) => {
            if (input.type === "checkbox") {
              input.addEventListener("change", updateState);
            } else input.addEventListener("input", updateState);
          });

          //Add event listener to header nav & lang change
          main_nav.addEventListener("click", updateMenuState);
          lang_set.addEventListener("change", updateLangState);

          // Initialize the form inputs based on the state
          updateFormInputs();
          updateHTMLBase();
        });
      }

      initializeUpdate();
    });
  })();
})();
