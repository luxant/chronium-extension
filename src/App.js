import './App.css';

import React, { useEffect, useState } from 'react';

const TIME_TO_REFRESH = 0.5 * 60; // min * sec


function App() {
  const [isExtensionOn, setIsExtensionOn] = useState(null);
  const [secondsIntervalId, setSecondsIntervalId] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TIME_TO_REFRESH);
  const [tabId, setTabId] = useState(null);

  // Load current tab id
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    setTabId(tabs[0].id);
  });

  // Methods

  function enableRedireactionForCurrentTab() {
    setIsExtensionOn(true);
  }

  function disableRedireactionForCurrentTab () {
    setIsExtensionOn(false);
  }

  function sendRedirectMessage(tabId, url) {
    chrome.tabs.sendMessage(tabId, { targetUrl: url });
  }

  // Effects

  useEffect(() => {
    if (!isExtensionOn) {
      return;
    }

    chrome.action.setBadgeText({ 
      text: remainingTime.toString(),
      tabId: tabId,
    });

    if (remainingTime <= 0) {
      setRemainingTime(TIME_TO_REFRESH);

      sendRedirectMessage(tabId, "https://microsoft.com/devicelogin");
    }
  }, [remainingTime]);

  useEffect(() => {
    clearInterval(secondsIntervalId);

    if (isExtensionOn) {
      setRemainingTime(TIME_TO_REFRESH);

      const intervalId = setInterval(() => {
        setRemainingTime((previousValue) => previousValue - 1);
        console.log(new Date());
      }, 1000);
  
      setSecondsIntervalId(intervalId);
    } else {
      chrome.action.setBadgeText({ 
        text: "",
        tabId: tabId,
      });
    }
  }, [isExtensionOn]);

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
