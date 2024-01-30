

document.addEventListener("DOMContentLoaded", () => {
  const browser_cr = chrome ? chrome : browser;

  function findAndAdd() {
    const btn = document.getElementById('keywordsgws');
    const urlParams = new URLSearchParams(window.location.search);
    const domain = window.location.hostname.replace(/^www\./, '');
    if (!btn || !urlParams || !domain) {
      setInterval(findAndAdd, 200);
      return;
    }
    const urlparam = urlParams.get('k')

    document.getElementById('keywordsgws').addEventListener("click", () => {
      const navlink = browser_cr.extension.getURL(`content/keywords.html?k=${urlparam}&mp=${domain}`)
      let newTab = window.open(navlink, '_gw_peferences');
      if (newTab) {
        newTab.focus();
      }
    });

  }
  findAndAdd();
}, false);