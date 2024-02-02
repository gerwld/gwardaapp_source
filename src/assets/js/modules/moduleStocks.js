import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

// Generate keywords button
export default function moduleStocks(state) {
  const item_class = 'stls_27cf0cfa-fdc3-4bbb-bb12-057220a13c2b__gw'

  // Creation part
  function createElement() {
    const item = document.createElement('div');
    let logo = getLogo();
    item.innerHTML = `
<div class="stwsl">
  <div class="stwsl__header">
    <div class="stwsl__logo">
    <img src=${logo} alt="Logo"/>
    </div>
    <div class="stwsl__title">GwardaApp Stocks Stats:</div>
    <div class="stwsl__val">

      <label class="ch_ip">
        <input type="checkbox" name="enabled" />
        <span class="ch_sp"></span>
      </label>
    </div>
  </div>
  <div class="stwsl__content">
    <div class="stwsl__item">
      <div class="stwsl__name">MOTO3LS</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">$</span>
        <span class="stwsl__price__total">10.29</span>
      </div>
      <div class="stwsl__total">600</div>
    </div>
    <div class="stwsl__item">
      <div class="stwsl__name">Xrheh</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">$</span>
        <span class="stwsl__price__total">10.29</span>
      </div>
      <div class="stwsl__total">928</div>
    </div>
    <div class="stwsl__item">
      <div class="stwsl__name">Heroz</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">$</span>
        <span class="stwsl__price__total">10.29</span>
      </div>
      <div class="stwsl__total">53</div>
    </div>
    <div class="stwsl__item">
      <div class="stwsl__name">Haiyn</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">$</span>
        <span class="stwsl__price__total">10.29</span>
      </div>
      <div class="stwsl__total">20</div>
    </div>
    <div class="stwsl__item">
      <div class="stwsl__name">Topper</div>
      <div class="stwsl__price">
        <span class="stwsl__price__currency">$</span>
        <span class="stwsl__price__total">10.29</span>
      </div>
      <div class="stwsl__total">19</div>
    </div>
  </div>
</div>
    `
    item.classList.add(item_class);
    return item;
  }

  // Injection part
  let item = createElement();
  injectorHTML(state, item, item_class, ['#buybox'], true);
}

