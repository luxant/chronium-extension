import './App.css';

import React, { useState, useEffect } from 'react';

const TIME_TO_REFRESH = 3 * 60; // min * sec
const TARGET_URL = "https://microsoft.com/devicelogin";

function App() {
  const [isExtensionOn, setIsExtensionOn] = useState(null);
  const [tabId, setTabId] = useState(null);
  const [userTimeToRefresh, setUserTimeToRefresh] = useState(TIME_TO_REFRESH);
  const [inputUserTimeToRefreshValue, setInputUserTimeToRefreshValue] = useState(TIME_TO_REFRESH);

  // Load current tab id
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      setTabId(tabs[0].id);
    });
  }, []);

  // To figure out the state the buttons should be
  useEffect(() => {
    chrome.runtime.sendMessage({
      command: "isEnabled",
      tabId: tabId
    }, isEnabled => {
      setIsExtensionOn(isEnabled);
    });
  }, []);

  // To keep alive the connection between the extension and the content script
  useEffect(() => {
    if (!tabId) {
      return;
    }

    const interval = setInterval(() => {
      sentKeepAlive();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [tabId]);

  // Methods

  function enableRedirectionForCurrentTab() {
    chrome.runtime.sendMessage({
      command: "enable",
      tabId: tabId,
      timeToRefresh: userTimeToRefresh,
      targetUrl: TARGET_URL
    });

    setIsExtensionOn(true);
  }

  function disableRedirectionForCurrentTab() {
    chrome.runtime.sendMessage({
      command: "disable",
      tabId: tabId
    });
    
    setIsExtensionOn(false);
  }


  function onUserTimeToRefreshInputChange(event) {
    setInputUserTimeToRefreshValue(event.target.value);

    const parsedValue = Number.parseInt(event.target.value);

    if (Number.isInteger(parsedValue)) {
      setUserTimeToRefresh(parsedValue)
    }
  }

  return (
    <>
      <button 
        type='button'
        disabled={isExtensionOn === true}
        onClick={enableRedirectionForCurrentTab}>Enable</button>
      <button
        type='button'
        class="margin-top"
        onClick={disableRedirectionForCurrentTab} 
        disabled={!isExtensionOn}
        >Disable</button>

        <input type="text" placeholder='Enter seconds' className='margin-top' value={inputUserTimeToRefreshValue} onChange={onUserTimeToRefreshInputChange} />
    </>
  );
}

chrome.runtime.onMessage.addListener(message => {
  chrome.tabs.sendMessage(message.tabId, message);
});

export default App;
