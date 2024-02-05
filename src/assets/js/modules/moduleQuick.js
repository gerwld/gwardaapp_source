import getbyASIN from "../tools/fetch/getbyASIN";
import injectorHTML from "../tools/injectorHTML";
import observeClassChanges from "../tools/observeClassChages";
import updateHTML from "../tools/updateHTML";

const browser_cr = chrome ? chrome : browser;

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
      <div class="qgw qfixgw" data-type="content">
        <div class="qgw__dl">
          <div>
            <span class="qgw__dt">ASIN:</span>
            <span class="qgw__dd" data-part="asin">${data?.asin || "loading..."}</span>
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

    function updateElement(data) {
      console.log('updateElement arg:', data?.asin);
      const content = document.createElement('div');
      content.setAttribute('data-type', 'content')
      content.classList.add('qgw', 'qfixgw')

      content.innerHTML = `
        <div class="qgw__dl">
          <div>
            <span class="qgw__dt">ASIN:</span>
            <span class="qgw__dd" data-part="asin">${data?.asin || "aaaooo..."}</span>
          </div>
          <div>
            <span class="qgw__dt">LQS:</span>
            <span class="qgw__dd">${data?.data?.lqs ?? "aaaooo..."}</span>
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
            `;
      console.log(content);
      return content;
    }

    // Initial injection part
    let item = createElement();
    injectorHTML(state, item, item_class, ['.s-result-list>[data-component-type="s-search-result"] .puis-card-container'], true);


    // sends request to backend
    function observeAndFetch() {
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"]')
      let asins = [...items].map(e => e.getAttribute("data-asin") || [])
      if (asins.length) {
        getbyASIN(asins)
        console.log('update in module, entry:', asins);
      }

      //then fire initializeUpdate();
      initializeUpdate();
    }

    // recieves new data
    let prevstate;
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      if (
        changes.gpCache &&
        changes.gpCache.newValue &&
        JSON.stringify({ ...changes.gpCache.newValue }) !== prevstate
      ) {
        prevstate = JSON.stringify({ ...changes.gpCache.newValue });
        initializeUpdate();
      }
    });


    function initializeUpdate() {
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"]')
      let asins = [...items].map(e => e.getAttribute("data-asin") || [])
      if (asins) {
        browser_cr.storage.local.get("gpCache", (result) => {
          console.log(result);
          let newData = result?.gpCache?.filter(e => asins.indexOf(e.asin) !== -1) || [];
          console.log('new_data from crCache:', result, newData, asins);

          newData?.forEach(i => {
            updateExist(i)
          })
        });
      }
    }
    initializeUpdate();



    function updateExist(payload) {
      let item = updateElement(payload);
      // injectorHTML(state, item, item_class, [`.s-result-list>[data-component-type="s-search-result"][data-asin="${payload.asin}"] .puis-card-container`], true);
      updateHTML(item, item_class, [`.s-result-list>[data-component-type="s-search-result"][data-asin="${payload.asin}"] .${item_class}`], true)
    }

    observeAndFetch()
    document.addEventListener("DOMContentLoaded", observeAndFetch)
    observeClassChanges('.s-result-list>[data-component-type="s-search-result"]', observeAndFetch)
  }
}