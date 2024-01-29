(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("keywords__form");
    let debounceTimer, requestCounter = 0, isSubmitting = false, combinedResults = [];

    function onSubmit(e) {
      e.preventDefault();
      if (isSubmitting)
        return;

      const formData = new FormData(form);
      const payload = Object.fromEntries([...formData.entries()]);
      const originalKeywordInput = payload.prefix.trim();
      const marketplaceInput = payload.marketplace;

      if (!originalKeywordInput) {
        displayError("Keyword cannot be empty");
        return;
      }

      if (!marketplaceInput || marketplaceInput === "_") {
        displayError("Marketplace cannot be empty");
        return;
      }

      clearError();
      isSubmitting = true;
      requestCounter++;

      // Clear existing results
      combinedResults = [];

      // Adjusted initial timeout to 0 for immediate submission
      const initialTimeout = requestCounter === 1 ? 0 : 300;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Single request
        performRequest(payload, originalKeywordInput);
      }, initialTimeout);
    }


    function performRequest(payload, keywordInput) {
      const CLIENT_INFO = "gwarda-amazon-research";
      const ALIAS = "aps";
      const amazon_d = {
        "CA": {
          "id": "A2EUQ1WTGCTBG2",
          "site": "amazon.ca"
        },
        "US": {
          "id": "ATVPDKIKX0DER",
          "site": "amazon.com"
        },
        "MX": {
          "id": "A1AM78C64UM0Y8",
          "site": "amazon.com.mx"
        },
        "ES": {
          "id": "A1RKKUPIHCS9HS",
          "site": "amazon.es"
        },
        "UK": {
          "id": "A1F83G8C2ARO7P",
          "site": "amazon.co.uk"
        },
        "FR": {
          "id": "A13V1IB3VIYZZH",
          "site": "amazon.fr"
        },
        "BE": {
          "id": "AMEN7PMS3EDWL",
          "site": "amazon.be"
        },
        "NL": {
          "id": "A1805IZSGTT6HS",
          "site": "amazon.nl"
        },
        "DE": {
          "id": "A1PA6795UKMFR9",
          "site": "amazon.de"
        },
        "IT": {
          "id": "APJ6JRA9NG5V4",
          "site": "amazon.it"
        },
        "SE": {
          "id": "A2NODRKZP88ZB9",
          "site": "amazon.se"
        },
        "ZA": {
          "id": "AE08WJ6YKNBMC",
          "site": "amazon.co.za"
        },
        "PL": {
          "id": "A1C3SOZRARQ6R3",
          "site": "amazon.pl"
        },
        "EG": {
          "id": "ARBP9OOSHTCHU",
          "site": "amazon.eg"
        },
        "TR": {
          "id": "A33AVAJ2PDY3EV",
          "site": "amazon.com.tr"
        },
        "SA": {
          "id": "A17E79C6D8DWNP",
          "site": "amazon.sa"
        },
        "AE": {
          "id": "A2VIGQ35RCS4UG",
          "site": "amazon.ae"
        },
        "IN": {
          "id": "A21TJRUUN4KGV",
          "site": "amazon.in"
        },
        "SG": {
          "id": "A19VAU5U5O7RUS",
          "site": "amazon.sg"
        },
        "AU": {
          "id": "A39IBJ37TRP1C6",
          "site": "amazon.com.au"
        },
        "JP": {
          "id": "A1VC38T7YXB528",
          "site": "amazon.co.jp"
        }
      }
      const MID = amazon_d[payload.marketplace].id;


      const completionApiUrl = `https://completion.${amazon_d[payload.marketplace].site}/api/2017/suggestions?mid=${encodeURIComponent(MID)}&alias=${encodeURIComponent(ALIAS)}&client-info=${encodeURIComponent(CLIENT_INFO)}&prefix=${encodeURIComponent(keywordInput)}`;

      let localDebounceTimer;

      // Increment the request counter
      const currentRequestCounter = ++requestCounter;

      fetch(completionApiUrl)
        .then(response => response.json())
        .then(data => {
          // Check if the input value has changed since the request was initiated
          if (keywordInput === requestInput.value.trim() && requestCounter === currentRequestCounter) {
            // Combine results from each request
            combinedResults = combinedResults.concat(data.suggestions);
            // Filter and update results
            updateResults(combinedResults, data.prefix);
          }
        })
        .catch(error => {
          console.error("Error:", error);
        })
        .finally(() => {
          if (localDebounceTimer) {
            clearTimeout(localDebounceTimer);
            localDebounceTimer = setTimeout(() => {
              onSubmit(new Event('submit'));
            }, 100);
          }

          // Only reset isSubmitting if this is the last completed request
          if (requestCounter === currentRequestCounter) {
            isSubmitting = false;
          }
        });
    }

    function updateResults(combinedResults, prefix) {
      const kwResContent = document.getElementById("kwres_content");
      // Clear existing content
      kwResContent.innerHTML = '';

      // Use a Set to keep track of unique values
      const uniqueValues = new Set();

      // Iterate through suggestions and add unique ones to the Set
      combinedResults.forEach((suggestion, index) => {
        if (suggestion.value && !uniqueValues.has(suggestion.value)) {
          uniqueValues.add(suggestion.value);

          const kwResItem = document.createElement("div");
          kwResItem.classList.add("kwres__item");

          kwResItem.innerHTML = `
            <span class="kwres__count">${index + 1}</span>
            <span class="kwres__count">${suggestion.value}</span>
            <span class="kwres__count">${prefix || '-'}</span>
            <span class="kwres__count">${index || '0'}</span>
          `;

          kwResContent.appendChild(kwResItem);
        }
      });
    }


    function displayError(message) {
      const errorSpan = document.getElementById("error-message");
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    }

    function clearError() {
      const errorSpan = document.getElementById("error-message");
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
    }

    const requestInput = document.getElementsByName("prefix")[0];
    requestInput.addEventListener("input", clearError);

    const marketplaceSelect = document.getElementsByName("marketplace")[0];
    marketplaceSelect.addEventListener("change", clearError);

    form.addEventListener("submit", onSubmit, false);
  });
})();
