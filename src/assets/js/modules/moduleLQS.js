import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

// Generate keywords button
export default function moduleLQS(state) {
  const item_class = 'lfmz_d6b368ee-947a-47a4-b8fc-c791acca1843__gw'

  // Creation part
  function createElement() {
    const item = document.createElement('div');
    let logo = getLogo();
    item.innerHTML = `
    <div class="lqswlx qfixgw">
    <button class="lqswlx__btn">
      <div class="lqswlx__logo">
        <svg version="1.1" id="logofwd" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px" y="0px" viewBox="0 0 566.9 566.9" style="enable-background:new 0 0 566.9 566.9;" xml:space="preserve">
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="142.5511" y1="312.1756" x2="233.8026"
            y2="312.1756" gradientTransform="matrix(1 0 0 -1 0 567.2756)">
            <stop offset="0" style="stop-color:#F7941D" />
            <stop offset="0.4918" style="stop-color:#F8991D" />
            <stop offset="0.9692" style="stop-color:#FAA81D" />
          </linearGradient>
          <polygon class="st0" style="fill:url(#SVGID_1_);" points="233.8,316.5 142.6,316.5 187.1,193.7 189.4,193.7 " />
          <linearGradient id="SVGID_00000064315894202874205530000013880605511518761647_" gradientUnits="userSpaceOnUse"
            x1="0" y1="283.8256" x2="566.9" y2="283.8256" gradientTransform="matrix(1 0 0 -1 0 567.2756)">
            <stop offset="0" style="stop-color:#F7941D" />
            <stop offset="0.1633" style="stop-color:#F8991D" />
            <stop offset="0.4095" style="stop-color:#FAA81D" />
            <stop offset="0.7063" style="stop-color:#FEC11B" />
            <stop offset="1" style="stop-color:#FFDE17" />
          </linearGradient>
          <path style="fill:url(#SVGID_00000064315894202874205530000013880605511518761647_);" d="M393.4,0H173.5C77.7,0,0,77.7,0,173.5
    v219.9c0,95.8,77.7,173.5,173.5,173.5h219.9c95.8,0,173.5-77.7,173.5-173.5V173.5C566.9,77.7,489.2,0,393.4,0z M497.4,312.8
    c0,24.2-5.3,45.1-16.1,62.9c-10.8,17.8-25.6,31.4-44.5,41.1c-19,9.6-40.5,14.4-64.9,14.4c-18.8,0-35.8-2.8-51.4-8.5l2.5,6.6h-48.3
    l-27.6-76.1H129.4l-27.6,76.1H53.5l108.4-287.8h52.6l30.3,80.2l0,0c6.7-18.3,16-33.8,28.3-46.6c12.2-12.8,26.4-22.6,42.8-29.4
    c16.4-6.7,34.4-10.2,54.1-10.2c16.2,0,31.4,2.2,45.6,6.8c14.1,4.6,26.7,11.1,37.6,19.6c11.1,8.5,20.2,18.4,27.4,30.1
    c7.3,11.5,12.3,24.4,14.7,38.4h-46.6v0.1c-2.8-8.5-6.6-16.2-11.4-23c-4.7-6.7-10.4-12.6-17.1-17.4c-6.6-4.8-14-8.5-22.4-11
    c-8.4-2.6-17.6-3.8-27.6-3.8c-17.1,0-32.3,4.2-46,12.5c-13.6,8.3-24.4,20.5-32.3,36.6c-8,16-11.8,35.7-11.8,58.9
    c0,23.3,3.9,43.1,11.8,59.1c8,16.2,18.9,28.3,32.7,36.7c13.9,8.3,29.5,12.5,47.2,12.5c16.3,0,30.7-3.2,43-9.5
    c12.3-6.4,21.8-15.4,28.5-27.1c6.4-11.1,9.7-24.2,10.1-39.1h-74.5V280h118.6v32.8H497.4z" />
        </svg>
  
      </div>
      <div class="lqswlx__btn-content">
        <span class="lqswlx__lab">LQS:</span>
        <span class="lqswlx__value">6.4</span>
        <span class="lqswlx__tot">/ 10</span>
      </div>
    </button>
    <div class="lqswlx__content__wrapper">
      <div class="lqswlx__content">
        <div class="lqswlx__group">
          <h3 class="lqswlx__title">Listing Text</h3>
          <table>
            <tr>
              <td>Title:</td>
              <td>Value 1</td>
              <td>Info 1</td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>Value 2</td>
              <td>Info 2</td>
            </tr>
            <tr>
              <td>Bullets:</td>
              <td>Value 3</td>
              <td>Info 3</td>
            </tr>
          </table>
        </div>
        <div class="lqswlx__group">
          <h3 class="lqswlx__title">Product Images</h3>
          <table>
            <tr>
              <td>Images:</td>
              <td>Value 1</td>
              <td>Info 1</td>
            </tr>
            <tr>
              <td>Main Image Background:</td>
              <td>Value 2</td>
              <td>Info 2</td>
            </tr>
            <tr>
              <td>Avg. Image Dimensions:</td>
              <td>Value 3</td>
              <td>Info 3</td>
            </tr>
          </table>
        </div>
        <div class="lqswlx__group">
          <h3 class="lqswlx__title">Reviews</h3>
          <table>
            <tr>
              <td>Rating:</td>
              <td>Value 1</td>
              <td>Info 1</td>
            </tr>
            <tr>
              <td>Number of ratings:</td>
              <td>Value 2</td>
              <td>Info 2</td>
            </tr>
            <tr>
              <td>Buyed Ratings Probability:</td>
              <td>Value 3</td>
              <td>Info 3</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
    `
    item.classList.add(item_class);
    return item;
  }

  // Injection part
  let item = createElement();
  injectorHTML(state, item, item_class, ['#titleSection'], false);
}

