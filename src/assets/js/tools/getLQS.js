export default function getLQS({ title, bullets, description, ratings_total, rating_avg, images_total, brand_content, main_dimensions, main_bg }) {
  let total = 1;
  if (title && title > 150)
    total += 1.5

  if (bullets && bullets > 4)
    total += 0.7

  if (description && description > 1000)
    total += 0.8
  if (description && description > 1400)
    total += 0.5

  if (ratings_total && ratings_total > 10)
    total += 0.4
  if (ratings_total && ratings_total > 100)
    total += 0.6

  if (rating_avg && rating_avg > 4.0)
    total += 1
  if (rating_avg && rating_avg > 4.78 && ratings_total && ratings_total > 50)
    total += 1

  if (images_total && images_total > 4)
    total += 0.6
  if (images_total && images_total > 6)
    total += 0.4

  if (brand_content && brand_content > 1)
    total += 0.5

  if (main_dimensions && main_dimensions.split(" x")[0] > 1420)
    total += 0.8
  if (main_dimensions && main_dimensions.split(" x")[0] > 1500)
    total += 0.2

  if (main_bg && main_bg === "white" || main_bg === "gray")
    total += 1

  return checkAndRoundFloat(total);
}



function checkAndRoundFloat(number) {
  if (typeof number === 'number' && !isNaN(number) && Number.isFinite(number)) {
    return parseFloat(Math.floor(number * 10) / 10);
  } else {
    return NaN;
  }
}