export default function getLogo(uri = 'assets/img/logo.svg') {
  const browser_cr = chrome ? chrome : browser;
  return browser_cr.runtime.getURL(uri) || "#";
}