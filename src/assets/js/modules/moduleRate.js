import injectorHTML from "../tools/injectorHTML";


// Rate extension popup
export default function moduleRate(state) {
  if (state) {
    let timeout0;
    const APPEAR_TIMEOUT = 0;
    const MAX_CLOSE_COUNT = 40000;
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
      return "chrome";
    }

    const initRateMePopup = () => {
      const browser = detectBrowser();

      if (browser && STORE_LINKS[browser]) {
        browser_cr.storage.local.get('closeCount', function (data) {
          const item = document.createElement('div');
          const isShow = !data.closeCount || data.closeCount < MAX_CLOSE_COUNT

          if (!data.closeCount)
            browser_cr.storage.local.set({ 'closeCount': 0 });

          if (isShow) {
            let logo = browser_cr.runtime.getURL('assets/img/logo.svg');
            item.setAttribute('id', "ext_show");
            item.innerHTML = `<div> <div class="groupl"> ${logo ? `<img src="${logo}" alt="logo"/>` : ''} <div> <h1>It would really help.</h1> </div></div> <p>If you enjoy using this extension, would you mind rate it on the webstore, then?</p> <a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink" data-action="RATE">Rate it</a> <div class="cls"> <span id="closeNotification" data-action="CLOSE" style="cursor: pointer;">No, Thanks</span> </div> </div> <style id="43ggfdbt5rf"> #ext_show img, #ext_show p { user-select: none; pointer-events: none; } #ext_show h1 { width: 100%; display: block; text-align: left; color: #ffffff!important; font-weight: 600; font-weight: 500; font-size: 21px; line-height: 21px; margin:0; } #ext_show .groupl { display: flex; align-items: center; justify-content: center; margin: 10px 0; } #ext_show h1.first { margin-bottom: 5px; } #ext_show p { max-width: 290px; font-size: 14px; font-size: 12.8px; font-weight: 400; margin: 8px 0 16px; color: #868b90!important; line-height: 140%; text-align: center; } #ext_show a { text-decoration: none!important; display: block; border: 1px solid rgb(68, 86, 91, 0.5); border-radius: 22px; padding: 7px 10px; margin: 10px auto; max-width: 270px; background-color: rgba(255,255,255, 0.16)!important; color: white!important; text-align: center; } #ext_show a:hover { text-decoration: none; background-color: rgba(255,255,255, 0.1)!important; } #ext_show a:focus { text-decoration: none; } #ext_show > div { transform: scale(1);  box-shadow: rgba(0, 0, 0, 0.8) 0px 8px 24px; z-index: 100000!important;   font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; width: 296px; position: fixed; top: 10px; right: 10px; background-color: #161515!important; background-color: rgb(22, 21, 21, 0.96)!important; padding: 5px 12px 8px; box-sizing: border-box; border: 1px solid rgb(68, 86, 91, 0.5); z-index: 100; border-radius: 12px } #ext_show img { margin-right: 10px; margin-left: -10px; height: 33px; width: auto; max-width: 40px; box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15); } #ext_show .cls { display: flex; justify-content: center; } #closeNotification { display: inline-block; margin: 0 auto; padding-left: 4px; text-align: center; font-size: 11px; font-size: 10.5px; color: #72767a!important; } #closeNotification:hover { text-decoration: underline; } </style> `;
            item.addEventListener("click", (e) => {
              let action = e.target.getAttribute("data-action");
              switch (action) {
                case "RATE":
                  browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
                  item.style.display = 'none';
                  break;
                case "CLOSE":
                  browser_cr.storage.local.set({ 'closeCount': data.closeCount + 1 });
                  item.style.display = 'none';
              }
            })
          };

          // Injection part 
          function onInject() {
            injectorHTML(isShow, item, 'ext_show__edf3235a-d1d3-4d2d-8c15-76ce4202c010__gw', 'root')
          }
          clearTimeout(timeout0)
          timeout0 = setTimeout(onInject, APPEAR_TIMEOUT);
        })
      }
    };
    // Initialization part 
    initRateMePopup()
  } else {
    injectorHTML(state, null, 'ext_show__edf3235a-d1d3-4d2d-8c15-76ce4202c010__gw', 'root')
  }
}


