import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import "webextension-polyfill";

reloadOnUpdate("pages/background");

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

// ----

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "fillWithFaker",
    title: "Fill with Faker Data",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "fillWithFaker") {
    chrome.tabs.sendMessage(tab.id, { action: "fillWithFaker" });
  }
});
