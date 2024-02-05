import lazyFindElements from "./lazyFindElements";
import getMainImageBgColor from "./getMainImageBgColor";
import getLQS from "./getLQS";
import trimTags from "./trimTags";
import getImageDimensionsFromURL from "./getImgDimensionsFromUrl";

export default function getItemData(callback, find, current = document, isBackend) {
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
      const result = await lazyFindElements(find, current, 21, 400);

      const main_img = result["#altImages>ul"]?.querySelector("li.imageThumbnail img") || null;
      const hires_img = result["#imgTagWrapperId img"]?.getAttribute("data-old-hires") || null;

      const bg_color = main_img ? await getMainImageBgColor(main_img) : null;
      let main_dimensions;
      if (!isBackend)
        main_dimensions = hires_img ? await getImageDimensionsFromURL(hires_img, isBackend) : null;

      const f = {
        title: result["#productTitle"]?.innerHTML.trim().length || null,
        bullets: result["#feature-bullets ul"]?.querySelectorAll("li").length || null,
        description: trimTags(result["#productDescription"]?.innerHTML)?.length || null,
        ratings_total: result["#acrCustomerReviewText"] ? parseFloat(result["#acrCustomerReviewText"].innerHTML.split(" ")[0]) || null : null,
        rating_avg: parseFloat(trimTags(result["#acrPopover .a-declarative"]?.innerHTML)?.split(" ")[0]) || null,
        images_total: result["#altImages>ul"]?.querySelectorAll("li.imageThumbnail").length || null,
        brand_content: (result["#productDescription"]?.querySelectorAll("img").length || 0) + (result["#aplus"]?.querySelectorAll("img").length || 0) || null,
        main_dimensions: main_dimensions || null,
        main_bg: bg_color || null
      };

      let lqs = getLQS(f) || null;
      let store = { ...f, lqs };

      if (callback) callback(store);
      resolve(store);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
