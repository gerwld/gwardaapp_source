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
