export default async function getbyASIN(arr, callback) {
  const maxRetries = 3;
  const results = [];

  for (let i = 0; i < arr.length; i++) {
    let retries = 0;

    while (retries < maxRetries) {
      const url = `https://www.amazon.com/dp/${arr[i]}?psc=1`;

      try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.text();
          results.push({ asin: arr[i], data }); // Create an object with ASIN and fetched data
          callback({ asin: arr[i], data }); // Pass the object to the callback function
          break; // Break out of the retry loop if the response is valid
        } else {
          retries++;
        }
      } catch (error) {
        retries++;
      }

      if (retries === maxRetries) {
        console.log(`Failed to fetch data for ${url} after ${maxRetries} retries.`);
      }
    }
  }

  return results; // Return the array of objects with ASIN and fetched data
}
