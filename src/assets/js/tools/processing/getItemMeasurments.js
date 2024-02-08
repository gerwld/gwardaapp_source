export default function findItemMeasurments(current = document) {
  let data_items = [
    current.querySelector("#productDetails_feature_div")?.innerHTML || "",
    current.querySelector("#prodDetails")?.innerHTML || "",
    current.querySelector("#detailBulletsWithExceptions_feature_div")?.innerHTML || "",
    current.querySelector("#detailBullets_feature_div")?.innerHTML || "",
    current.querySelector("#productDetailsNonPets_feature_div")?.innerHTML || "",
    current.querySelector("#detailBulletsWithExceptions_feature_div")?.innerHTML || "",
    current.querySelectorAll("#detailBullets_feature_div")?.innerHTML || "",
  ];
  let descriptionBlock = data_items.join(" ");
  const weight_suffix = ["ounces", " ounce", " pound", " pounds", " ton", " tons", " lbs", " gram", " grams", " kilogram", " kilograms", " kg", " milligram", " milligrams", " mg"];
  const ms_suffix = ["inches", " inch", " in", " foot", " feet", " ft", " centimeter", " centimeters", " cm", " meter", " meters", " m", " millimeter", " millimeters", " mm"];

  const data = descriptionBlock.trim().split(/[;:\n\t<>]/).map(e => e?.replace(/[^a-zA-Z0-9 .\\|\/]/g, " ")?.replace(/\s+/g, ' ')?.trim()?.toLowerCase()).filter(Boolean);
  const weight = data.filter(str =>
    weight_suffix.some(suffix => str.endsWith(suffix)) && str.split(' ').some(sb => !isNaN(sb) && str !== "")
  );
  const dimentsion = data.filter(str =>
    ms_suffix.some(suffix => str.endsWith(suffix) && str.split(' ').some(sb => !isNaN(sb)) && str !== "" && str.includes("x"))
  )
  return { "weight": weight[0], "measure": dimentsion[0] };
}