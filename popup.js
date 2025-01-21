document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#daysheet").addEventListener("click", function () {
    window.open(browser.runtime.getURL("daysheet.html"));
  });

  document.querySelector("#config").addEventListener("click", function () {
    window.open(browser.runtime.getURL("options.html"));
  });

  document.querySelector("#about").addEventListener("click", function () {
    window.open("https://github.com/jw098/OSCAR-EMR-Shortcuts");
  });

  document.querySelector("#firefox").addEventListener("click", function () {
    window.open("https://addons.mozilla.org/en-US/firefox/addon/oscar-emr-shortcuts/");
  });

  document.querySelector("#feedback").addEventListener("click", function () {
    window.open("https://github.com/jw098/OSCAR-EMR-Shortcuts/issues");
  });

  document.querySelector("#readme").addEventListener("click", function () {
    window.open("https://github.com/jw098/OSCAR-EMR-Shortcuts/blob/main/README.md");
  });

  document.querySelector("#enable").addEventListener("click", function () {
    toggleEnabled(true, settingsSavedReloadMessage);
  });

  document.querySelector("#disable").addEventListener("click", function () {
    toggleEnabled(false, settingsSavedReloadMessage);
  });

  chrome.storage.local.get({ enabled: true }, function (storage) {
    toggleEnabledUI(storage.enabled);
  });

  function toggleEnabled(enabled, callback) {
    chrome.storage.local.set(
      {
        enabled: enabled
      },
      function () {
        toggleEnabledUI(enabled);
        if (callback) callback(enabled);
      }
    );
  }

  function toggleEnabledUI(enabled) {
    document.querySelector("#enable").classList.toggle("hide", enabled);
    document.querySelector("#disable").classList.toggle("hide", !enabled);

    // const suffix = `${enabled ? "" : "_disabled"}.png`;
    // chrome.browserAction.setIcon({
    //   path: {
    //     "16": "icons/OSCAR_16px" + suffix,
    //     "32": "icons/OSCAR_32px" + suffix
    //   }
    // });
  }

  function settingsSavedReloadMessage(enabled) {
    setStatusMessage(
      `${enabled ? "Enabled" : "Disabled"}. Reload page to see changes`
    );
  }

  function setStatusMessage(str) {
    const status_element = document.querySelector("#status");
    status_element.classList.toggle("hide", false);
    status_element.innerText = str;
  }
});
