import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";
import navigateOrSwitch from "../tools/navigateOrSwitch";

export default function moduleOverlay(state) {
  const item = document.createElement("div"),
    item_class = "ov__465787af-c5ad-4048-895c-0ed384357148_gw",
    exist = document.querySelectorAll("." + item_class)?.length

  function onPreferences(e) {
    if (e.target.id === "gw__overlay-button") {
      navigateOrSwitch('content/preferences.html', item_class, true)
    }
  }

  if (state && !exist) {
    item.innerHTML = `<div id="gw__overlay"><button id="gw__overlay-button"><span>Open Settings</span><img src="${getLogo()}"></button><style>
    #gw__overlay {
      position: fixed;
      bottom: 10vh;
      right: -60px;
      width: 102px;
      background: #353c40;
      
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;
      border-top-left-radius: 14px;
      border-bottom-left-radius: 14px;
      cursor: pointer;
      font-size: 12px;
      opacity: 1;
      transition: transform 400ms ease, opacity 400ms ease 0ms;
    }

    #gw__overlay:hover {
      opacity: 0.8;
      transform: translateX(-60px);
    }

    #gw__overlay-button {display: flex;align-items: center;justify-content: flex-end;flex-direction: row-reverse;height: 42px;}#gw__overlay img,#gw__overlay span {pointer-events: none;user-select: none;}#gw__overlay span {margin-right: 5px;}#gw__overlay img {width: 34px;height: 34px;margin: 4px;}#gw__overlay-button {color: #fff;background: none;border: none;padding: 0;cursor: pointer;} </style></div>`;
    document.removeEventListener("click", onPreferences)
    document.addEventListener("click", onPreferences)
  }
  else {
    document.removeEventListener("click", onPreferences)
  }


  injectorHTML(state, item, item_class, "root")
}