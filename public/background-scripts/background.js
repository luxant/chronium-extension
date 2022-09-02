'use strict';

let remainingTime, intervalId, targetUrl;

chrome.runtime.onMessage.addListener((message, sender, callback) => {

  switch(message.command) {
    case "enable":
      clearInterval(intervalId);

      remainingTime = message.timeToRefresh;

      intervalId = setInterval(() => {
        chrome.action.setBadgeText({ 
          text: `${remainingTime--}`,
          tabId: message.tabId,
        });

        if (remainingTime <= 0) {
          remainingTime = message.timeToRefresh;
          sendRedirectMessage(message.tabId, message.targetUrl);
        }
      }, 1000);
      break;
    case "disable":
      clearInterval(intervalId);
      intervalId = 0;

      chrome.action.setBadgeText({ 
        text: "",
        tabId: message.tabId,
      });
      break;
    case "isEnabled":
      callback(!!intervalId);
      break;
    case "keepAlive":
      chrome.tabs.sendMessage(message.tabId, { type: "keepAlive" });
      break;
  }
})

function sendRedirectMessage(tabId, url) {
  chrome.tabs.sendMessage(tabId, {
    type: "redirect",
    targetUrl: url 
  });
}

chrome.runtime.onInstalled.addListener(async () => {

  console.log(`### background.js - Inserting script  ####`);

  for (const contentScripts of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: contentScripts.matches })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: contentScripts.js,
      });
    }
  }
});