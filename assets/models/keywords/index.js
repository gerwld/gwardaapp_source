

document.addEventListener("DOMContentLoaded", () => {
  const browser_cr = chrome ? chrome : browser;

  function findAndAdd() {
    const btn = document.getElementById('keywordsgws');
    const urlParams = new URLSearchParams(window.location.search);
    if (!btn || !urlParams) {
      setInterval(findAndAdd, 200);
      return;
    }
    const urlparam = urlParams.get('k')

    document.getElementById('keywordsgws').addEventListener("click", () => {
      browser_cr.runtime.sendMessage({ openKeywords: urlparam });
    });

  }
  findAndAdd();
}, false);