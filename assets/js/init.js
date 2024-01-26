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
