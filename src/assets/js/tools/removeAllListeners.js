export default function removeAllEventListeners(element) {
  if (element) {
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
    clone.replaceWith(element);
  }
}