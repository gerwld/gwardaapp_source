
// Injector for HTML. If arg:state then adds item/s, else clean-up

import observeClassChanges from "./observeClassChages";

export default function injectorHTML(state, item, item_class, parent_selectors, set_bottom, replace) {
  let totalWaitTime = 0;
  function checkParentAndProceed() {
    // ---- CLEAN-UP ---- //
    if (!state) {
      document.querySelectorAll("." + item_class).forEach(e => e.remove());
      return;
    }
    // ---- ELSE INJECT ----- //
    else {
      console.log("gwardaApp: checkParentAndProceed exec.")
      // If parent is root then dont clone node, append & break
      if (parent_selectors === "root") {
        let block = document.createElement("div");
        block.appendChild(item);
        block.setAttribute("class", item_class);
        document.documentElement.appendChild(block)
        return;
      }

      const parents = document.querySelectorAll(parent_selectors);

      // If not found parent repeat for 10000ms, then break execution
      if (!parents && state || Array.isArray(parent_selectors) && parents.length === 0) {
        if (totalWaitTime < 5000) {
          setTimeout(checkParentAndProceed, 1000);
          totalWaitTime += 1000;
        } else {
          console.log("Maximum wait time reached. Exiting...");
        }
        return;
      }

      if (parents && item) {
        // Else append one clone to each parent
        parents.forEach(r => {
          let prev_block = r.parentElement.classList.contains(item_class) ? r.parentElement : r.querySelector('.' + item_class);
          let block = document.createElement("div");
          block.appendChild(item.cloneNode(true));
          block.setAttribute("class", item_class);

          // Check if the stringified and trimmed content is not equal or not exist.
          // Then remove prev and inj new
          if (!prev_block || replace) {
            if (replace && prev_block)
              prev_block.remove()
            if (set_bottom)
              r.appendChild(block);
            else
              r.insertBefore(block, r.firstChild);
          }

        });
      }
    }
  }

  checkParentAndProceed();
  observeClassChanges(parent_selectors, checkParentAndProceed);
}
