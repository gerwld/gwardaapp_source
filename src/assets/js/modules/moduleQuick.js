import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

// Quick View 
export default function moduleQuick(state) {
  const item_class = 'qwv_617330cb-0d46-4305-adba-241c658be85d__gw'


  // Creation part
  function createElement() {
    const item = document.createElement('div');
    let logo = getLogo();
    item.innerHTML = `
    <div class="qgw qfixgw">
    <div class="qgw__dl">
      <div>
        <span class="qgw__dt">ASIN:</span>
        <span class="qgw__dd">B0C6VT7YN5</span>
      </div>
      <div>
        <span class="qgw__dt">LQS:</span>
        <span class="qgw__dd">7.3</span>
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
    item.classList.add(item_class);
    // if (is12of16)
    //   item.classList.add('qwv__wide');
    return item;
  }

  // Injection part
  let item = createElement();
  injectorHTML(state, item, item_class, ['.s-result-list>[data-component-type="s-search-result"] .puis-card-container'], true);

}


// .sg-col-4-of-16
// .s-result-list>.sg-col-12-of-16 