import './App.css';

import React, { useState } from 'react';

const TIME_TO_REFRESH = 3 * 60; // min * sec
const TARGET_URL = "https://microsoft.com/devicelogin";

function App() {
  const [isExtensionOn, setIsExtensionOn] = useState(null);
  const [tabId, setTabId] = useState(null);

  // Load current tab id
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    setTabId(tabs[0].id);
  });

  // To figure out the state the buttons should be
  chrome.runtime.sendMessage({
    command: "isEnabled",
    tabId: tabId
  }, isEnabled => {
    setIsExtensionOn(isEnabled);
  });

  // Methods

  function enableRedireactionForCurrentTab() {
    chrome.runtime.sendMessage({
      command: "enable",
      tabId: tabId,
      timeToRefresh: TIME_TO_REFRESH,
      targetUrl: TARGET_URL
    });

    setIsExtensionOn(true);
  }

  function disableRedireactionForCurrentTab () {
    chrome.runtime.sendMessage({
      command: "disable",
      tabId: tabId
    });
    
    setIsExtensionOn(false);
  }

  chrome.runtime.onMessage.addListener(message => {
    chrome.tabs.sendMessage(message.tabId, { targetUrl: message.targetUrl });
  });

  return (
    <>
      <button 
        type='button'
        disabled={isExtensionOn === true}
        onClick={enableRedireactionForCurrentTab}>Enable</button>
      <button
        type='button'
        class="margin-top"
        onClick={disableRedireactionForCurrentTab} 
        disabled={!isExtensionOn}
        >Disable</button>
    </>
  );
}

export default App;
