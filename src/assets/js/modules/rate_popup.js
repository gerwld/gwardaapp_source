

// Rate extension popup
export default function rateExtension() {
  const APPEAR_TIMEOUT = 10 * 1000 * 600;
  const MAX_CLOSE_COUNT = 4;
  const browser_cr = chrome ? chrome : browser;
  const STORE_LINKS = {
    "chrome": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
    "firefox": "https://addons.mozilla.org/en-US/firefox/addon/GwardaApp/reviews/",
    "edge": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
    "opera": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write"
  }

  function detectBrowser() {
    const agent = navigator.userAgent;
    if (agent.includes("Edg")) return "edge";
    if (agent.includes("OPR")) return "opera";
    if (agent.includes("Chrome")) return "chrome";
    if (agent.includes("Firefox")) return "firefox";

    // Default to Chrome
    return "chrome";
  }

  const initRateMePopup = () => {
    const browser = detectBrowser();

    if (browser && STORE_LINKS[browser]) {
      browser_cr.storage.local.get('closeCount', function (data) {

        if (!data.closeCount)
          browser_cr.storage.local.set({ 'closeCount': 0 });

        if (!data.closeCount || data.closeCount < MAX_CLOSE_COUNT) {
          const notification = document.createElement('div');
          const logo = browser_cr.runtime.getURL('assets/img/logo.svg');
          notification.setAttribute('id', "ext_show");
          notification.innerHTML = `<div> <div class="groupl"> ${logo ? `<img src="${logo}" alt="logo"/>` : ''} <div> <h1>It would really help.</h1> </div></div> <p>If you enjoy using this extension, would you mind rate it on the webstore, then?</p> <a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink">Rate it</a> <div class="cls"> <span id="closeNotification" style="cursor: pointer;">No, Thanks</span> </div> </div> <style id="43ggfdbt5rf"> #ext_show img, #ext_show p { user-select: none; pointer-events: none; } #ext_show h1 { width: 100%; display: block; text-align: left; color: #ffffff!important; font-weight: 600; font-weight: 500; font-size: 21px; line-height: 21px; margin:0; } #ext_show .groupl { display: flex; align-items: center; justify-content: center; margin: 10px 0; } #ext_show h1.first { margin-bottom: 5px; } #ext_show p { max-width: 290px; font-size: 14px; font-size: 12.8px; font-weight: 400; margin: 8px 0 16px; color: #868b90!important; line-height: 140%; text-align: center; } #ext_show a { text-decoration: none!important; display: block; border: 1px solid rgb(68, 86, 91, 0.5); border-radius: 22px; padding: 7px 10px; margin: 10px auto; max-width: 270px; background-color: rgba(255,255,255, 0.16)!important; color: white!important; text-align: center; } #ext_show a:hover { text-decoration: none; background-color: rgba(255,255,255, 0.1)!important; } #ext_show a:focus { text-decoration: none; } #ext_show > div { transform: scale(0.92);  box-shadow: rgba(149, 157, 165, 1) 0px 8px 24px; z-index: 100000!important;   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; width: 296px; position: fixed; top: 10px; right: 10px; background-color: #161515!important; background-color: rgb(22, 21, 21, 0.96)!important; padding: 5px 12px 15px; box-sizing: border-box; border: 1px solid rgb(68, 86, 91, 0.5); z-index: 100; border-radius: 12px } #ext_show img { margin-right: 10px; margin-left: -10px; height: 33px; width: auto; max-width: 40px; box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15); } #ext_show .cls { display: flex; justify-content: center; } #closeNotification { display: inline-block; margin: 0 auto; padding-left: 4px; text-align: center; font-size: 11px; font-size: 10.5px; color: #72767a!important; } #closeNotification:hover { text-decoration: underline; } </style> `;

          const appendPopup = () => {
            document.body.appendChild(notification);

            // Event listener for close
            const closeBtn = document.getElementById('closeNotification');
            if (closeBtn) {
              closeBtn.addEventListener('click', function () {
                browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                notification.style.display = 'none';
              });
            }

            // Event listener for rate
            const rateLink = document.getElementById('rateLink');
            if (rateLink) {
              rateLink.addEventListener('click', function () {
                browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                notification.style.display = 'none';
              });
            }
          }
          setTimeout(appendPopup, APPEAR_TIMEOUT);
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", initRateMePopup, false);
}
