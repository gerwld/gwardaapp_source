import moduleKeywords from "./modules/moduleKeywords";
import moduleLQS from "./modules/moduleLQS";
import moduleOverlay from "./modules/moduleOverlay";
import moduleQuick from "./modules/moduleQuick";
import moduleRate from "./modules/moduleRate";
import moduleStocks from "./modules/moduleStocks";

console.log(`%c gwardaApp v.0.9.5 beta `, 'background: gray; color: yellow');
const browser_cr = chrome ? chrome : browser;

function getCurrentState() {
  browser_cr.storage.local.get(null, (result) => {
    let state;
    if (result.cookies_gal20 !== true) {
      state = { disabled: true }
    }
    else {
      state = result.gpState.disabled ? { disabled: true } : result.gpState;
    }

    // ------------------ SETTERS PART ------------------//

    if (!state.disabled && state) {
      moduleQuick(state.quick_view)
      moduleOverlay(!state.disabled)
      moduleRate(!state.disabled)
      moduleKeywords(state.gn_keywords)
      moduleLQS(state.lqs)
      moduleStocks(state.stock_status)
    }

    console.warn('gwardaApp: getCurrentState exec.');
  });
}

function initializeUpdate() {
  getCurrentState();
}
initializeUpdate();
// LISTENER: Listen for changes in local state with debounce
let prevstate;
browser_cr.storage.local.onChanged.addListener((changes) => {
  let swop_prevstate = JSON.stringify({ ...changes?.gpState?.newValue }).replace(/\s/g, '');
  if (changes?.gpState?.newValue && swop_prevstate !== prevstate) {
    console.warn("gwardaApp: ls change");
    prevstate = swop_prevstate;
    initializeUpdate();
  }
});



// async function setOrRemoveContentItem(assetDir, state, item_class, parentSelector, setDown) {

//   const assetHtmlPath = browser_cr.runtime.getURL(`${assetDir}/index.html`);
//   const assetJsPath = browser_cr.runtime.getURL(`${assetDir}/index.js`);


//   function injectScript() {
//     const isScriptExist = document.getElementById(item_class + "_script");
//     if (!isScriptExist) {
//       // Add JS to the page body
//       let script = document.createElement("script");
//       script.setAttribute("id", item_class + "_script");
//       script.async = true;
//       script.defer = false;
//       script.src = assetJsPath;
//       document.head.appendChild(script);
//     }
//   }

//   async function fetchHTML() {
//     console.warn("gwardaApp: fetchHTML exec.")
//     return fetch(assetHtmlPath)
//       .then((response) => response.text()).then(e => e)
//       .catch((error) =>
//         console.error("gwardaApp: Error fetching or injecting content:", error)
//       );
//   }


//   let content;
//   let totalWaitTime = 0;
//   if (state)
//     content = await fetchHTML();

//   function checkParentAndProceed() {
//     if (!state) {
//       document.querySelectorAll("." + item_class).forEach(e => e.remove());
//       document.querySelectorAll(`script[src="${assetJsPath}"]`).forEach(e => e.remove());
//       return;
//     }
//     else {
//       console.warn("gwardaApp: checkParentAndProceed exec.")
//       // - else inject script and find parent / parents
//       injectScript();
//       let parent;
//       if (parentSelector && Array.isArray(parentSelector)) {
//         let selectedElements = [];
//         parentSelector.forEach(selector => {
//           let elements = document.querySelectorAll(selector);
//           selectedElements = selectedElements.concat(Array.from(elements));
//         });
//         parent = selectedElements;
//       }
//       else
//         parent = document.querySelector(parentSelector)


//       // Repeat for 3000ms (6 times) if not found parent, then break execution
//       if (!parent && state || Array.isArray(parentSelector) && parent.length === 0) {
//         if (totalWaitTime < 8000) {
//           setTimeout(checkParentAndProceed, 200);
//           totalWaitTime += 200;
//         } else {
//           console.log("Maximum wait time reached. Exiting...");
//         }
//         return;
//       }

//       // Parent found, proceed injection
//       if (parent && content) {
//         // Add HTML to the parent element
//         if (content) {
//           // - If multiple parents
//           if (Array.isArray(parentSelector)) {
//             parent.forEach(r => {
//               if (!r.querySelector("." + item_class)) {
//                 let block = document.createElement("div");
//                 block.innerHTML = content;
//                 block.setAttribute("class", item_class);
//                 if (setDown)
//                   r.appendChild(block);
//                 else
//                   r.insertBefore(block, r.firstChild)
//               }
//             })
//           }
//           // - If single one
//           else {
//             if (!parent.querySelector("." + item_class)) {
//               let block = document.createElement("div");
//               block.innerHTML = content;
//               block.setAttribute("class", item_class);
//               if (setDown)
//                 parent.appendChild(block);
//               else
//                 parent.insertBefore(block, parent.firstChild)
//             }
//           }
//         }
//       }
//     }
//   }

//   // Entry point
//   // - at the beginning
//   checkParentAndProceed()
//   // - observer (sometimes buggy but more efficient timeout)
//   observeClassChanges(parentSelector, checkParentAndProceed)
// }