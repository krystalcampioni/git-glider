import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import "webextension-polyfill";

reloadOnUpdate("pages/background");
console.log("background loaded");

// import disableIcon from "../../assets/img/disabled.png";

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   chrome.action.disable(tabId);

//   if (changeInfo.status === "complete") {
//     console.log("tab updated on github");
//     if (tab.url.includes("https://github.com")) {
//       chrome.action.enable(tabId);

//       console.log("background loaded");
//     } else {
//       chrome.action.disable(tabId);
//       chrome.action.setIcon({ path: disableIcon, tabId });
//     }
//   }
// });

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

console.log("background loaded");

reloadOnUpdate("pages/content/style.scss");
reloadOnUpdate("pages/content/ui/components/StarLoader.scss");
