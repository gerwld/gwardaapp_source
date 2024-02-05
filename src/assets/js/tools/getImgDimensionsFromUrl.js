import { parseHTML } from 'linkedom';

export default async function getImageDimensionsFromURL(imageURL) {
  return new Promise((resolve) => {
    if (!imageURL) {
      resolve('unknown');
    }
    // Fetch the HTML content of the page
    fetch(imageURL)
      .then(response => response.text())
      .then(html => {
        // Parse the HTML using linkedom
        const { document } = parseHTML(html);
        // Find the image element
        const imgElement = document.querySelector('img');
        if (imgElement) {
          // Extract width and height attributes
          const width = imgElement.getAttribute('width') || imgElement.width;
          const height = imgElement.getAttribute('height') || imgElement.height;

          resolve(`${width} x ${height}`);
        } else {
          resolve('unknown');
        }
      })
      .catch(error => {
        console.error('Error fetching or parsing HTML:', error);
        resolve('unknown');
      });
  });
}
