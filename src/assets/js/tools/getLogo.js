export default function getLogo(uri = 'assets/img/logo.svg') {
  const browser_cr = chrome ? chrome : browser ? browser : null;
  if (!browser_cr) return "#";
  return browser_cr?.runtime?.getURL(uri) || "#";
}