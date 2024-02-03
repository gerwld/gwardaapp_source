export default function observeClassChanges(parentSelector, callback) {
  let current = getElements();

  function getElements() {
    if (Array.isArray(parentSelector)) {
      let selectedElements = [];
      parentSelector?.forEach(selector => {
        let items = document.querySelectorAll(selector);
        selectedElements = selectedElements.concat(Array.from(items));
      });
      return selectedElements;
    }
    return document?.querySelectorAll(parentSelector)
  }

  const observer = new MutationObserver(() => {
    let newElements = getElements();
    if (newElements.length !== current.length || !Array.from(newElements).every((element, index) => element === current[index])) {
      callback();
      current = newElements;
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  return observer;
}