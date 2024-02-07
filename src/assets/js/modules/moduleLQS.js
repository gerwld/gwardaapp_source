"use strict"

import getImageDimensionsFromURL from "../tools/getImgDimensionsFromUrl";
import getItemData from "../tools/getItemData";
import getLQS from "../tools/getLQS";
import getLogo from "../tools/getLogo";
import getMainImageBgColor from "../tools/getMainImageBgColor";
import injectorHTML from "../tools/injectorHTML";
import lazyFindElements from "../tools/lazyFindElements";
import observeClassChanges from "../tools/observeClassChages";
import trimTags from "../tools/trimTags";

// Generate keywords button
export default function moduleLQS(state) {
  const is_location = window.location.pathname && window.location.pathname !== "/";
  if (is_location) {
    const item_class = 'lfmz_d6b368ee-947a-47a4-b8fc-c791acca1843__gw'

    function initializeUpdate() {
      getItemData(null, [], document, 20, 20)
        .then(data => {
          append(data)
        }).catch(error => console.error(error))
    }


    // Creation part
    function createElement(store) {
      const item = document.createElement('div');
      let logo = getLogo();
      item.innerHTML = `
    <div class="lqswlx qfixgw">
    <button class="lqswlx__btn">
      <div class="lqswlx__logo">
        <img src="${getLogo()}" alt="Logo"/>
  
      </div>
      <div class="lqswlx__btn-content">
      <span class="lqswlx__btn__vals ${store?.description ? "" : " skeletonls"}">
        <span class="lqswlx__lab">LQS:</span>
        <span class="lqswlx__value">${store?.lqs ?? "- "}</span>
        <span class="lqswlx__tot">/ 10</span>
        </span>
      </div>
    </button>
    <div class="lqswlx__content__wrapper">
    <div class="lqswlx__content  ${store?.description ? "" : " skeletoned"}">
    <div class="lqswlx__group">
      <h3 class="lqswlx__title"><span>Listing Text</span></h3>
      <table>
        <tr>
          <td><span>Title:</td></span>
          <td><span>${store?.title ? store.title + " chars." : "Error"}</td></span>
          <td><span>More than 80 characters, up to 200. <a class="lb" href="">Learn More</a></td></span>
        </tr>
        <tr>
          <td><span>Description:</td></span>
          <td><span>${store?.description ? store.description + " chars." : "Error"}</td></span>
          <td><span>More than 1000 characters, up to 2500. <a href="">Learn More</a></td></span>
        </tr>
        <tr>
          <td><span>Bullets:</td></span>
          <td><span>${store?.bullets ?? "Error"}</td></span>
          <td><span>Minimum of 5 bullet points to highlight key features and benefits.<a href="">Learn More</a></td></span>
        </tr>
      </table>
    </div>
    <div class="lqswlx__group">
      <h3 class="lqswlx__title"><span>Product Images</span></h3>
      <table>
        <tr>
          <td><span>Images:</td></span>
          <td><span>${store?.images_total ?? "Error"}</td></span>
          <td><span>At least 4 High Quality images.<a href="">Learn More</a></td></span>
        </tr>
        <tr>
          <td><span>Main Image Background:</td></span>
          <td><span>${store?.main_bg ?? "unknown"}</td></span>
          <td><span>Main image on a transparent / white background.<a href="">Learn More</a></td></span>
        </tr>
        <tr>
          <td><span>Image Dimensions:</td></span>
          <td><span>${store?.main_dimensions ?? "unknown"}</td></span>
          <td><span>Bigger side at least 1420 pixels. ~ 72 DPI <a href="">Learn More</a></td></span>
        </tr>
        <tr>
        <td><span>Brand Content:</td></span>
        <td><span>${store?.brand_content}</td></span>
        <td><span>Description contain at least 1 image</td></span>
      </tr>
      </table>
    </div>
    <div class="lqswlx__group">
      <h3 class="lqswlx__title"><span>Reviews</span></h3>
      <table>
        <tr>
          <td><span>Rating:</td></span>
          <td><span>${store?.rating_avg ?? "unknown"}</td></span>
          <td><span>Rating 4.0 or more.<a href="" class="lb">Learn More</a></td></span>
        </tr>
        <tr>
          <td><span>Number of ratings:</td></span>
          <td><span>${store?.ratings_total ?? "unknown"}</td></span>
          <td><span>20 or above.
        </tr>
      </table>
    </div>
  </div></div>
  </div>
    `
      item.classList.add(item_class);
      return item;
    }


    // Injection part
    function append(store) {
      let item = createElement(store);
      injectorHTML(state, item, item_class, ['#titleSection'], false, true);
      console.log("moduleLQS update", store);
    }

    append()
    initializeUpdate()
    document.addEventListener("DOMContentLoaded", initializeUpdate)
    observeClassChanges("body", initializeUpdate)
  }
}
