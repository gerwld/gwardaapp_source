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
      
      initializeUpdate();
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"]')
      let asins = [...items].filter(e => !e.classList.contains('AdHolder')).map(e => e.getAttribute("data-asin") || [])
      console.log("observeAndFetch call, asins to fetch:", asins);
      if (asins.length) {
        getbyASIN(asins)
        console.log('entry fetch point observeAndFetch() call. update in moduleQuick:', asins);
      }   
    }

    // recieves new data
    let prevHash;
    let prevCache;
    browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
        // if (changes.gpCache && changes.gpCache.newValue) {
        //     const newHash = hashObject(changes.gpCache.newValue);
        //     if (newHash !== prevHash || !shallowEqual(changes.gpCache.newValue, prevCache)) {
        //         prevHash = newHash;
        //         prevCache = changes.gpCache.newValue;
                initializeUpdate();
        //     }
        // }
    });
    
    // function hashObject(obj) {
    //     return JSON.stringify(obj); // Simple hash using JSON.stringify
    // }
    
    // function shallowEqual(obj1, obj2) {
    //     const keys1 = Object.keys(obj1);
    //     const keys2 = Object.keys(obj2);
    //     if (keys1.length !== keys2.length) {
    //         return false;
    //     }
    //     for (let key of keys1) {
    //         if (obj1[key] !== obj2[key]) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    

    function initializeUpdate() {
      console.log('moduleQuick -> initializeUpdate call');
      const items = document.querySelectorAll('[data-component-type="s-search-results"] .s-result-list > [data-component-type="s-search-result"]');
      const asins_prev = [...items].filter(e => !e.classList.contains('AdHolder')).map(item => item.getAttribute("data-asin")); 
      const asins = asins_prev.filter((e,i) => e && asins_prev.indexOf(e) === i); 
      if (asins.length > 0) {
          browser_cr.storage.local.get("gpCache", (result) => {
              console.log(result);
              const cachedData = result?.gpCache || [];
              const newData = cachedData.filter(data => asins.includes(data.asin));
              console.log('New data from gpCache:', result, newData, asins);
              newData.forEach(item => {
                  updateExist(item);
              });
          });
      }
  }
  initializeUpdate();


    function updateExist(payload) {
      let parent_class = `[data-component-type="s-search-results"] .s-result-list>[data-component-type="s-search-result"][data-asin="${payload.asin}"] .${item_class}`
      let item_init = document.querySelector(parent_class).getAttribute('data-initialized') === 'true'
      if(!item_init){
        let item = updateElement(payload);
        updateHTML(item, item_class, [parent_class], true)
      }
    }

    observeAndFetch()
    document.addEventListener("DOMContentLoaded", observeAndFetch)
    observeClassChanges('[data-component-type="s-search-results"] .s-result-list > [data-component-type="s-search-result"]', observeAndFetch)
  }
}