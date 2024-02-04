import lazyFindElements from "./lazyFindElements";
import getMainImageBgColor from "./getMainImageBgColor";
import getLQS from "./getLQS";
import trimTags from "./trimTags";
import getImageDimensionsFromURL from "./getImgDimensionsFromUrl";

export default function getItemData(callback, find, current = document) {
  const base = [
    "#productTitle",
    "#feature-bullets ul",
    "#productDescription",
    "#acrCustomerReviewText",
    "#averageCustomerReviews",
    "#acrPopover .a-declarative",
    "#altImages>ul",
    "#imgTagWrapperId img",
    "#aplus"
  ];
  let find_swap = [...find, ...base];
  find = find_swap.filter((e, i) => find_swap.indexOf(e) === i);

  return new Promise(async (resolve, reject) => {
    try {
      const result = await lazyFindElements(find, current);

      const main_img = result["#altImages>ul"].querySelectorAll("li.imageThumbnail img")[0] || null;
      const hires_img = result["#imgTagWrapperId img"].getAttribute("data-old-hires");

      const bg_color = await getMainImageBgColor(main_img);
      const main_dimensions = await getImageDimensionsFromURL(hires_img);

      const f = {
        title: result["#productTitle"]?.innerHTML.trim().length || null,
        bullets: result["#feature-bullets ul"]?.querySelectorAll("li").length || null,
        description: trimTags(result["#productDescription"]?.innerHTML)?.length || null,
        ratings_total: result["#acrCustomerReviewText"] ? parseFloat(result["#acrCustomerReviewText"].innerHTML.split(" ")[0]) : NaN,
        rating_avg: parseFloat(trimTags(result["#acrPopover .a-declarative"].innerHTML).split(" ")[0]) || NaN,
        images_total: result["#altImages>ul"].querySelectorAll("li.imageThumbnail").length || NaN,
        brand_content: (result["#productDescription"]?.querySelectorAll("img").length || 0) + (result["#aplus"]?.querySelectorAll("img").length || 0),
        main_dimensions: main_dimensions || NaN,
        main_bg: bg_color
      };

      let lqs = (getLQS(f) || null);
      let store = { ...f, lqs };
      if (callback)
        callback(store);
      resolve(store);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
