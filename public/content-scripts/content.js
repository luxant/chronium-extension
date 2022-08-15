"use strict"

chrome.runtime.onMessage.addListener(request => window.location = request.targetUrl);