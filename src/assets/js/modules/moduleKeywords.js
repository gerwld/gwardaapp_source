import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

// Generate keywords button
export default function moduleKeywords(state) {
  const item_class = 'kwbtn_4ee3ec19-45e2-40a6-bc69-47604bf491928__gw'

  // Event Callback part
  function onKeywordsGen(e) {
    let urlParam = new URLSearchParams(window.location.search).get('k');
    let domain = window.location.hostname.replace(/^www\./, '');
    if (e.target.id === 'keywordsgws' || e.target.closest('#keywordsgws')) {
      navigateOrSwitch(`content/keywords.html?k=${urlParam ?? ''}&mp=${domain ?? ''}`, item_class, true)
    }
  }
  // Creation part
  function createElement() {
    const item = document.createElement('div');
    let logo = getLogo();
    item.innerHTML = `<button class="keywordsgws__btn" id="keywordsgws"><div class="keywordsgws__logo"><img src="${logo}" alt="Logo"></div><span>Generate Keywords</span></button>`
    item.classList.add(item_class);
    document.removeEventListener("click", onKeywordsGen)
    document.addEventListener("click", onKeywordsGen)
    return item;
  }

  // Injection part
  let item = createElement();
  injectorHTML(state, item, item_class, ['span[data-component-type="s-messaging-widget-results-header"]'], true);
}

