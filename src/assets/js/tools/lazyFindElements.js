function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function lazyFindElements(elementSelectors, maxAttempts = 20, delayTime = 400) {
  let attempts = 0;
  let foundElements = {};

  while (attempts < maxAttempts) {
    for (const selector of elementSelectors) {
      if (!foundElements[selector]) {
        const element = document.querySelector(selector);
        if (element !== null) {
          foundElements[selector] = element;
        }
      }
    }

    const foundValues = Object.values(foundElements);
    if (foundValues.length === elementSelectors.length && foundValues.every(element => element !== null)) {
      return Promise.resolve(foundElements);
    }


    await delay(delayTime);
    attempts++
  }

  const filteredFoundElements = Object.fromEntries(
    Object.entries(foundElements).filter(([_, element]) => element !== null)
  );

  return Object.keys(filteredFoundElements).length > 0
    ? Promise.resolve(filteredFoundElements)
    : Promise.reject(new Error("No elements found within the specified attempts."));
}