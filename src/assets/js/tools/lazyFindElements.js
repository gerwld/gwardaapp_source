function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function lazyFindElements(elementSelectors, current = document, maxAttempts = 2000, delayTime = 20) {
  let attempts = 0;
  let foundElements = {};

  while (attempts < maxAttempts) {
    for (const selector of elementSelectors) {
      if (!foundElements[selector]) {
        const element = current.querySelector(selector);
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

  function filterNullElements(obj) {
    const filteredObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null) {
        filteredObj[key] = value;
      }
    }
    return filteredObj;
  }

  const filteredFoundElements = filterNullElements(foundElements)

  if (Object.keys(filteredFoundElements).length > 0) {
    return Promise.resolve(filteredFoundElements)
  } else {
    console.warn("lazyFindElements elements not found:", [foundElements, filteredFoundElements])
    return Promise.resolve({ isError: true });
  }
}