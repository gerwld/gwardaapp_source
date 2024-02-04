export default function filterByClass(nodeList, className) {
  if (!nodeList || !nodeList.length)
    return []
  return nodeList.filter(e => !e.classList.contains(className))
}