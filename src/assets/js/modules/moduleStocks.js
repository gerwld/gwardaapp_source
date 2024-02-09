import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import updateHTML from "../tools/updateHTML";
const browser_cr = chrome ? chrome : browser;

// Generate keywords button
let store = []
export default function moduleStocks(state) {
  const item_class = 'stls_27cf0cfa-fdc3-4bbb-bb12-057220a13c2b__gw'
  const is_location = window.location.pathname && window.location.pathname !== "/" && window.location.pathname !== "/s";


  if (is_location) {
    console.log("moduleStocks init");
    // Creation part
    function createElement(data) {
      const item = document.createElement('div');
      let logo = getLogo();
      item.innerHTML = `
<div class="stwsl">
  <div class="stwsl__header">
    <div class="stwsl__logo">
    <img src=${logo} alt="Logo"/>
    </div>
    <div class="stwsl__title">GwardaApp Stocks Status</div>
    <div class="stwsl__val">
    </div>
  </div>
  <div class="stwsl__content" data-type="content">
    <span class="qgw__loader qgw__loader__prev qgw__loader__full"><img src="${getLogo('assets/img/loader.gif')}" /></span>
  </div>
  <span class="stwsl__sub"><div>Looking for lowest price?<div><div>Try <a href="#">search by images</a></div></span>
</div>
    `
      item.classList.add(item_class);
      return item;
    }

    // Update part
    function updateElement(data) {
      console.log('updateElement arg:', data);

      const content = document.createElement('div');
      content.setAttribute('data-type', 'content')
      content.classList.add('stwsl__content')

      content.innerHTML = data.map(item => item?.label ? (`
    <a href="${item?.link}" target="_blank" title="Seller: ${item.label}" class="stwsl__item">
      <div class="stwsl__name">${item.label}</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">${item.price ?? "-"}</span>
      </div>
      <div class="stwsl__total">${item.stock ? (item.stock === 1 ? item.stock + " " : (item.stock - 1 + "+")) : "0 "}</div>
    </a>
    `) : "").join("");
      if (!content.innerHTML)
        content.innerHTML = `<span class="qgw__loader qgw__loader__prev qgw__loader__full">not found</span>`

      return content;
    }

    const parser = new DOMParser()

    // Fetch part
    async function fetchStocksOnBackend(asin) {
      if ((!store || Object.keys(store).length === 0) && asin) {
        console.log('fetchStocksOnBackend call');
        await browser_cr.runtime.sendMessage({ action: 'fetchStocks', arr: [asin] }, async resp => {
          getStocksPopoverData(parser.parseFromString(resp, 'text/html'));
        });
      }
    }

    function getStocksPopoverData(current = document) {
      const current_item = current.querySelectorAll("#aod-sticky-pinned-offer");
      const other_items = current.querySelectorAll("#aod-offer");
      const total = [...current_item, ...other_items]
      const data = [];

      total.forEach(item => {
        let asin = item?.querySelector('[data-action="aod-atc-action"]')
          ?.getAttribute("data-aod-atc-action")
          ?.split(",")
          ?.filter(e => e && e?.startsWith(`"asin"`))[0]
          ?.split(":")[1]
          ?.replace(/\\/g, '') || null;
        if (asin) {
          data.push({
            asin,
            label: item?.querySelector("#aod-offer-soldBy a")?.innerText?.trim() || null,
            link: item?.querySelector("#aod-offer-soldBy a")?.href || null,
            stock: item?.querySelectorAll("#aod-qty-dropdown-scroller > span").length,
            price: item?.querySelector(".a-offscreen")?.innerHTML || null
          })
        }

      })

      store = [...data]
      updateExist(store)
      console.log("getStocksPopoverData result:", data);
    }


    // Update part
    function updateExist(payload) {
      let parent_class = `#rightCol .${item_class}`;
      let item_init = document.querySelector(parent_class)?.getAttribute('data-initialized') === 'true'
      if (!item_init) {
        let item = updateElement(payload);
        updateHTML(item, item_class, [parent_class], true)
      }
    }

    // Injection part
    let item = createElement();
    injectorHTML(state, item, item_class, ['#rightCol'], false);
    if (store?.length)
      updateExist(store);

    // Fetch part 
    const dpValue =
      window?.location?.href?.split("/dp/product/")[1]?.split("/")[0]?.substring(0, 10)
      || window?.location?.href?.split("/gp/product/")[1]?.split("/")[0]?.substring(0, 10)
      || window?.location?.href?.split("/dp/product/")[1]?.split("?ref")[0]?.substring(0, 10)
      || window?.location?.href?.split("/gp/product/")[1]?.split("?ref")[0]?.substring(0, 10)
      || window?.location?.href?.split("/gp/")[1]?.split("/")[0]?.substring(0, 10)
      || window?.location?.href?.split("/dp/")[1]?.split("/")[0]?.substring(0, 10)
      || window?.location?.href?.split("/gp/")[1]?.split("?ref")[0]?.substring(0, 10)
      || window?.location?.href?.split("/dp/")[1]?.split("?ref")[0]?.substring(0, 10)
      || null;
    console.log("dpValue", dpValue, state);
    if (state && dpValue)
      fetchStocksOnBackend(dpValue)
  }
}
