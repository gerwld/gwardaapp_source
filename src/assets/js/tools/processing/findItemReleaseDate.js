import formatDate from "./formatDate";

export default function findItemReleaseDate(current = document) {
  let data_items = [
    current.querySelector("#productDetails_feature_div")?.innerHTML || "",
    current.querySelector("#prodDetails")?.innerHTML || "",
    current.querySelector("#detailBulletsWithExceptions_feature_div")?.innerHTML || "",
    current.querySelector("#detailBullets_feature_div")?.innerHTML || "",
    current.querySelector("#productDetailsNonPets_feature_div")?.innerHTML || "",
    current.querySelector("#detailBulletsWithExceptions_feature_div")?.innerHTML || "",
    current.querySelectorAll("#detailBullets_feature_div")?.innerHTML || "",
    current.querySelectorAll("#detailBulletsWrapper_feature_div")?.innerHTML || "",
  ];
  let descriptionBlock = data_items.join(" ").toLowerCase();

  const data = descriptionBlock.trim().split(/[;:\n\t<>]/).map(e => e?.replace(/[^a-zA-Z0-9 .\\|\/]/g, " ")?.replace(/\s+/g, ' ')?.trim()).filter(Boolean);
  const date = data.filter(str => {
    if (str.split(" ").length === 3 && str.split(" ").filter(e => !isNaN(e) && e !== "").length === 2) {
      const date = new Date(str);
      return !isNaN(date.getFullYear());
    }
  });
  return { "date": date[0] ? formatDate(new Date(date[0])) : null };
}


