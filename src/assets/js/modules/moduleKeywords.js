import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

// Generate keywords button
export default function moduleKeywords(state) {
  const item = document.createElement('div');
  const item_class = 'kwbtn_4ee3ec19-45e2-40a6-bc69-4760bf491928__gw';

  if (state) {
    const urlParam = new URLSearchParams(window.location.search).get('k'),
      domain = window.location.hostname.replace(/^www\./, ''),
      logo = getLogo();

    item.innerHTML = `<button class="keywordsgws__btn" id="keywordsgws"><div class="keywordsgws__logo"><img src="${logo}" alt="Logo"></div><span>Generate Keywords?</span></button>`

    function onKeywordsGen() {
      navigateOrSwitch(`content/keywords.html?k=${urlParam ?? ''}&mp=${domain ?? ''}`, item_class, true)
    }
    item.setAttribute('class', item_class)
    item.addEventListener("click", onKeywordsGen)
  }


  // Injection part
  injectorHTML(state, item, item_class, '[data-component-type="s-messaging-widget-results-header"]', true);
}

