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
  }
})

function sendRedirectMessage(tabId, url) {
  chrome.tabs.sendMessage(tabId, { targetUrl: url });
}