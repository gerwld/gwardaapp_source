export default async function getImageDimensionsFromURL(imageURL) {
  return new Promise((resolve, reject) => {
    if (!imageURL) {
      resolve('unknown');
    }
    const imgElement = new Image();

    imgElement.onload = function () {
      const width = imgElement.width;
      const height = imgElement.height;
      resolve(`${width} x ${height}`);
    };

    imgElement.onerror = function () {
      resolve('unknown');
    };

    imgElement.src = imageURL;
  });
}