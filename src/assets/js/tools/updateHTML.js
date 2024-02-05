
// Updater for HTML. Only updates existing elements.

export default function updateHTML(item, item_class, parent_selector, set_bottom) {
  let totalWaitTime = 0;

  function updateParentAndProceed() {
    console.log("gwardaApp: updateParentAndProceed exec.")
    const parents = document.querySelectorAll(parent_selector);

    // If not found parent repeat for 10000ms, then break execution
    if (!parents || (Array.isArray(parent_selector) && parents.length === 0)) {
      if (totalWaitTime < 4000) {
        setTimeout(updateParentAndProceed, 400);
        totalWaitTime += 400;
      } else {
        console.log("Maximum wait time reached. Exiting...");
      }
      return;
    }

    if (item) {
      // Replace the existing child with the cloned node in each parent
      parents.forEach(r => {
        let content_block = r.querySelector('[data-type="content"]');
        if (r && r.getAttribute('data-initialized') !== 'true' && content_block) {
          r.setAttribute("data-initialized", "true");
          content_block.parentElement.replaceChild(item.cloneNode(true), content_block);
        }
      });
    }
  }

  updateParentAndProceed();
}
