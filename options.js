


getSettings();
async function getSettings(){
  const settingsObject = await browser.storage.local.get();
  console.log(settingsObject);
}


///////////////////////////////////////////////////////////
// Remove Node
///////////////////////////////////////////////////////////

function removeParentNode(event){
  const removeParentButton = event.target;
  const parent = removeParentButton.parentNode;

  parent.remove();
}

///////////////////////////////////////////////////////////
// Export/Import Options
///////////////////////////////////////////////////////////

async function export_options(){
  const settingsObject = await browser.storage.local.get(defaultSettings);
  const settingsJson = JSON.stringify(settingsObject);

  const filename = "OSCAR_EMR_shortcuts_exported_settings.json";
  const blob = new Blob([settingsJson], {type:'application/json'});
  let link = document.createElement("a");
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
  }, 100);

}

let importedSettings;

function import_options(){
  if (importedSettings != null){
    restore_options_from_settings(importedSettings);
  }
}

///////////////////////////////////////////////////////////
// Check/Uncheck All settings
///////////////////////////////////////////////////////////


async function checkAllSettings(){
  const settingsObject = await browser.storage.local.get(defaultSettings);
  adjustAllSettings(true, settingsObject);
}

async function uncheckAllSettings(){
  const settingsObject = await browser.storage.local.get(defaultSettings);
  adjustAllSettings(false, settingsObject);
}

function adjustAllSettings(checkAllSettings, settingsObject){
  for (const [key, value] of Object.entries(settingsObject)){
    if (typeof value == "boolean"){
      const theTarget = document.getElementById(key);
      theTarget.checked = checkAllSettings;
      checkHighlightSaveButton(theTarget);
      setGreyout(theTarget);

      if(key == "enabled"){
        greyoutExtensionIcon();
      }
    } else if(key.includes("_keybinding")){
      continue;      
    }
    else if (typeof value == "object"){
      adjustAllSettings(checkAllSettings, value);
    }
  }
}

///////////////////////////////////////////////////////////
// Save Options
///////////////////////////////////////////////////////////

/* 
- Saves options to chrome.storage. 

NOTE:
- if the storedSettings object doesn't match the structure of defaultSettings, storedSettings will have its structure updated to match settingsStructure. (This can happen if options.js and defaultSettings was updated, but the user has an old version still stored in storage).
  - but the values will be from options, instead of from the default values of defaultSettings.
*/
async function save_options() {

  chrome.storage.local.set(
    setSettingsFromOptionsPage(defaultSettings),
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved";
      setTimeout(function () {
        status.textContent = "";
      }, 1000);

      var statusHeader = document.getElementById("statusHeader");
      statusHeader.textContent = "Options saved";
      setTimeout(function () {
        statusHeader.textContent = "";
      }, 1000);

      // remove optionsUnSaved from saveHeader classlist
      document.getElementById("saveHeader").classList.toggle("optionsUnsaved", false);

    }
  );

  // reset last check
  const lastCheck = new Date(-8.64e15); 
  await browser.storage.local.set({
    daysheet_lastChecked: lastCheck
  });

  (async function() {
    console.log(await browser.storage.local.get());
    // console.log(await browser.storage.local.get("tcDefaults"));
  })();

}

/* 
- given a settings object which provides the structure for the object, return a settings object with values taken from the options page.


 */
function setSettingsFromOptionsPage(settingsStructure){
  let newSettings = {};
  for (const [key, value] of Object.entries(settingsStructure)){
    // console.log(`${key}: ${value}`);
    if (typeof value == "boolean"){
      console.log(key);
      newSettings[key] = document.getElementById(key).checked;
      // console.log(document.getElementById(key).checked);
    } else if(typeof value == "string" || typeof value == "number"){
      // console.log(key);
      newSettings[key] = document.getElementById(key).value;
    } else {
      console.assert(typeof value == "object");
      newSettings[key] =  setSettingsFromOptionsPage(value);
    }

  }
  // console.log(newSettings);

  return newSettings;
}


///////////////////////////////////////////////////////////
// Restore Options
///////////////////////////////////////////////////////////


/* 
- Restores options from chrome.storage. 
- if a given setting wasn't present in storage, it takes the default value from defaultSettings. 
*/
function restore_options() {
  chrome.storage.local.get(defaultSettings, function (storage) {
    // console.log(storage);
    restoreOptionsPageFromSettings(storage);
    greyoutExtensionIcon();

    /* 
    - for some reason, remove() or insertBefore() sometimes causes the page to scroll down.
    - my guess is that when restore options restores the array of buttons, it gets confused and saves the wrong Y scroll position . And so when the user manually clicks the Add New or Remove buttons, it scrolls to the wrong Y scroll position.
    - somehow, manually setting the scroll position after restoring the options page fixes this.
    */
    window.scrollTo(0, window.scrollY);
  });
}

/* 
- Restores options from given settings object. For importing settings
- if a given setting wasn't present in storage, it takes the default value from defaultSettings. 
*/
function restore_options_from_settings(settingsObject) {
  removeAllAddable();

  restoreOptionsPageFromSettings(settingsObject);
  greyoutExtensionIcon();

  document.getElementById("saveHeader").classList.toggle("optionsUnsaved", true);
  /* 
  - for some reason, remove() or insertBefore() sometimes causes the page to scroll down.
  - my guess is that when restore options restores the array of buttons, it gets confused and saves the wrong Y scroll position . And so when the user manually clicks the Add New or Remove buttons, it scrolls to the wrong Y scroll position.
  - somehow, manually setting the scroll position after restoring the options page fixes this.
  */
  window.scrollTo(0, window.scrollY);
}

/*
- remove all addable elements
- finds all buttons with class removeParent, then removes them.
*/


function removeAllAddable(){
  document
  .querySelectorAll(".removeParent")
  .forEach((button) => button.click()); // Remove added shortcuts
}




/* 
- with given settings object, set the values on the options page.
 */
function restoreOptionsPageFromSettings(settingsObject){
  // console.log(settingsObject);
  for (const [key, value] of Object.entries(settingsObject)){
    // console.log(`${key}: ${value}`);
    // console.log(typeof value == "boolean");
    // console.log(key.includes("_keybinding"));
    if (typeof value == "boolean"){
      document.getElementById(key).checked = value;
      setGreyout(document.getElementById(key));
      // console.log(document.getElementById(key).checked);
    } else if(typeof value == "string" || typeof value == "number"){
      document.getElementById(key).value = value;
    } else{
      // console.log('hihi');
      console.assert(typeof value == "object");
      restoreOptionsPageFromSettings(value);
    }
  }
}





///////////////////////////////////////////////////////////
// Restore Default
///////////////////////////////////////////////////////////


/* 
- restores the default settings from storage.
 */
function restore_defaults() {
  restore_options_from_settings(defaultSettings);
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.textContent = "Default options restored";
  setTimeout(function () {
    status.textContent = "";
  }, 1000);

  // chrome.storage.local.set(defaultSettings, function () {
  //   restore_options();
  //   document
  //     .querySelectorAll(".removeParent")
  //     .forEach((button) => button.click()); // Remove added shortcuts
  //   // Update status to let user know options were saved.
  //   var status = document.getElementById("status");
  //   status.textContent = "Default options restored";
  //   setTimeout(function () {
  //     status.textContent = "";
  //   }, 1000);
  // });

}






///////////////////////////////////////////////////////////
// Set Greyout
///////////////////////////////////////////////////////////

/* 
PURPOSE: 
- adds greyout to classlist of the given element. so that it can be greyed out using CSS.
ASSUME: the element is an input type checkbox.
NOTE:
- gets greyout type: 
  - if under a row: type is greyoutBlock. if under a subRow1, type is greyoutRow1. if under subRow2, type is greyoutRow2.
- toggles greyoutType in the classlist of the given element's parent and all the child inputs.
- greyoutType is used so that a given element can have multiple greyoutTypes, and will only stop being grey when all greyoutTypes are removed from teh classlist.
 */
function setGreyout(theElement){
  if (theElement.id == "enabled"){
    setGreyoutAllSettings();
    return;
  }
  const greyoutType = getGreyoutType(theElement);
  const parentTarget = theElement.parentNode;
  parentTarget.classList.toggle(greyoutType, !theElement.checked);
  const customTextInputList = parentTarget.getElementsByTagName("INPUT");
  for (let i = 0 ; i < customTextInputList.length; i++){
    const customKeyInput = customTextInputList[i];
    customKeyInput.classList.toggle(greyoutType, !theElement.checked);  
  }
}


function getGreyoutType(theElement){
  const parentTarget = theElement.parentNode;
  const parentClassList = parentTarget.classList;
  if(parentClassList.contains("row")){
    return "greyoutBlock"
  } else if(parentClassList.contains("subRow1")){
    return "greyoutRow1"
  } else if (parentClassList.contains("subRow2")){
    return "greyoutRow2"
  } else {
    return getGreyoutType(parentTarget);
  }
}

function setGreyoutAllSettings(){
  const globalEnable = document.getElementById("enabled");
  const allSettings = document.getElementById("allSettings");
  const greyoutType = "greyoutAll"
  allSettings.classList.toggle(greyoutType, !globalEnable.checked);
  const customTextInputList = allSettings.getElementsByTagName("INPUT");
  for (let i = 0 ; i < customTextInputList.length; i++){
    const customKeyInput = customTextInputList[i];
    customKeyInput.classList.toggle(greyoutType, !globalEnable.checked);  
  }
}
/* 
PURPOSE
- greys out the extension icon if enabled is false.
 */
function greyoutExtensionIcon(){
  const globalEnable = document.getElementById("enabled");
  const enabled = globalEnable.checked;
  const suffix = `${enabled ? "" : "_disabled"}.png`;
  // console.log(enabled);
  // console.log(suffix);
  // chrome.browserAction.setIcon({
  //   path: {
  //     "16": "icons/OSCAR_16px" + suffix,
  //     "32": "icons/OSCAR_32px" + suffix
  //   }
  // });
}

///////////////////////////////////////////////////////////
// Highlight Save Button with Unsaved Changes
///////////////////////////////////////////////////////////

let unsavedChanges = new Set();

/* 
PURPOSE
- check if targetValue in options matches the value settings. If not, add it to set of unsavedChanges
- toggle optionsUnsaved in the save button classlist, depending on if unsavedChanges is empty.
*/
async function checkHighlightSaveButton(theTarget){
  // console.log(theTarget);
  const isOptionsUnsaved = await checkOptionsUnsaved(theTarget);

  // if the current target is not saved to settings, add it to the set of unsavedChanges.
  if (isOptionsUnsaved){
    unsavedChanges.add(theTarget);
  }
  else {
    unsavedChanges.delete(theTarget);
  }
  console.log(unsavedChanges);

  // toggle optionsUnsaved in the save button classlist, depending on if unsavedChanges is empty.
  document.getElementById("saveHeader").classList.toggle("optionsUnsaved", unsavedChanges.size != 0);
  
}


/* 
PURPOSE
- return true if the targetValue in options is different than the value in settings.
 */
async function checkOptionsUnsaved(theTarget){
  const targetID = theTarget.id;
  const settingsObject = await browser.storage.local.get(defaultSettings);
  // console.log(targetID);
  const targetValueInSettings = getTargetValueFromSettings(targetID, settingsObject);
  console.log("targetValueInSettings: " + targetValueInSettings);

  /*
  - get targetValue from options page. compare to the targetValue from saved settings.
  - the targetValue from options will be different depending on the type of target.
   */
  let isOptionsUnsaved;
  let targetValueInOptions;
  if (theTarget.type == "checkbox"){
    targetValueInOptions = theTarget.checked;
    isOptionsUnsaved = targetValueInSettings != targetValueInOptions;
  }
  else {
    //if (theTarget.classList.contains("date_offset") 
  // || theTarget.classList.contains("check_frequency") 
  // || theTarget.classList.contains("providernum")
  // )

    targetValueInOptions = theTarget.value;
    isOptionsUnsaved = targetValueInSettings != targetValueInOptions;
  }

  // console.log(isOptionsUnsaved);
  
  return isOptionsUnsaved;
}



/* 
- get one of the sibling elements of the remove button.
- check if it exists in stored settings. 
  - if exists, add it to the set of unsavedChanges, since we just removed the stored element. 
  - if "not found", then it never existed to begin with, so no change was made. also, iterate over unsavedChanges. removing all elements from the unsavedChanges set that are children of this parent.
- finally, toggle highlighting of the save button depending on whether unsavedChanges are present.
*/
async function highlightSaveButtonOnRemove(event){
  const removeButton = event.target;
  const theParent = removeButton.parentNode;
  const childCheckbox = theParent.querySelector("[id*='_enabled']");
  console.log(theParent);
  console.log(childCheckbox);
  const childCheckboxID = childCheckbox.id;

  const settingsObject = await browser.storage.local.get(defaultSettings);
  const targetValueInSettings = getTargetValueFromSettings(childCheckboxID, settingsObject);
  console.log(targetValueInSettings)
  if(targetValueInSettings == "not found"){
    /* 
    - iterate over unsavedChanges. removing all elements from the unsavedChanges set that are children of this parent.
    */
    for (let unsavedElement of unsavedChanges){
      if(unsavedElement.parentNode == theParent){
        unsavedChanges.delete(unsavedElement);
      }
    }
  }
  else {
    unsavedChanges.add(childCheckbox);
    // document.getElementById("saveHeader").classList.toggle("optionsUnsaved", true);
  }
  console.log(unsavedChanges);
  // toggle optionsUnsaved in the save button classlist, depending on if unsavedChanges is empty.
  document.getElementById("saveHeader").classList.toggle("optionsUnsaved", unsavedChanges.size != 0);
    
}

/* 
- from the given settingsStructure, return the target in settings whose key matches targetKey.
 */
function getTargetValueFromSettings(targetKey, settingsStructure){
  // console.log(targetID);
  // console.log(settingsStructure);
  let targetValue = "not found";
  for (const [key, value] of Object.entries(settingsStructure)){
    // console.log(key);
    if(key == targetKey){
      targetValue = value;
      break;
    } 
    else if(key.includes("_keybinding")){
      continue;
    }
    else if(typeof value == "object"){
      targetValue = getTargetValueFromSettings(targetKey, value);
      if (targetValue != "not found"){
        break;
      }
    }
  }
  // console.log(targetValue);
  return targetValue;
}

///////////////////////////////////////////////////////////
// Event Listeners
///////////////////////////////////////////////////////////

function targetEventCaller(theTarget, className, funcName) {
  if (!theTarget.classList || !theTarget.classList.contains(className)) {
    return;
  }
  funcName(theTarget);
}

document.addEventListener("DOMContentLoaded", async function () {

    ///////////////////////////////////////////////////////////
    // FileReader
    ///////////////////////////////////////////////////////////

  const fileInput = document.getElementById("file");
  const importWarning = document.getElementById("importWarning");
  
  fileInput.addEventListener('change', () => {
    const fileReader = new FileReader();
    importWarning.classList.toggle("hide", true);

    fileReader.readAsText(fileInput.files[0]);
    fileReader.addEventListener('load', () => {
      console.log(fileReader.result);
      try {
        importedSettings = JSON.parse(fileReader.result);
      } catch (e){
        importedSettings = null;
        importWarning.classList.toggle("hide", false);
      }
      
    })
    
  })


  // save_options();

  // await setTestSettings();
  // console.log(defaultSettings);
  // console.log(await browser.storage.local.get(defaultSettings));

  // await checkStoredSettingsStructure();
  restore_options();

  // const settingsStructure = await browser.storage.local.get(defaultSettings)
  // console.log(settingsStructure);

  document.getElementById("export").addEventListener("click", export_options);
  document.getElementById("import").addEventListener("click", import_options);

  document.getElementById("save").addEventListener("click", save_options);
  document.getElementById("saveHeader").addEventListener("click", save_options);
  // document.getElementById("checkAllSettings").addEventListener("click", checkAllSettings);
  // document.getElementById("uncheckAllSettings").addEventListener("click", uncheckAllSettings);

  window.addEventListener('keydown', function(theEvent) {
		var theKey = theEvent.key;
		var theAltKey = theEvent.altKey;
		var theCtrlKey = theEvent.ctrlKey;
		var theShiftKey= theEvent.shiftKey;
		let theTarget;		
		switch(true){				
			case (theCtrlKey && theAltKey && theKey ==  'z'):
      document.getElementById("save").click();
				break;	
		}
	}, true);
  
  
  

  document.getElementById("restore").addEventListener("click", restore_defaults);
  // document
  //   .getElementById("experimental")
  //   .addEventListener("click", show_experimental);

  function eventCaller(event, className, funcName) {
    if (!event.target.classList || !event.target.classList.contains(className)) {
      // console.log(event.target)
      // console.log(event.target.classList)
      return;
    }
    funcName(event);
  }



    // use focusout instead of blur, because focusout bubbles
    document.addEventListener("focusout", (event) => {
      let theTarget = event.target;
      
      targetEventCaller(theTarget, "url", checkHighlightSaveButton);
      targetEventCaller(theTarget, "url", saveOscarURL);
      targetEventCaller(theTarget, "date_offset", checkHighlightSaveButton);
      targetEventCaller(theTarget, "check_frequency", checkHighlightSaveButton);
      targetEventCaller(theTarget, "providernum", checkHighlightSaveButton);
    });

  document.addEventListener("click", (event) => {
    let theTarget = event.target;
    if(theTarget.type == "checkbox"){//theTarget.tagName  == "INPUT" && 
      setGreyout(theTarget);
      checkHighlightSaveButton(theTarget);
    }

    if(theTarget.id == "enabled"){
      greyoutExtensionIcon();
    }
  });



  document.addEventListener("click", (event) => {
    eventCaller(event, "removeParent", function (){
      removeParentNode(event);
      checkShortcutConflictFromRemoveParentClick(event);
    });
    eventCaller(event, "removeParent", highlightSaveButtonOnRemove);
  });

  
});

async function saveOscarURL(theTarget){
  const targetID = theTarget.id;
  const settingsObject = await browser.storage.local.get(defaultSettings);
  // console.log(targetID);
  const targetValueInSettings = getTargetValueFromSettings(targetID, settingsObject);
  console.log("full URL: " + targetValueInSettings);


  
}





