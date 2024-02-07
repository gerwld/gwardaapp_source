export default async function getImageDimensionsFromURL(imageURL) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = function () {
      resolve(`${this.width} x ${this.height}`);
      img = null;
    };
    img.onerror = function () {
      reject('1400 x 1400');
      img = null;
    };
    img.src = imageURL;
  });
}
