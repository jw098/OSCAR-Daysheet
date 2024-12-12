

console.log("hi");
// saveDaysheetsForProviderList([54, 107], 2);
// checkSnapshotAtInterval(1);
// getDaysheetSettings();
displayDaysheets();
// just for testing
async function getDaysheetSettings(){
  const lastCheckObject = await browser.storage.local.get("daysheet_lastChecked");
	let lastCheck = lastCheckObject.daysheet_lastChecked;
	console.log("Last check: " + lastCheck);
  console.log(await browser.storage.local.get("saveDaysheet"));
}



async function displayDaysheets(){
  const saveDaysheetsObject = await browser.storage.local.get("saveDaysheet");
  const providerDaysheetsList = saveDaysheetsObject.saveDaysheet;
  // for (let providerDaysheets of providerDaysheetsList){
  //   const providerNum = providerDaysheets.providerNum;
  //   const daysheetList = providerDaysheets.daysheets;
  //   for (let daysheet of daysheetList){
  //     const table = daysheet.table;
  //     displayOneDaysheet(table);
  //   }
  // }
  const oneTable = providerDaysheetsList[0].daysheets[0].table;
  console.log(oneTable);
  displayOneDaysheet(oneTable);

}

async function displayOneDaysheet(table){
  let tableElement = document.createElement('table');
  for (let row_index = 0; row_index < table.length; row_index++){
    const row = table[row_index];

    const tr = document.createElement('tr');
    for (let cell of row){
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    }

    if (row_index == 0){
      const thead = document.createElement('thead');
      thead.appendChild(tr);
      tableElement.appendChild(thead);
    }else{
      const tbody = document.createElement('tbody');
      tbody.appendChild(tr);
      tableElement.appendChild(tbody);
    }
  }
  document.body.appendChild(tableElement);

}

///////////////////////////////////////////////////////////
// Key press, Keybinding
///////////////////////////////////////////////////////////

function recordKeyPress(e) {

  let keyVal;
  if(e.key == "Backspace"){
    keyVal = "";
  }
  else {
    keyVal = e.key;
  }


  const theKeybinding = {
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    key: keyVal
  }

  const keybindingText = keybindingToText(theKeybinding);
  e.target.value = keybindingText;

  // e.target.keybinding = theKeybinding;

  e.target.dataset.keybinding = JSON.stringify(theKeybinding);

  // console.log(e.target);
  // console.log(e.target.keybinding);
  // console.log(JSON.parse(e.target.dataset.keybinding));

  e.preventDefault();
  e.stopPropagation();

}

function keybindingToText(theKeybinding){
  if(theKeybinding == ""){
    return "";
  }
  const theKey = theKeybinding.key;    
  const theAltKey = theKeybinding.altKey;
  const theCtrlKey = theKeybinding.ctrlKey;
  const theShiftKey= theKeybinding.shiftKey;
  let keybindingText = "";

  if (theCtrlKey){
    keybindingText += "Ctrl+"
  }
  if (theShiftKey){
    keybindingText += "Shift+"
  }
  if (theAltKey){
    keybindingText += "Alt+"
  }
  if(theKey != "Control" && theKey != "Shift" && theKey != "Alt"){
    keybindingText += theKey;
  }
  return keybindingText;
}

// return true if the given keybindings are the same
function isSameKeybinding(keybinding1, keybinding2){
  return keybinding1.ctrlKey == keybinding2.ctrlKey 
  && keybinding1.altKey == keybinding2.altKey
  && keybinding1.shiftKey == keybinding2.shiftKey
  && keybinding1.key == keybinding2.key;

}


///////////////////////////////////////////////////////////
// Convert URL
///////////////////////////////////////////////////////////

/* 
PURPOSE
- if e.target.value contains "fid=", it will return the FID.
*/
function convertURLToFID(e){
  const theTargetValue = e.target.value;
  if(theTargetValue.includes("fid=")){
    const theFID = theTargetValue.split("fid=")[1].split("&")[0];
    console.log(theFID);
    e.target.value = theFID;
  }
}

/* 
PURPOSE
- if e.target.value contains "groupName=", it will return the groupName.
*/
function convertURLToMeasureGroupName(e){
  const theTargetValue = e.target.value;
  if(theTargetValue.includes("groupName=")){
    const theGroupName = theTargetValue.split("groupName=")[1];
    console.log(theGroupName);
    e.target.value = theGroupName;
  }
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
function save_options() {
  reorderButtonIDs();

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

  (async function() {
    console.log(await browser.storage.local.get(defaultSettings));
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
    } else if(key.includes("_keybinding")){
      // console.log(key);
      // console.log(value);
      // console.log(document.getElementById(key));
      // console.log(document.getElementById(key).dataset.keybinding);
      newSettings[key] = JSON.parse(document.getElementById(key).dataset.keybinding);
      // console.log(value);
      // console.log(newSettings[key]);
    } else if (key.includes("bcBillingButtonGroup")){
      newSettings[key] = getSettingsFromOptionsPage_array("bcBillingButtonGroup", key, value);
    } else if (key.includes("measurementButtons")){
      newSettings[key] = getSettingsFromOptionsPage_array("measurementButtons", key, value);
    } else if (key.includes("eFormButtons")){
      newSettings[key] = getSettingsFromOptionsPage_array("eFormButtons", key, value);
    } else {
      console.assert(typeof value == "object");
      newSettings[key] =  setSettingsFromOptionsPage(value);
    }

  }
  // console.log(newSettings);

  return newSettings;
}


function getSettingsFromOptionsPage_array(optionWithChildArray_type, optionWithChildArray_ID, settingsStructureArray){
  console.assert(settingsStructureArray.length > 0);

  const optionWithChildArray_htmlNode = document.getElementById(optionWithChildArray_ID);
  const array_htmlNode =  
    optionWithChildArray_htmlNode.querySelectorAll(`.${optionWithChildArray_type}`);
  const settingsStructure = settingsStructureArray[0];
  
  // console.log(array_htmlNode);
  
  
  let array_newSettings;
  if(optionWithChildArray_type == "bcBillingButtonGroup"){
    array_newSettings = 
      getSettingsFromOptionsPage_BCBillingButtonArray(optionWithChildArray_ID, array_htmlNode, settingsStructure);
  } else if (optionWithChildArray_type == "eFormButtons" || optionWithChildArray_type == "measurementButtons"){
    array_newSettings = 
      getSettingsFromOptionsPage_eChartButtonArray(array_htmlNode, settingsStructure)
  }

  return array_newSettings;
}

function getSettingsFromOptionsPage_BCBillingButtonArray(optionWithChildArray_ID, array_htmlNode, settingsStructure){

  let array_newSettings = [];
  let oldUniqueNum;  // the uniqueNum of the first element in settingsStructure
  let currentUniqueNum;  // the uniqueNum of current element

  const groupNum = optionWithChildArray_ID.split("bcBillingButtonGroup")[1].substring(0,1);
  oldUniqueNum = groupNum + "_1_";
  
  for (let i = 0; i < array_htmlNode.length; i++){
    currentUniqueNum = groupNum + "_" + (i+1) + "_";
    const oneItemInArray_newSettings = 
      createSettingFromOption_oneItemInArray(settingsStructure, oldUniqueNum, currentUniqueNum);

    array_newSettings.push(oneItemInArray_newSettings);
  }
  return array_newSettings;
}

function getSettingsFromOptionsPage_eChartButtonArray(array_htmlNode, settingsStructure){

  let array_newSettings = [];
  let oldUniqueNum;  // the uniqueNum of the first element in settingsStructure
  let currentUniqueNum;  // the uniqueNum of current element
  oldUniqueNum = "1_";

  for (let i = 0; i < array_htmlNode.length; i++){
    currentUniqueNum = (i+1) + "_";
    const oneItemInArray_newSettings = 
      createSettingFromOption_oneItemInArray(settingsStructure, oldUniqueNum, currentUniqueNum);

    array_newSettings.push(oneItemInArray_newSettings);
  }
  return array_newSettings;
}


/* 
- given settingsStructure has keys with uniqueNum == oldUniqueNum. Convert the keys to currentUniqueNum.
- then generate new settings using setSettingsFromOptionsPage.
*/
function createSettingFromOption_oneItemInArray(settingsStructure, oldUniqueNum, currentUniqueNum) {
  const renamedSettingsStructure = 
    getRenamedSettingsStructure(settingsStructure, oldUniqueNum, currentUniqueNum);
  const newSettings = setSettingsFromOptionsPage(renamedSettingsStructure);

  return newSettings;
}

/* 
- return new settingsStructure, with oldNum in each key replaced with newNum
 */
function getRenamedSettingsStructure(settingsStructure, oldNum, newNum){
  let newSettings = {};
  for (let [key, value] of Object.entries(settingsStructure)){
    // console.log(`${key}: ${value}`);
    const keySplit = key.split(oldNum);
    console.assert(keySplit.length == 2);
    key = keySplit[0] + newNum + keySplit[1];

    if (typeof value == "boolean" || typeof value == "string" || typeof value == "number" || key.includes("_keybinding")){
      // console.log(key);
      newSettings[key] = value
    } 
    else{
      console.assert(typeof value == "object");
      newSettings[key] =  getRenamedSettingsStructure(value, oldNum, newNum);
    }
  }
  // console.log(newSettings);

  return newSettings;
}

///////////////////////////////////////////////////////////
// Reorder Button IDs
///////////////////////////////////////////////////////////

/* 
PURPOSE
- renames the IDs of html elements for billing buttons.
- this is because adding deleting buttons can disrupt the order. This function renames all billing button IDs to be in order.
 */
function reorderButtonIDs(){
  reorderButtonIDs_BCBillingButtonGroup(1);
  reorderButtonIDs_BCBillingButtonGroup(2);
  reorderButtonIDs_BCBillingButtonGroup(3);

  reorderButtonIDs_eChartButtonGroup("eFormButtons");
  reorderButtonIDs_eChartButtonGroup("measurementButtons");
}


function reorderButtonIDs_eChartButtonGroup(buttonType){
  const optionWithChildArray_htmlNode = document.getElementById(buttonType);
  const array_htmlNode = optionWithChildArray_htmlNode.querySelectorAll(`.${buttonType}`);
  // console.log(billingButtonList);

  let nodeIDConstant;  // the constant portion of the ID names.
  const oldUniqueNumRegex = /\d+\_/;
  if(buttonType == "eFormButtons"){
    nodeIDConstant = "eFormButton";
  } else if(buttonType == "measurementButtons"){
    nodeIDConstant = "measurementButton";
  }
  
  for (let i = 0; i < array_htmlNode.length; i++){
    const oneBillingButton = array_htmlNode[i];
    const currentUniqueNum = (i+1) + "_";
    
    reorderButtonIDs_SingleButton(oneBillingButton, nodeIDConstant, currentUniqueNum, oldUniqueNumRegex);
  }
}

function reorderButtonIDs_BCBillingButtonGroup(groupNum){
  const billingButtonGroup = document.getElementById("bcBillingButtonGroup" + groupNum);
  const billingButtonArray = billingButtonGroup.querySelectorAll(".bcBillingButtonGroup");
  // console.log(billingButtonList);

  const oldUniqueNumRegex = /\d+\_\d+\_/;
  for (let i = 0; i < billingButtonArray.length; i++){
    const oneBillingButton = billingButtonArray[i];
    const currentUniqueNum = groupNum + "_" + (i+1) + "_";
    reorderButtonIDs_SingleButton(oneBillingButton, "bcBillingButton", currentUniqueNum, oldUniqueNumRegex);
    
  }
}


function reorderButtonIDs_SingleButton(oneBillingButton, nodeIDConstant, uniqueNum, oldUniqueNumRegex){
  const buttonElementsArray = oneBillingButton.querySelectorAll(`[id^=${nodeIDConstant}]`);
  for (let i = 0; i < buttonElementsArray.length; i++){
    const oneButtonID = buttonElementsArray[i].id;
    const idSplitWithoutButtonNum = oneButtonID.split(oldUniqueNumRegex);
    console.assert(idSplitWithoutButtonNum.length == 2);
    const idWithCorrectButtonNum = 
      idSplitWithoutButtonNum[0] + uniqueNum + idSplitWithoutButtonNum[1];

    buttonElementsArray[i].id = idWithCorrectButtonNum;
  }

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
    findAllShortcutConflicts(storage);
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
  findAllShortcutConflicts(settingsObject);
  greyoutExtensionIcon();

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
    } else if(key.includes("_keybinding")){
      document.getElementById(key).dataset.keybinding = JSON.stringify(value);
      document.getElementById(key).value = keybindingToText(value);
      
      // console.log(value);
      // console.log(document.getElementById(key).keybinding);
      // console.log(document.getElementById(key).value);
    } else if (Array.isArray(value)){

      if(key.includes("bcBillingButtonGroup")){
        const groupNum = key.split("bcBillingButtonGroup")[1];
        restoreOptionsPageFromSettings_bcBillingButtons(value, groupNum);

      } else if (key.includes("measurementButtons")){
        restoreOptionsPageFromSettings_eChartButtons(value, "measurementButtons");

      } else if (key.includes("eFormButtons")) {
        restoreOptionsPageFromSettings_eChartButtons(value, "eFormButtons");

      }

    }
    else{
      // console.log('hihi');
      console.assert(typeof value == "object");
      restoreOptionsPageFromSettings(value);
    }
  }
}

/* 
- buttonType: either eForm or Measurement buttons
 */
function restoreOptionsPageFromSettings_eChartButtons(eChartButtonList_settings, buttonType){
  
  for (let i = 0; i < eChartButtonList_settings.length; i++){
    const oneEChartButton_settings = eChartButtonList_settings[i];
    // console.log(settingsBCBillingButton);
    add_EChartButtonFromSetting(oneEChartButton_settings, buttonType, i+1);
  }
}

function add_EChartButtonFromSetting(settingsBCBillingButton, buttonType, buttonNum) {

  if(buttonType == "measurementButtons"){
    add_measurementButtonBlank();
  } else if (buttonType == "eFormButtons"){
    add_EFormButtonBlank();
  }

  restoreOptionsPageFromSettings(settingsBCBillingButton);
}


function restoreOptionsPageFromSettings_bcBillingButtons(settingsBCBillingButtonList, groupNum){
  // console.log(settingsBCBillingButtonList);
  
  for (let i = 0; i < settingsBCBillingButtonList.length; i++){
    const settingsBCBillingButton = settingsBCBillingButtonList[i];
    // console.log(settingsBCBillingButton);
    add_BCBillingButtonFromSetting(settingsBCBillingButton, groupNum, i+1);
  }
}

function add_BCBillingButtonFromSetting(settingsBCBillingButton, groupNum, buttonNum) {
  const bcBillingButton_serviceCode1 = 
    settingsBCBillingButton[`bcBillingButton${groupNum}_${buttonNum}_serviceCode1`];
  const isAgeBasedCode = checkIsAgeBasedCode(bcBillingButton_serviceCode1);

  add_BCBillingButtonBlank(groupNum, isAgeBasedCode);
  restoreOptionsPageFromSettings(settingsBCBillingButton);
}

function checkIsAgeBasedCode(serviceCode){
  for (const [key, value] of Object.entries(ageBasedCodeList)){
    // console.log(serviceCode);
    // console.log(key);
    if (serviceCode == key){
      return true;
    }
  }
  return false;
}

let ageBasedCodeList = {
  officeVisit: "Office Visit",
  counselling: "Counselling",
  consultation: "Consultation",
  completeExam: "Complete Exam",
  teleVisit: "Tele Visit",
  teleCounselling: "Tele Counselling",
  teleConsultation: "Tele Consultation"
}


///////////////////////////////////////////////////////////
// Add Blank Button
///////////////////////////////////////////////////////////


function add_measurementButtonBlank() {
  const buttonList = document.getElementById("measurementButtons");
  const buttonNum = buttonList.children.length;
  const emptyKeybinding = JSON.stringify(returnEmptyKeybinding());

  const div = document.createElement("div");
  div.setAttribute("class", "shortcut subRow1 eChartButtonSingle measurementButtons");

  let enabled = document.createElement('input');
  enabled.id = `measurementButton_${buttonNum}_enabled`;
  enabled.type = "checkbox";
  div.appendChild(enabled);

  let name = document.createElement('input');
  name.id = `measurementButton_${buttonNum}_name`;
  name.type = "text";
  name.className = "customButtonTitle";
  name.placeholder = "button name";
  div.appendChild(name);

  let groupNameLabel = document.createElement('label');
  groupNameLabel.for = `measurementButton_${buttonNum}_groupName`;
  groupNameLabel.innerText = "Measurement group name:";
  div.appendChild(groupNameLabel);

  let groupName = document.createElement('input');
  groupName.id = `measurementButton_${buttonNum}_groupName`;
  groupName.type = "text";
  groupName.className = "customMeasureGroupName";
  groupName.placeholder = "measure name or URL";
  div.appendChild(groupName);


  let removeParent = document.createElement('button');
  removeParent.className = "removeParent";
  removeParent.innerText = "X";
  div.appendChild(removeParent);

  let subRow2 = document.createElement('div');
  subRow2.className = "subRow2";
    let buttonEnableDiv = document.createElement('div');
    buttonEnableDiv.className = "buttonShortcut";
      let buttonEnabled = document.createElement('input');
      buttonEnabled.id = `measurementButton_${buttonNum}_button_enabled`;
      buttonEnabled.type = "checkbox";
      buttonEnableDiv.appendChild(buttonEnabled);

      let buttonEnabledLabel = document.createElement('label');
      buttonEnabledLabel.className = "enableButton";
      buttonEnabledLabel.for = `measurementButton_${buttonNum}_button_enabled`;
      buttonEnabledLabel.innerText = "Enable button";
      buttonEnableDiv.appendChild(buttonEnabledLabel);
    subRow2.appendChild(buttonEnableDiv);

    let shortcutDiv = document.createElement('div');
    shortcutDiv.className = "shortcut buttonShortcut";
      let shortcutEnabled = document.createElement('input');
      shortcutEnabled.id = `measurementButton_${buttonNum}_shortcuts_enabled`;
      shortcutEnabled.type = "checkbox";
      shortcutDiv.appendChild(shortcutEnabled);

      let shortcutLabel = document.createElement('label');
      shortcutLabel.innerText = "Shortcut keys:";
      shortcutDiv.appendChild(shortcutLabel);

      let shortcutKeybinding = document.createElement('input');
      shortcutKeybinding.id = `measurementButton_${buttonNum}_shortcuts_keybinding`;
      shortcutKeybinding.className = "customKey";
      shortcutKeybinding.dataset.shortcutgroup = "eChart_shortcut";
      shortcutKeybinding.dataset.keybinding = emptyKeybinding;
      shortcutKeybinding.type = "text";
      shortcutKeybinding.placeholder = "shortcut keys";
      shortcutDiv.appendChild(shortcutKeybinding);

      let warning = document.createElement('label');
      warning.className = "warning hide";
      warning.title = "Conflicts only occur if the same keyboard shortcut is assigned to two different actions on the same page. There is no issue if the same shortcut appears on different pages. In case of conflicts, only one of the actions will be performed.";
      warning.innerText = "WARNING: Shortcut conflicts with another shortcut on the same page.";
      shortcutDiv.appendChild(warning);
    subRow2.appendChild(shortcutDiv);
  div.appendChild(subRow2);

  setGreyout(enabled);
  setGreyout(buttonEnabled);
  setGreyout(shortcutEnabled);

  buttonList.insertBefore(
    div,
    buttonList.children[buttonList.childElementCount - 1]
  );

}

function add_EFormButtonBlank() {
  const buttonList = document.getElementById("eFormButtons");
  const buttonNum = buttonList.children.length;
  const emptyKeybinding = JSON.stringify(returnEmptyKeybinding());

  const div = document.createElement("div");
  div.setAttribute("class", "shortcut subRow1 eChartButtonSingle eFormButtons");

  let enabled = document.createElement('input');
  enabled.id = `eFormButton_${buttonNum}_enabled`;
  enabled.type = "checkbox";
  div.appendChild(enabled);

  let name = document.createElement('input');
  name.id = `eFormButton_${buttonNum}_name`;
  name.type = "text";
  name.className = "customButtonTitle";
  name.placeholder = "button name";
  div.appendChild(name);

  let fidLabel = document.createElement('label');
  fidLabel.for = `eFormButton_${buttonNum}_fid`;
  fidLabel.innerText = "eForm ID:";
  div.appendChild(fidLabel);

  let fid = document.createElement('input');
  fid.id = `eFormButton_${buttonNum}_fid`;
  fid.type = "text";
  fid.className = "customFID";
  fid.placeholder = "eForm FID or URL";
  div.appendChild(fid);

  let removeParent = document.createElement('button');
  removeParent.className = "removeParent";
  removeParent.innerText = "X";
  div.appendChild(removeParent);

  let subRow2 = document.createElement('div');
  subRow2.className = "subRow2";
    let buttonEnableDiv = document.createElement('div');
    buttonEnableDiv.className = "buttonShortcut";
      let buttonEnabled = document.createElement('input');
      buttonEnabled.id = `eFormButton_${buttonNum}_button_enabled`;
      buttonEnabled.type = "checkbox";
      buttonEnableDiv.appendChild(buttonEnabled);

      let buttonEnabledLabel = document.createElement('label');
      buttonEnabledLabel.className = "enableButton";
      buttonEnabledLabel.for = `eFormButton_${buttonNum}_button_enabled`;
      buttonEnabledLabel.innerText = "Enable button";
      buttonEnableDiv.appendChild(buttonEnabledLabel);
    subRow2.appendChild(buttonEnableDiv);

    let shortcutDiv = document.createElement('div');
    shortcutDiv.className = "shortcut buttonShortcut";
      let shortcutEnabled = document.createElement('input');
      shortcutEnabled.id = `eFormButton_${buttonNum}_shortcuts_enabled`;
      shortcutEnabled.type = "checkbox";
      shortcutDiv.appendChild(shortcutEnabled);

      let shortcutLabel = document.createElement('label');
      shortcutLabel.innerText = "Shortcut keys:";
      shortcutDiv.appendChild(shortcutLabel);

      let shortcutKeybinding = document.createElement('input');
      shortcutKeybinding.id = `eFormButton_${buttonNum}_shortcuts_keybinding`;
      shortcutKeybinding.className = "customKey";
      shortcutKeybinding.dataset.shortcutgroup = "eChart_shortcut";
      shortcutKeybinding.dataset.keybinding = emptyKeybinding;
      shortcutKeybinding.type = "text";
      shortcutKeybinding.placeholder = "shortcut keys";
      shortcutDiv.appendChild(shortcutKeybinding);

      let warning = document.createElement('label');
      warning.className = "warning hide";
      warning.title = "Conflicts only occur if the same keyboard shortcut is assigned to two different actions on the same page. There is no issue if the same shortcut appears on different pages. In case of conflicts, only one of the actions will be performed.";
      warning.innerText = "WARNING: Shortcut conflicts with another shortcut on the same page.";
      shortcutDiv.appendChild(warning);
    subRow2.appendChild(shortcutDiv);
  div.appendChild(subRow2);

  setGreyout(enabled);
  setGreyout(buttonEnabled);
  setGreyout(shortcutEnabled);

  buttonList.insertBefore(
    div,
    buttonList.children[buttonList.childElementCount - 1]
  );

}


function add_BCBillingButtonBlank(groupNum, isAgeBasedCode) {
  const buttonGroup = document.getElementById("bcBillingButtonGroup" + groupNum);
  const buttonNum = buttonGroup.children.length;
  const emptyKeybinding = JSON.stringify(returnEmptyKeybinding());

  const div = document.createElement("div");
  div.setAttribute("class", "subRow1 bcBillingButtonGroup");

  let enabled = document.createElement('input');
  enabled.id = `bcBillingButton${groupNum}_${buttonNum}_enabled`;
  enabled.type = "checkbox";
  enabled.className = "bcBillingButton_enabled";
  div.appendChild(enabled);

  let name = document.createElement('input');
  name.id = `bcBillingButton${groupNum}_${buttonNum}_name`;
  name.type = "text";
  name.className = "bcBillingButton_name billingButtonCustomText";
  name.placeholder = "button name";
  div.appendChild(name);

  let serviceCodeInput1;
  if(isAgeBasedCode){
    serviceCodeInput1 = document.createElement('select');
    serviceCodeInput1.id = `bcBillingButton${groupNum}_${buttonNum}_serviceCode1`;
    serviceCodeInput1.className = "bcBillingButton_serviceCode1 billingButtonCustomText ageBasedServiceCode";
    serviceCodeInput1.placeholder = "Service code 1";
    addAgeBasedCodeOptions(serviceCodeInput1);
  }
  else{
    serviceCodeInput1 = document.createElement('input');
    serviceCodeInput1.id = `bcBillingButton${groupNum}_${buttonNum}_serviceCode1`;
    serviceCodeInput1.className = "bcBillingButton_serviceCode1 billingButtonCustomText";
    serviceCodeInput1.type = "text";
    serviceCodeInput1.placeholder = "Service code 1";
  }
  div.appendChild(serviceCodeInput1);

  let serviceCodeInput2 = document.createElement('input');
  serviceCodeInput2.id = `bcBillingButton${groupNum}_${buttonNum}_serviceCode2`;
  serviceCodeInput2.className = "bcBillingButton_serviceCode2 billingButtonCustomText";
  serviceCodeInput2.type = "text";
  serviceCodeInput2.placeholder = "Service code 2";
  div.appendChild(serviceCodeInput2);

  let serviceCodeInput3 = document.createElement('input');
  serviceCodeInput3.id = `bcBillingButton${groupNum}_${buttonNum}_serviceCode3`;
  serviceCodeInput3.className = "bcBillingButton_serviceCode3 billingButtonCustomText";
  serviceCodeInput3.type = "text";
  serviceCodeInput3.placeholder = "Service code 3";
  div.appendChild(serviceCodeInput3);

  let removeParent = document.createElement('button');
  removeParent.className = "removeParent";
  removeParent.innerText = "X";
  div.appendChild(removeParent);

  const divDxCodes_SubRow2 = document.createElement("div");
  divDxCodes_SubRow2.setAttribute("class", "subRow2");

    let dxCode1 = document.createElement('input');
    dxCode1.id = `bcBillingButton${groupNum}_${buttonNum}_dxCode1`;
    dxCode1.type = "text";
    dxCode1.className = "bcBillingButton_dxCode1 billingButtonCustomText";
    dxCode1.placeholder = "Dx code 1";
    divDxCodes_SubRow2.appendChild(dxCode1);

    let dxCode2 = document.createElement('input');
    dxCode2.id = `bcBillingButton${groupNum}_${buttonNum}_dxCode2`;
    dxCode2.type = "text";
    dxCode2.className = "bcBillingButton_dxCode2 billingButtonCustomText";
    dxCode2.placeholder = "Dx code 2";
    divDxCodes_SubRow2.appendChild(dxCode2);

    let dxCode3 = document.createElement('input');
    dxCode3.id = `bcBillingButton${groupNum}_${buttonNum}_dxCode3`;
    dxCode3.type = "text";
    dxCode3.className = "bcBillingButton_dxCode3 billingButtonCustomText";
    dxCode3.placeholder = "Dx code 3";
    divDxCodes_SubRow2.appendChild(dxCode3);
  div.appendChild(divDxCodes_SubRow2);

  const divSubRow2 = document.createElement("div");
  divSubRow2.setAttribute("class", "subRow2");

    const divAddon = document.createElement("div");
    divAddon.setAttribute("class", "buttonShortcut");

      let addonLabel = document.createElement('label');
      addonLabel.for = `bcBillingButton${groupNum}_${buttonNum}_addon`;
      addonLabel.className = "bcBillingButton_addon_label";
      addonLabel.innerText = "Billing code type: ";
      divAddon.appendChild(addonLabel);

      let addon = document.createElement('select');
      addon.id = `bcBillingButton${groupNum}_${buttonNum}_addon`;
      addon.className = "bcBillingButton_addon";
      addon.innerHTML = `<option value="standardBilling">Standard billing code</option>
                        <option value="addonBilling">Billing addon</option>`;
      divAddon.appendChild(addon);

    const divShortcut = document.createElement("div");
    divShortcut.setAttribute("class", "shortcut buttonShortcut");

      let shortcutEnable = document.createElement('input');
      shortcutEnable.id = `bcBillingButton${groupNum}_${buttonNum}_shortcuts_enabled`;
      shortcutEnable.className = "bcBillingButton_shortcuts_enabled";
      shortcutEnable.type = "checkbox"
      divShortcut.appendChild(shortcutEnable);

      let shortcut = document.createElement('input');
      shortcut.id = `bcBillingButton${groupNum}_${buttonNum}_shortcuts_keybinding`;
      shortcut.className = "customKey bcBillingButton_shortcuts_keybinding";
      shortcut.dataset.shortcutgroup = "billingCodeInput_shortcut";
      shortcut.dataset.keybinding = emptyKeybinding;
      shortcut.type = "text";
      shortcut.placeholder = "press a key";
      divShortcut.appendChild(shortcut);

      let warning = document.createElement('label');
      warning.className = "warning hide";
      warning.title = "Conflicts only occur if the same keyboard shortcut is assigned to two different actions on the same page. There is no issue if the same shortcut appears on different pages. In case of conflicts, only one of the actions will be performed.";
      warning.innerText = "WARNING: Shortcut conflicts with another shortcut on the same page.";
      divShortcut.appendChild(warning);
  
  divSubRow2.appendChild(divAddon);
  divSubRow2.appendChild(divShortcut);

  div.appendChild(divSubRow2);
  setGreyout(enabled);
  setGreyout(shortcutEnable);

  buttonGroup.insertBefore(
    div,
    buttonGroup.children[buttonGroup.childElementCount - 1]
  );

}

function getAgeBasedCodeOptions(){
  let optionsList = "";
  for (const [key, value] of Object.entries(ageBasedCodeList)){
    const oneOption = `<option value="${key}">${value}</option>`
    optionsList += oneOption;
  }
  return optionsList;
}

function addAgeBasedCodeOptions(serviceCodeInput1){
  for (const [key, value] of Object.entries(ageBasedCodeList)){
    let oneOption = document.createElement('option'); //`<option value="${key}">${value}</option>`
    oneOption.value = key;
    oneOption.innerText = value;
    serviceCodeInput1.appendChild(oneOption);
  }
}


///////////////////////////////////////////////////////////
// Shortcut Conflicts
///////////////////////////////////////////////////////////

let shortcutGroupsInConflict = new Set();


/* 
PURPOSE
- check conflicts in keyboard shortcuts on the same page/shortcut group.
NOTES:
- first the clean slate
  - hides all warning labels in the group 
  - removes this group from the list of shortcutGroupsInConlict.
- then loops through all items, checking for conflicts
  - if conflict found, turns on the warning label for the two items found to be in conflict. and adds this shortcut group to shortcutGroupsInConflict.
- then check the size of shortcutGroupsInConflict. if empty, hides the warning label.
*/
function checkShortcutGroupConflict(shortcutGroup){
  // console.log(shortcutGroup);
  const inputListInSameGroup = Array.from(document.querySelectorAll(`input[data-shortcutgroup=${shortcutGroup}]`));

  // console.log(inputListInSameGroup);
  /* 
  - first the clean slate
    - hides all warning labels in the group 
    - removes this group from the list of shortcutGroupsInConlict.
  */
  for (let i = 0; i < inputListInSameGroup.length; i++){
    const anInput = inputListInSameGroup[i];
    const anInputWarning = anInput.parentNode.querySelector(".warning");
    anInputWarning.classList.toggle("hide", true);
  }
  shortcutGroupsInConflict.delete(shortcutGroup);
 
  /* 
  - then loops through all items, checking for conflicts
    - if conflict found, turns on the warning label for the two items found to be in conflict. and adds this shortcut group to shortcutGroupsInConflict.
  */
  for (let i = 0; i < inputListInSameGroup.length; i++){
    const anInput = inputListInSameGroup[i];
    let anInputKeybinding = anInput.dataset.keybinding;
    // console.log(anInputKeybinding);

    anInputKeybinding = JSON.parse(anInputKeybinding);
    if (isEmptyKeybinding(anInputKeybinding)){
      continue;
    }

    const anInputWarning = anInput.parentNode.querySelector(".warning");

    const restOfInputList = inputListInSameGroup.slice(i+1);
    for (let j = 0; j < restOfInputList.length; j++){
      const anInputFromRestOfList = restOfInputList[j];
      let anInputFromRestOfList_keybinding = anInputFromRestOfList.dataset.keybinding;
      // console.log(anInputFromRestOfList_keybinding);
      anInputFromRestOfList_keybinding = JSON.parse(anInputFromRestOfList_keybinding);
      if (isEmptyKeybinding(anInputFromRestOfList_keybinding)){
        continue;
      }
      // console.log(anInputFromRestOfList_keybinding);

      if(isSameKeybinding(anInputKeybinding, anInputFromRestOfList_keybinding)){
        // console.log(anInputKeybinding);
        // console.log(anInputFromRestOfList_keybinding);
        shortcutGroupsInConflict.add(shortcutGroup);
        const h1Warning = document.querySelector("h1").querySelector(".warning");
        h1Warning.classList.toggle("hide", false);

        anInputWarning.classList.toggle("hide", false);
        
        const anInputFromRestOfList_warning = anInputFromRestOfList.parentNode.querySelector(".warning");
        anInputFromRestOfList_warning.classList.toggle("hide", false);
      }
    }
  }

  // console.log(shortcutGroupsInConflict);
  

  /* 
  - then check the size of shortcutGroupsInConflict. if empty, hides the warning label.
  */
  if(shortcutGroupsInConflict.size == 0){
    const h1Warning = document.querySelector("h1").querySelector(".warning");
    h1Warning.classList.toggle("hide", true);
  }

}

/* 
PURPOSE
- check conflicts in keyboard shortcuts on the same page/shortcut group, given event.
 */
function checkShortcutConflictFromCustomKeyFocusOut(e){
  const theTarget = e.target;
  const shortcutGroup = e.target.getAttribute('data-shortcutgroup');
  // console.log(theTarget);
  checkShortcutGroupConflict(shortcutGroup);
}


/* 
PURPOSE
- check conflicts in keyboard shortcuts on the same page/shortcut group, given removeParent.
 */
function checkShortcutConflictFromRemoveParentClick(event){
  const removeParentButton = event.target;
  const parent = removeParentButton.parentNode;
  const shortcutGroup = parent.querySelector(".customKey").getAttribute('data-shortcutgroup');
  checkShortcutGroupConflict(shortcutGroup);
}


function findAllShortcutConflicts(settingsObject){
  // console.log(settingsObject);
  
  const allShortcutGroups = findAllShortcutGroups(settingsObject, new Set());
  console.log(allShortcutGroups);
  for (let shortcutGroup of allShortcutGroups){
    checkShortcutGroupConflict(shortcutGroup);
  }

}

function findAllShortcutGroups(settingsObject, shortcutGroupsSeenSoFar){
  for (const [key, value] of Object.entries(settingsObject)){
    if(key.includes("_keybinding")){
      const shortcutGroup = document.getElementById(key).getAttribute('data-shortcutgroup');
      shortcutGroupsSeenSoFar.add(shortcutGroup);
    }
    else if(typeof value == "object"){
      findAllShortcutGroups(value, shortcutGroupsSeenSoFar);
    }
  }

  // console.log(shortcutGroupsSeenSoFar);
  return shortcutGroupsSeenSoFar;
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
  chrome.browserAction.setIcon({
    path: {
      "16": "icons/OSCAR_16px" + suffix,
      "32": "icons/OSCAR_32px" + suffix
    }
  });
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
  console.log(targetValueInSettings)

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
  else if (theTarget.classList.contains("customKey")){
    targetValueInOptions = theTarget.dataset.keybinding;
    // console.log(targetValueInOptions);
    // if(!isEmptyKeybinding(targetValueInOptions)){
    // }
    targetValueInOptions = JSON.parse(targetValueInOptions);

    isOptionsUnsaved = !keybindingMatches(targetValueInSettings, targetValueInOptions);
  }
  else if (theTarget.classList.contains("customFID") 
  || theTarget.classList.contains("customButtonTitle") 
  || theTarget.classList.contains("billingButtonCustomText")
  || theTarget.classList.contains("bcBillingButton_addon")){

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



  document.addEventListener("keydown", (event) => {
    eventCaller(event, "customKey", recordKeyPress);
    // console.log(event);
  });

    // use focusout instead of blur, because focusout bubbles
    document.addEventListener("focusout", (event) => {
      let theTarget = event.target;
      
      eventCaller(event, "customFID", convertURLToFID);
      eventCaller(event, "customMeasureGroupName", convertURLToMeasureGroupName);
      eventCaller(event, "customKey", checkShortcutConflictFromCustomKeyFocusOut);
      
      targetEventCaller(theTarget, "customKey", checkHighlightSaveButton);
      targetEventCaller(theTarget, "customFID", checkHighlightSaveButton);
      targetEventCaller(theTarget, "customButtonTitle", checkHighlightSaveButton);
      targetEventCaller(theTarget, "billingButtonCustomText", checkHighlightSaveButton);
      targetEventCaller(theTarget, "bcBillingButton_addon", checkHighlightSaveButton);
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





