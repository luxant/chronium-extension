"use strict"

chrome.runtime.connect();

chrome.runtime.onMessage.addListener(message => {
    if (message.type == "redirect") {
        console.log(`### reloaded at ${new Date()}  ####`);
        window.location = message.targetUrl;
    }
});

setInterval(() => {
    chrome.runtime.sendMessage({});
}, 10 * 1000);