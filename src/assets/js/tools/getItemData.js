import getLQS from "./getLQS";
import trimTags from "./trimTags";
import lazyFindElements from "./lazyFindElements";
import getMainImageBgColor from "./processing/getMainImageBgColor";
import getImageDimensionsFromURL from "./processing/getImgDimensionsFromUrl";
import findItemMeasurments from "./processing/getItemMeasurments";
import findItemReleaseDate from "./processing/findItemReleaseDate";

export default function getItemData(callback, find, current = document, maxAttempts = 200, delay = 200) {
  const base = [
    "#productTitle",
    "#feature-bullets ul",
    "#productDescription",
    "#acrCustomerReviewText",
    "#averageCustomerReviews",
    "#acrPopover .a-declarative",
    "#altImages>ul",
    "#imgTagWrapperId img",
    "#aplus",
    "#twister",
    '#corePrice_feature_div'
  ];
  let find_swap = [...find, ...base];
  find = find_swap.filter((e, i) => find_swap.indexOf(e) === i);

  const ms = findItemMeasurments(current) || [];
  const data = findItemReleaseDate(current) || [];

  return new Promise(async (resolve, reject) => {
    try {
      const result = await lazyFindElements(find, current, maxAttempts, delay);

      let main_img = result["#altImages>ul"]?.querySelector("li.imageThumbnail img") || null;
      let hires_img = result["#imgTagWrapperId img"]?.getAttribute("data-old-hires") || null;

      const bg_color = main_img ? await getMainImageBgColor(main_img) : null;
      const main_dimensions = hires_img ? await getImageDimensionsFromURL(hires_img) : null;

      const f = {
        title: result["#productTitle"]?.innerHTML.trim().length || null,
        bullets: result["#feature-bullets ul"]?.querySelectorAll("li").length || null,
        description: (trimTags(result["#productDescription"]?.innerHTML)?.length || 0) + (trimTags(result["#aplus"]?.innerHTML)?.length || 0),
        ratings_total: result["#acrCustomerReviewText"] ? (result["#acrCustomerReviewText"]?.innerText?.replace(",", "")?.split(" ")[0] / 1) || null : null,
        rating_avg: parseFloat(trimTags(result["#acrPopover .a-declarative"]?.innerHTML)?.split(" ")[0]) || null,
        images_total: result["#altImages>ul"]?.querySelectorAll("li.imageThumbnail").length || null,
        brand_content: (result["#productDescription"]?.querySelectorAll("img").length || 0) + (result["#aplus"]?.querySelectorAll("img").length || 0) || null,
        main_dimensions: main_dimensions || null,
        main_bg: bg_color || null,
        variations: result["#twister"]?.querySelectorAll("li").length || null,
        price: result["#corePrice_feature_div"]?.innerText ? result["#corePrice_feature_div"]?.innerText.split(/[;:\n\t<>]/)[0] : null,
        ms,
        ...data
      };

      let lqs = getLQS(f) || null;
      let store = { ...f, lqs };

      console.log("CURRENT STORE:", store);

      if (callback) callback(store);
      resolve(store);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
