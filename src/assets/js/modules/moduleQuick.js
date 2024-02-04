import filterByClass from "../tools/filterByClass";
import getLogo from "../tools/getLogo";
import getbyASIN from "../tools/getbyASIN";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";
import observeClassChanges from "../tools/observeClassChages";
import removeDuplicates from "../tools/removeDuplicates";



// Quick View 
let requested = []
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
      function getAsins() {
        if (items) {
          let newAssins = [...items].filter(e => !e.classList.contains("AdHolder")).map(e => e.getAttribute("data-asin") || null)
          return newAssins?.filter((e, i) => e && newAssins.indexOf(e) === i)
        }
      }
      let asins = getAsins().filter(e => requested.indexOf(e) == -1);
      requested.push(...asins)
      getbyASIN(asins, append)
    }

    function append(payload) {
      // console.log(payload.asin);
      let item = createElement(payload);
      injectorHTML(state, item, item_class, [`.s-result-list>[data-component-type="s-search-result"][data-asin=${payload.asin}] .puis-card-container`], true);
    }




    observeClassChanges('.s-result-list>[data-component-type="s-search-result"]', update)
  }
}


// .sg-col-4-of-16
// .s-result-list>.sg-col-12-of-16 