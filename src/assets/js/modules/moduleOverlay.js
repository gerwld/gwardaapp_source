import getLogo from "../tools/getLogo";
import injectorHTML from "../tools/injectorHTML";

export default function moduleOverlay(state) {
  const item = document.createElement("div"),
    item_class = "ov__465787af-c5ad-4048-895c-0ed384357148_gw"

  if (state) {
    item.setAttribute("class", item_class)
    item.innerHTML = `<div id="gw__overlay"><button id="gw__overlay-button"><span>GwardaApp</span><img src="${getLogo()}"></button><style>#gw__overlay {z-index: 9999999;position: fixed;bottom: 10vh;right: 0; width: 115px;background: #353c40;  background: rgb(53, 60, 64, 0.8); font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",  "Helvetica Neue", sans-serif;border-top-left-radius: 14px;border-bottom-left-radius: 14px;cursor: pointer;font-size: 12px;}#gw__overlay-button {display: flex;align-items: center;justify-content: flex-end;flex-direction: row-reverse;height: 42px;transition: opacity 100ms ease;}#gw__overlay img,#gw__overlay span {pointer-events: none;user-select: none;}#gw__overlay span {margin-right: 5px;}#gw__overlay img {width: 34px;height: 34px;margin: 4px;}#gw__overlay-button:hover {opacity: 0.8;}#gw__overlay-button {color: #fff;background: none;border: none;padding: 0;cursor: pointer;} </style></div>`;
  }

  injectorHTML(state, item, item_class, "root")
}