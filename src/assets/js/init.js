(() => {
  "use strict";
  const browser_cr = chrome ? chrome : browser;
  let CURRENT_LANG;
  const translations = {};

  // Init dark mode
  browser_cr.storage.local.get("gpState", (result) => {
    let state = result.gpState;
    if (state["dark_mode"]) document.documentElement.classList.add("dark_mode");
    else document.documentElement.classList.remove("dark_mode");
  });

  // Function to fetch translations for a specific language
  async function fetchTranslations(selectedLanguage) {
    try {
      const response = await fetch(`/_locales/${selectedLanguage}/messages.json`);
      const translationsData = await response.json();
      translations[selectedLanguage] = translationsData;
    } catch (error) {
      console.error(`Error fetching translations for ${selectedLanguage}:`, error);
    }
  }

  // Function to set language and update translations
  function setLanguage(selectedLanguage) {
    let items = document.querySelectorAll("[data-i18n]");
    for (let i = 0; i < items?.length; i++) {
      let translationKey = items[i].getAttribute("data-i18n");
      let translation = translations[selectedLanguage]?.[translationKey]?.message;

      if (translation?.length) {
        if (items[i].value === "i18n") {
          items[i].value = translation;
        } else {
          items[i].innerText = translation;
        }
      }
    }
  }

  // Function to handle language and perform other tasks
  async function handleLanguage(selectedLanguage) {
    CURRENT_LANG = selectedLanguage;
    document.documentElement.setAttribute("lang", selectedLanguage);
    await fetchTranslations(selectedLanguage);
    setLanguage(selectedLanguage);
  }

  browser_cr.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === "local" && changes.gpState && changes.gpState?.newValue && changes.gpState.newValue.lang_set) {
      const newLang = changes.gpState.newValue.lang_set;
      if (newLang !== CURRENT_LANG) {
        await handleLanguage(newLang);
      }
    }
  });

  // Entry point. 
  // If manually selected - then so, else browser lang if so & not beta, otherways english
  const notinbeta = ["en", "de"];
  const browser_lang = navigator?.language?.split("-")[0]?.toLowerCase() || "en"
  browser_cr.storage.local.get("gpState", async (result) => {

    const initialLang =
      result?.gpState?.lang_set ? result.gpState.lang_set
        : browser_lang && notinbeta.indexOf(browser_lang) !== -1 ? browser_lang
          : "en";
    // Init lang if not exist      
    if (!result?.gpState?.lang_set) {
      browser_cr.storage.local.set({ gpState: { ...result.gpState, lang_set: initialLang } })
    }

    await handleLanguage(initialLang);
  });
})();

// Lang / Dark Mode (App settings) Part
(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const browser_cr = chrome ? chrome : browser;
      const main_nav = document.getElementById("header_nav");
      const lang_set = document.getElementById("lang_set");

      // LISTENER: Listen for changes in local state with debounce
      let prevstate;
      let updateScheduled = false;
      browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
        if (
          changes.gpState &&
          changes.gpState?.newValue &&
          JSON.stringify({ ...changes.gpState.newValue }) !== prevstate
        ) {
          prevstate = JSON.stringify({ ...changes.gpState.newValue });
          // Schedule the update if not already scheduled
          if (!updateScheduled) {
            updateScheduled = true;
            setTimeout(() => {
              updateScheduled = false;
              initializeUpdate();
            }, 30);
          }
        }
      });

      // DISPATCH: Defining a custom event
      const gpStateChangeEvent = new CustomEvent("gpStateChange");
      function dispatchStateChangeEvent() {
        window.dispatchEvent(gpStateChangeEvent);
      }

      // UPDATE: Update based on new state
      function initializeUpdate() {
        console.log("gwardaApp: init/initializeUpdate call");
        (() => {
          return new Promise((resolve) => {
            browser_cr.storage.local.get(null, (result) => {
              let gpState = result?.gpState ? result?.gpState : {};
              resolve(gpState);
            })
          })
        })().then((state) => {

          // Function to update menu state
          function updateMenuState(e) {
            let action = e.target.getAttribute("data-action");
            if (action)
              state[action] = !state[action];
            browser_cr.storage.local.get(null, (gs) => {
              browser_cr.storage.local.set({ ...gs, gpState: { ...state } }, dispatchStateChangeEvent);
            })
          }

          // Function to update HTML classes
          function updateHTMLBase() {
            // - dark mode
            if (state["dark_mode"]) document.documentElement.classList.add("dark_mode");
            else document.documentElement.classList.remove("dark_mode");
            // - disable or enable plugin
            if (state["disabled"]) document.body.classList.add("disabled");
            else document.body.classList.remove("disabled");
          }

          // Initializes locale select if exist, and adds event listener to it
          if (lang_set) {
            if ([state['lang_set']])
              lang_set.value = state['lang_set']
            function onUpdateLangState(e) {
              state["lang_set"] = e.target.value || "en";
              browser_cr.storage.local.set({ gpState: state }, dispatchStateChangeEvent);
            }
            lang_set?.addEventListener("change", onUpdateLangState);
          }

          //Add event listener to lang change
          main_nav.addEventListener("click", updateMenuState);

          if (state)
            updateHTMLBase();
        });
      }


      initializeUpdate();
    });
  })();
})();

// Custom select 
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const customSelects = document.querySelectorAll(".custom-select");

    customSelects.forEach((customSelect) => {
      initializeCustomSelect(customSelect);
    });

    // Close all select boxes when the user clicks anywhere outside the select box
    document.addEventListener("click", () => closeAllSelect(null));

    function closeAllSelect(elmnt) {
      const items = document.querySelectorAll(".select-items");
      const selects = document.querySelectorAll(".select-selected");
      const arrNo = Array.from(selects).map((select, index) => (elmnt == select ? index : -1)).filter((index) => index !== -1);
      items.forEach((item, i) => {
        if (!arrNo.includes(i)) {
          item.classList.add("select-hide");
        }
      });

      selects.forEach((select, i) => {
        if (!arrNo.includes(i)) {
          select.classList.remove("select-arrow-active");
        }
      });
    }

    function initializeCustomSelect(customSelect) {
      const selectElement = customSelect.querySelector("select");

      if (!selectElement) return;

      const hiddenImages = customSelect.querySelectorAll(".hidden img");

      const selectedDiv = document.createElement("DIV");
      selectedDiv.setAttribute("class", "select-selected");

      const selectedSpan = document.createElement("SPAN");
      selectedDiv.appendChild(selectedSpan);

      customSelect.appendChild(selectedDiv);

      const optionsDiv = document.createElement("DIV");
      optionsDiv.setAttribute("class", "select-items select-hide");

      Array.from(selectElement.options).slice(1).forEach((option, index) => {
        const optionDiv = document.createElement("DIV");
        optionDiv.innerHTML = option.innerHTML;
        optionDiv.setAttribute("data-value", option.value);

        const correspondingImg = Array.from(hiddenImages).find((img) => img.getAttribute("data-value") === option.value);
        if (correspondingImg) optionDiv.insertBefore(correspondingImg.cloneNode(true), optionDiv.firstChild);

        optionDiv.addEventListener("click", function (e) {
          const target = e.target;
          let s, h;

          s = target.parentNode.parentNode.querySelector("select");
          h = target.parentNode.previousSibling;

          s.value = target.getAttribute("data-value");
          h.innerHTML = target.innerHTML;

          closeAllSelect(h);
        });

        optionsDiv.appendChild(optionDiv);
      });

      customSelect.appendChild(optionsDiv);

      selectedDiv.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(selectedDiv);
        optionsDiv.classList.toggle("select-hide");
        selectedDiv.classList.toggle("select-arrow-active");
      });

      // Add onchange event listener for the original select element
      selectElement.addEventListener("change", function () {
        updateCustomSelect(selectedDiv, selectedSpan, selectElement, hiddenImages);
      });

      // Initial update of custom select based on the initial value of the original select
      updateCustomSelect(selectedDiv, selectedSpan, selectElement, hiddenImages);
    }

    function updateCustomSelect(selectedDiv, selectedSpan, selectElement, hiddenImages) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      selectedSpan.innerHTML = selectedOption ? selectedOption.innerHTML : "";
      const selectedOptionValue = selectedOption ? selectedOption.value : "";
      const correspondingImg = Array.from(hiddenImages).find((img) => img.getAttribute("data-value") === selectedOptionValue);
      if (correspondingImg) {
        selectedDiv.insertBefore(correspondingImg.cloneNode(true), selectedSpan);
      }
    }
  });
})();


(() => {
  "use strict"

  document.addEventListener('DOMContentLoaded', function () {
    var smartLinks = document.querySelectorAll('[data-attr="smart-link"]');
    smartLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var url = this.getAttribute('href');
        var newWindow = window.open(url, "_blank");
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          window.location.href = url;
        }
      });
    });
  });

})()