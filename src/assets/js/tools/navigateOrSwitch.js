export default function navigateOrSwitch(navlink, linkId, isExtension) {
  let link = '';
  if (isExtension && navlink) {
    const browser_cr = chrome ? chrome : browser;
    link = browser_cr.runtime.getURL(navlink)
  }
  else link = navlink;

  let newTab = window.open(link, linkId);
  if (newTab) {
    newTab.focus();
  }
}