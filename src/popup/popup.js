console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

const ENABLED_TABS_KEY = 'enabledTabs';
const TIME_TO_REFRESH = 0.5 * 60; // min * sec

const btnEnable = $("#btn-enable");
const btnDisable = $("#btn-disable");

if (!btnEnable)
  throw "The element was not found :(";

let enabledTabs;

loadEnabledTabs(loadedEnabledTabs => {
  enabledTabs = loadedEnabledTabs
});

// Events subscription

btnEnable.click(enableRedireactionForCurrentTab);
btnDisable.click(disableRedireactionForCurrentTab);

let remainingTime = TIME_TO_REFRESH;
let secondsIntervalId;
let tabId;

// Load current tab id
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  tabId = tabs[0].id;
});

// Methods

function enableRedireactionForCurrentTab() {

  if (btnEnable.hasClass("disabled")) {
    return;
  }

  btnEnable.addClass("disabled");
  btnDisable.removeClass("disabled");

  secondsIntervalId = setInterval(() => {

    chrome.action.setBadgeText({ 
      text: `${remainingTime--}`,
      tabId: tabId,
    });

    if (remainingTime <= 0) {
      remainingTime = TIME_TO_REFRESH;

      sendRedirectMessage(tabId, "https://microsoft.com/devicelogin");

      // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      //   const tabId = tabs[0].id;
    
      //   sendRedirectMessage(tabId, "https://microsoft.com/devicelogin");
    
      //   // enabledTabs[tabId] = timerId;
    
      //   // saveEnabledTabs();
      // });
    }
  }, 1000);
}

function disableRedireactionForCurrentTab () {

  if (btnDisable.hasClass("disabled")) {
    return;
  }

  btnEnable.removeClass("disabled");
  btnDisable.addClass("disabled");

  // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

  //   const tabId = tabs[0].id;

  //   clearInterval(enabledTabs[tabId]);
  //   clearInterval(secondsIntervalId);

  //   delete enabledTabs[tabId];

  //   chrome.action.setBadgeText({ 
  //     text: "",
  //     tabId: tabId,
  //   });

  //   saveEnabledTabs();
  // });

  clearInterval(secondsIntervalId);
}

function sendRedirectMessage(tabId, url) {
  chrome.tabs.sendMessage(tabId, { targetUrl: url });
}

function saveEnabledTabs() {
  chrome.storage.local.set(
    enabledTabs, 
    value => console.log('Value currently is ' + value));
}

function loadEnabledTabs(callback) {
  chrome.storage.local.get([ENABLED_TABS_KEY], result => {
    enabledTabs = result[ENABLED_TABS_KEY];

    callback(enabledTabs);
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(e => {

  console.log(`tab is: ${e.tabId}`, e);

  // loadEnabledTabs(enabledTabs => {
  //   if (enabledTabs[e.tabId]) {
  //     disableRedireactionForCurrentTab();
  //     enableRedireactionForCurrentTab();
  //   }
  // });
});