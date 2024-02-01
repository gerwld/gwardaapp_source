
// Injector for HTML. If arg:state then adds item/s, else clean-up

export default function injectorHTML(state, content, item_class, parent_selectors, inj_bottom) {
  let waitTime = 0;
  function injectorHTMLInner(state) {
    // - INJECT
    if (state) {
      const parents = [parent_selectors]?.flat(2)?.map(p => Array.from(document.querySelectorAll(p))).flat(2)
      const item = document.createElement("div");
      item.setAttribute("class", item_class);
      item.appendChild(content);

      if (parent_selectors === "root") {
        document.documentElement.appendChild(item);
        return;
      }

      if (!parents?.length) {
        if (waitTime < 8000) {
          setTimeout(injectorHTMLInner, 100);
          waitTime += 100;
        }
        else console.log("Maximum wait time reached. Exiting...");
        return;
      }

      if (content && parent_selectors.length) {
        parents.forEach(r => {
          if (!r.querySelector("." + item_class)) {
            if (inj_bottom)
              r.appendChild(item);
            else
              r.insertBefore(item, r.firstChild)
          }
        })
      }

    }
    // - CLEAN UP
    else
      document.querySelectorAll(`.${item_class}`)?.forEach(e => e.remove())
  }
  injectorHTMLInner(state);
  observeClassChanges(parent_selectors, () => injectorHTMLInner(state))
}


function observeClassChanges(parentSelector, callback) {
  document.addEventListener("DOMContentLoaded", () => {
    let current = getElements();

    function getElements() {
      if (Array.isArray(parentSelector)) {
        let selectedElements = [];
        parentSelector.forEach(selector => {
          let items = document.querySelectorAll(selector);
          selectedElements = selectedElements.concat(Array.from(items));
        });
        return selectedElements;
      }
      return document.querySelectorAll(parentSelector)
    }

    const observer = new MutationObserver(() => {
      let newElements = getElements();
      if (newElements.length !== current.length || !Array.from(newElements).every((element, index) => element === current[index])) {
        callback();
        current = newElements;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    return observer;
  }, false);
}