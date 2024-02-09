import getbyASIN from "../tools/fetch/getbyASIN";
import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import { hashObject, shallowEqual } from "../tools/objects";
import observeClassChanges from "../tools/observeClassChages";
import getASINTrust from "../tools/processing/getASINTrust";
import updateHTML from "../tools/updateHTML";

const browser_cr = chrome ? chrome : browser;

// Quick View 
export default function moduleQuick(state) {
  const is_location = window.location.pathname && window.location.pathname !== "/" && window.location.pathname.startsWith("/s");
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
        <span class="qgw__dd">${data?.data?.ms?.weight ?? "-"}</span>
      </div>
      <div>
        <span class="qgw__dt">Rel. date:</span>
        <span class="qgw__dd">${data?.data?.date ?? "-"}</span>
      </div>
      <div>
        <span class="qgw__dt">Last 30d sales:</span>
        <span class="qgw__dd">-</span>
      </div>
      <div>
        <span class="qgw__dt">Rating(avg/total):</span>
        <span class="qgw__dd">loading...</span>
        <span class="qgw__label qgw__trustl2">
      <span class="qgw__loader qgw__loader__prev"><img src="${getLogo('assets/img/loader.gif')}" /></span>
        </span>
      </div>
  <div class="qgw__group">
    <div>
      <span class="qgw__dt">FBA Fees:</span>
      <span class="qgw__dd">${data?.data?.fbafees ?? "-"}</span>
    </div>
    <div>
      <span class="qgw__dt">Variations:</span>
      <span class="qgw__dd">${data?.data?.variations ?? "1"}</span>
    </div>
  </div>
    </div>
  <div class="qgw__nav">
    <a href="#">Ads Insights</a>
    <a href="#">1688</a>
    <a href="#">Alibaba</a>
    <a href="#">Aliexress.com</a>
  </div>
      </div>
            `;
      return item;
    }

    function updateElement(data) {
      let trust = window?.gwApp?.asin_trust || {}
      console.log('updateElement arg:', data);
      const content = document.createElement('div');
      content.setAttribute('data-type', 'content')
      content.classList.add('qgw', 'qfixgw')

      content.innerHTML = `
        <div class="qgw__dl">
          <div>
            <span class="qgw__dt">ASIN:</span>
            <span class="qgw__dd" data-part="asin">${data?.asin || "-"}</span>
          </div>
          <div>
            <span class="qgw__dt">LQS:</span>
            <span class="qgw__dd">${data?.data?.lqs ?? "-"}</span>
          </div>

          <div>
            <span class="qgw__dt">Weight:</span>
            <span class="qgw__dd">${data?.data?.ms?.weight ?? "-"}</span>
          </div>
          <div>
            <span class="qgw__dt">Rel. date:</span>
            <span class="qgw__dd">${data?.data?.date ?? "-"}</span>
          </div>
          <div>
            <span class="qgw__dt">Last 30d sales:</span>
            <span class="qgw__dd">-</span>
          </div>
          <div>
            <span class="qgw__dt">Rating(avg/total):</span>
            <span class="qgw__dd">${`${data?.data?.rating_avg}<span class="qgw__rttot">(${data?.data?.ratings_total})</span>` ?? "-"}</span>
            <span class="qgw__label qgw__trustl2">

        ${trust && trust[data?.asin] ?
          `<span class="qgw__trustl2w ${trust[data?.asin] ? `qgw__trustl2w__` + trust[data?.asin][0] : ""}"> <span>${trust[data?.asin][0]}</span></span>`

          :

          `<span class="qgw__loader"><img src="${getLogo('assets/img/loader.gif')}" /></span>`
        }
            </span>
          </div>
      <div class="qgw__group">
        <div>
          <span class="qgw__dt">FBA Fees:</span>
          <span class="qgw__dd">${data?.data?.fbafees ?? "-"}</span>
        </div>
        <div>
          <span class="qgw__dt">Variations:</span>
          <span class="qgw__dd">${data?.data?.variations ?? "1"}</span>
        </div>
      </div>
        </div>
      <div class="qgw__nav">
        <a href="#">Ads Insights</a>
        <a href="#">1688</a>
        <a href="#">Alibaba</a>
        <a href="#">Aliexress.com</a>
      </div>
    `;
      return content;
    }


    function updateTrust(results) {
      console.log('updateTrust result processing:', results);

      if (results) {
        Object.keys(results).forEach(key => {
          if (window.gwApp)
            window.gwApp = { ...window.gwApp, asin_trust: { ...results } }
          else
            window.gwApp = { asin_trust: { ...results } }

          const parente = document.querySelector(`[data-asin= "${key}"] .${item_class} `);
          const notInit = parente?.querySelector('.qgw__loader') && !parente.querySelector(".qgw__loader__prev");
          if (parente && notInit) {
            let string = `<span class="qgw__trustl2w ${results[key] ? `qgw__trustl2w__` + results[key][0] : ""}"> <span>${results[key][0]}</span></span> `;
            let item = parente?.querySelector(".qgw__trustl2");
            if (item) {
              item.innerHTML = string;
            }
          }
        })
      }
    }

    // Initial injection part
    let item = createElement();
    injectorHTML(state, item, item_class, ['.s-result-list>[data-component-type="s-search-result"] .puis-card-container'], true);


    // sends request to backend
    function observeAndFetch() {
      initializeUpdate();
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"]')
      let asins = [...items].filter(e => !e.classList.contains('AdHolder')).map(e => e.getAttribute("data-asin") || [])
      console.log("observeAndFetch call, asins to fetch:", asins);
      if (asins.length) {
        getbyASIN(asins)
        getASINTrust(asins).then(i => updateTrust(i))
        console.log('entry fetch point observeAndFetch() call. update in moduleQuick:', asins);
      }
    }

    // recieves new data
    let prevHash;
    let prevCache;
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
      if (changes.gpCache && changes.gpCache.newValue) {
        const newHash = hashObject(changes.gpCache.newValue);
        if (newHash !== prevHash || !shallowEqual(changes.gpCache.newValue, prevCache)) {
          prevHash = newHash;
          prevCache = changes.gpCache.newValue;
          initializeUpdate();
        }
      }
    });

    function initializeUpdate() {
      console.log('moduleQuick -> initializeUpdate call');
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list> [data-component-type="s-search-result"]');
      const asins_prev = [...items].filter(e => !e.classList.contains('AdHolder')).map(item => item.getAttribute("data-asin"));
      const asins = asins_prev.filter((e, i) => e && asins_prev.indexOf(e) === i);
      if (asins.length > 0) {
        browser_cr.storage.local.get("gpCache", (result) => {
          console.log(result);
          const cachedData = result?.gpCache || [];
          const newData = cachedData.filter(data => asins.includes(data?.asin));
          console.log('New data from gpCache:', result, newData, asins);
          newData.forEach(item => {
            updateExist(item);
          });
        });
      }
    }
    initializeUpdate();


    function updateExist(payload) {
      let parent_class = `[data-component-type="s-search-results"] .s-result-list> [data-component-type="s-search-result"][data-asin="${payload.asin}"] .${item_class} `
      let item_init = document.querySelector(parent_class)?.getAttribute('data-initialized') === 'true'
      if (!item_init) {
        let item = updateElement(payload);
        updateHTML(item, item_class, [parent_class], true)
      }
    }

    observeAndFetch()
    document.addEventListener("DOMContentLoaded", observeAndFetch)
    setInterval(observeAndFetch, 1000)
    observeClassChanges('[data-component-type="s-search-results"] .s-result-list> [data-component-type="s-search-result"]', observeAndFetch)
  }
}