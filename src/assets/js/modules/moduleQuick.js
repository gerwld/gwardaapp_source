import getbyASIN from "../tools/fetch/getbyASIN";
import injectorHTML from "../tools/injectorHTML";
import observeClassChanges from "../tools/observeClassChages";

// Quick View 
export default function moduleQuick(state) {
  const is_location = window.location.pathname && window.location.pathname !== "/";
  if (is_location) {
    console.log('moduleQuick was called');
    const item_class = 'qwv_617330cb-0d46-4305-adba-241c658be85d__gw'



    // Creation part
    function createElement(data) {
      const item = document.createElement('div');
      item.innerHTML = `
    <div class="qgw qfixgw">
    <div class="qgw__dl">
      <div>
        <span class="qgw__dt">ASIN:</span>
        <span class="qgw__dd" data-part="asin">${data?.asin ?? "loading..."}</span>
      </div>
      <div>
        <span class="qgw__dt">LQS:</span>
        <span class="qgw__dd">${data?.data?.lqs ?? "loading..."}</span>
      </div>

      <div>
        <span class="qgw__dt">Weight:</span>
        <span class="qgw__dd">0:</span>
      </div>
      <div>
        <span class="qgw__dt">Pub. date:</span>
        <span class="qgw__dd">0:</span>
      </div>
      <div>
        <span class="qgw__dt">Last 30d sales:</span>
        <span class="qgw__dd">0:</span>
      </div>
      <div>
        <span class="qgw__dt">Dimensions:</span>
        <span class="qgw__dd">20/25/400 in</span>
      </div>
    </div>
    <div class="qgw__nav">
      <a href="#">Link</a>
      <a href="#">1688</a>
      <a href="#">Alibaba</a>
      <a href="#">Aliexress.com</a>
    </div>
  </div>

    `;
      return item;
    }

    // Initial injection part
    let item = createElement();
    injectorHTML(state, item, item_class, ['.s-result-list>[data-component-type="s-search-result"] .puis-card-container'], true);


    function update() {
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"]')
      let asins = [...items].map(e => e.getAttribute("data-asin") || [])
      if (asins.length) {
        getbyASIN(asins, append)
      }
    }

    function append(payload) {
      let item = createElement(payload);
      injectorHTML(state, item, item_class, [`.s-result-list>[data-component-type="s-search-result"][data-asin=${payload.asin}] .puis-card-container`], true);
    }


    observeClassChanges('.s-result-list>[data-component-type="s-search-result"]', update)
  }
}