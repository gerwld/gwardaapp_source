export default function trimTags(innerHTML) {
  if (innerHTML) {
    innerHTML = innerHTML + '';
    return innerHTML.replace(/<[^>]*>/g, '').trim()
  }
}