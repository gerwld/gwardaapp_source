// import { DOMParser } from 'linkedom';

// const { document } = new DOMParser().parseFromString('<html></html>', 'text/html');

export default function getMainImageBgColor(imageElement) {
  return new Promise((resolve, reject) => {
    if (!imageElement || !imageElement.src) {
      resolve(null);
      return;
    }

    let img = new Image();
    img.crossOrigin = 'Anonymous';

    // Existing image element as the source
    img.src = imageElement.src;

    img.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      let imageData = ctx.getImageData(0, 0, 2, 1); // Sample a 2x1 region
      let pixelColorLeft = imageData.data.slice(0, 3); // Top-left corner
      let pixelColorRight = imageData.data.slice(4, 7); // Top-right corner

      let averageColor = [
        Math.round((pixelColorLeft[0] + pixelColorRight[0]) / 2),
        Math.round((pixelColorLeft[1] + pixelColorRight[1]) / 2),
        Math.round((pixelColorLeft[2] + pixelColorRight[2]) / 2)
      ];

      let colorName = getColorName(averageColor);
      resolve(colorName);
      img = null;
    };

    img.onerror = () => {
      img = null;
      resolve(null); // Resolve with null on error
    };
  });
}


function getColorName(rgb) {
  // Defining color ranges 
  const colorRanges = {
    red: [255, 0, 0],
    orange: [255, 165, 0],
    yellow: [255, 255, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    indigo: [75, 0, 130],
    violet: [148, 0, 211],
    white: [255, 255, 255],
    gray: [128, 128, 128],
    black: [0, 0, 0],
  };

  // Find the closest color range
  let closestColor = 'unknown';
  let minDistance = Number.MAX_SAFE_INTEGER;

  for (const [color, range] of Object.entries(colorRanges)) {
    const distance = calculateColorDistance(rgb, range);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return closestColor;
}

function calculateColorDistance(color1, color2) {
  // Simple Euclidean distance between two colors
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}
