export default function getImageDimensions(imgNode) {
  if (imgNode && imgNode.tagName === 'IMG') {
    const width = imgNode.width;
    const height = imgNode.height;
    return `${width} x ${height}`;
  } else {
    return 'unkown';
  }
}