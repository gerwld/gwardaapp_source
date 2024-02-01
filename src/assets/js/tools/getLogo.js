export default function getLogo() {
  const browser_cr = chrome ? chrome : browser;
  return browser_cr.runtime.getURL('assets/img/logo.svg') || "#";
}