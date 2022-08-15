// called when extension is activated
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  console.log("content.js - request", request);

  window.location = request.targetUrl;

  sendResponse({ fromcontent: "This message is from content.js" });
});