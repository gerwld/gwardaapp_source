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
    if (areaName === "local" && changes.gpState && changes.gpState.newValue && changes.gpState.newValue.lang_set) {
      const newLang = changes.gpState.newValue.lang_set;
      if (newLang !== CURRENT_LANG) {
        await handleLanguage(newLang);
      }
    }
  });

  // Entry point. 
  // If manually selected - then so, else browser lang if so & not beta, otherways english
  const notinbeta = ["en", "de", "es", "pl", "uk", "sv", "ar"];
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




// Settings Part
(() => {
  "use strict";
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const browser_cr = chrome ? chrome : browser;
      const main_nav = document.getElementById("header_nav");

      // LISTENER: Listen for changes in local state with debounce
      let prevstate;
      let updateScheduled = false;
      browser_cr.storage.local.onChanged.addListener((changes, namespace) => {
        if (
          changes.gpState.newValue &&
          JSON.stringify({ ...changes.gpState.newValue }) !== prevstate
        ) {
          prevstate = JSON.stringify({ ...changes.gpState.newValue });
          // Schedule the update if not already scheduled
          if (!updateScheduled) {
            updateScheduled = true;
            setTimeout(() => {
              updateScheduled = false;
              initializeUpdate();
            }, 20);
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