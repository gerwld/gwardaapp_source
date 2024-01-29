// // Each Product Quick View Module: JS
// (() => {
//   "use strict";
//   document.addEventListener("DOMContentLoaded", () => {
//     const MODULE_KEY = "set_0"
//     const browser_cr = chrome ? chrome : browser;
//     const logo = document.querySelector(".logo");

//     // LISTENER: Listen for changes in browser_cr.storage.local
//     let prevstate;
//     browser_cr.storage.local.onChanged.addListener((changes) => {
//       if (
//         changes.gpState &&
//         changes.gpState.newValue &&
//         JSON.stringify({ ...changes.gpState.newValue }) !== prevstate
//       ) {
//         prevstate = JSON.stringify({ ...changes.gpState.newValue });
//         initializeUpdate();
//       }
//     });

//     // DISPATCH: Defining a custom event
//     const gpStateChangeEvent = new CustomEvent("gpStateChange");
//     function dispatchStateChangeEvent() {
//       window.dispatchEvent(gpStateChangeEvent);
//     }


//     // UPDATE: Update based on new state
//     function initializeUpdate() {
//       (() => {
//         return new Promise((resolve) => {
//           browser_cr.storage.local.get(null, (result) => {
//             let gpState = result?.gpState ? result?.gpState : {};
//             resolve(gpState);
//           })
//         })
//       })().then((s) => {
//         const state = s.disabled ? { disabled: true } : s;
//         const state_module = state[MODULE_KEY];
//         if (state_module === true) initialize(s)
//         else cleanUp()
//       })
//     }

//     function initialize(state) {

//     }

//     function cleanUp() {

//     }

//     initializeUpdate();

//   })
// })();