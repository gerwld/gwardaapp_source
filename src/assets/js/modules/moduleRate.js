import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";


// Rate extension popup
export default function moduleRate(state) {
  let timeout0;
  let closeCountGlob = 0;
  const APPEAR_TIMEOUT = 10000000000000;
  const MAX_CLOSE_COUNT = 4;
  const browser_cr = chrome ? chrome : browser;
  const STORE_LINKS = {
    "chrome": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
    "firefox": "https://addons.mozilla.org/en-US/firefox/addon/GwardaApp/reviews/",
    "edge": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write",
    "opera": "https://chromewebstore.google.com/detail/ijkboaojikgaanlgigobkmbpnjgjljnc/reviews/write"
  }
  const item_class = 'ext_show__edf3235a-d1d3-4d2d-8c15-76ce4202c010__gw',
    exist = document.querySelectorAll("." + item_class)?.length

  if (state && !exist) {
    let browser = detectBrowser();
    let item = createItem();

    function detectBrowser() {
      const agent = navigator.userAgent;
      if (agent.includes("Edg")) return "edge";
      if (agent.includes("OPR")) return "opera";
      if (agent.includes("Chrome")) return "chrome";
      if (agent.includes("Firefox")) return "firefox";
      return "chrome";
    }

    function createItem() {
      let logo = getLogo();
      const item = document.createElement('div');
      item.innerHTML = `
      
      <div id="ext_show"><div><div class="groupl">${logo ? `<img src = "${logo}" alt = "logo" /> ` : ''}
      <h1>It would really help.</h1></div><p>If you enjoy using this extension,
      would you mind rate it on the webstore,
      then?</p><a href="${STORE_LINKS[browser]}" target="_blank" id="rateLink" data-action="RATE">Rate it</a><div class="cls"><span id="closeNotification" data-action="CLOSE" style="cursor: pointer;">No,
      Thanks</span></div></div></div><style id="43ggfdbt5rf">#ext_show img,
      #ext_show p {
        user-select: none;
        pointer-events: none;
      }

      #ext_show h1 {
        display: block;
        text-align: left;
        color: #ffffff !important;
        font-weight: 600;
        font-weight: 500;
        font-size: 21px;
        line-height: 21px;
        margin: 0;
      }

      #ext_show .groupl {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 0 10px -5px;
      }

      #ext_show h1.first {
        margin-bottom: 5px;
      }

      #ext_show p {
        max-width: 290px;
        font-size: 14px;
        font-size: 12.8px;
        font-weight: 400;
        margin: 8px 0 16px;
        color: #868b90 !important;
        line-height: 140%;
        text-align: center;
      }

      #ext_show a {
        text-decoration: none !important;
        display: block;
        border: 1px solid rgb(68, 86, 91, 0.5);
        border-radius: 22px;
        padding: 7px 10px;
        margin: 10px auto;
        max-width: 270px;
        background-color: rgba(255, 255, 255, 0.16) !important;
        color: white !important;
        text-align: center;
        font-size: 14px;
        font-size: 14.5px;
      }

      #ext_show a:hover {
        text-decoration: none;
        background-color: rgba(255, 255, 255, 0.1) !important;
      }

      #ext_show a:focus {
        text-decoration: none;
      }

      #ext_show>div {
        transform: scale(1);
        box-shadow: rgba(0, 0, 0, 0.8) 0px 8px 24px;
        z-index: 100000 !important;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        width: 296px;
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #161515 !important;
        background-color: rgb(22, 21, 21, 0.96) !important;
        padding: 5px 12px 8px;
        box-sizing: border-box;
        border: 1px solid rgb(68, 86, 91, 0.5);
        z-index: 100;
        border-radius: 12px
      }

      #ext_show img {
        margin-right: 10px;
        height: 33px;
        width: auto;
        max-width: 40px;
        box-shadow: 0 2px 2px 2px rgb(33, 33, 30, 0.15);
      }

      #ext_show .cls {
        display: flex;
        justify-content: center;
      }

      #closeNotification {
        display: inline-block;
        margin: 0 auto;
        padding-left: 4px;
        text-align: center;
        font-size: 11px;
        font-size: 10.5px;
        color: #72767a !important;
      }

      #closeNotification:hover {
        text-decoration: underline;
      }

      </style>
        `;

      item.removeEventListener("click", onRateClick)
      item.addEventListener("click", onRateClick)
      return item;
    }

    function onRateClick(e) {
      let action = e.target.getAttribute("data-action");
      switch (action) {
        case "RATE":
          browser_cr.storage.local.set({ 'closeCount': MAX_CLOSE_COUNT + 1 });
          item.style.display = 'none';
          break;
        case "CLOSE":
          browser_cr.storage.local.set({ 'closeCount': closeCountGlob + 1 });
          item.style.display = 'none';
      }
    }

    const getCurrentState = () => {
      if (browser && STORE_LINKS[browser]) {
        browser_cr.storage.local.set({ 'closeCount': 0 })
        browser_cr.storage.local.get('closeCount', ({ closeCount }) => {
          const isShow = !closeCount || closeCount < MAX_CLOSE_COUNT
          closeCountGlob = (closeCount ? closeCount : 0)

          function onInject() {
            injectorHTML(isShow, item, item_class, 'root')
          }

          clearTimeout(timeout0)
          timeout0 = setTimeout(onInject, APPEAR_TIMEOUT);
        })
      }
    };

    // Entry Point. Checks state and is closeCount < MAX_CLOSE_COUNT shows popup with delay.
    getCurrentState();
  }
}


