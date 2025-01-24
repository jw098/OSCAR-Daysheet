
const defaultSettings = {
  enabled: true, // default enabled

  // url: "",
  date_offset: 3,
  check_frequency: 1,
  provider_number:{
    providernum_1: "",
    providernum_2: "",
    providernum_3: "",
    providernum_4: "",
    providernum_5: "",
    providernum_6: "",
    providernum_7: "",
    providernum_8: "",
    providernum_9: "",
    providernum_10: "",
    providernum_11: "",
    providernum_12: "",
    providernum_13: "",
    providernum_14: "",
    providernum_15: "",
    providernum_16: "",
    providernum_17: "",
    providernum_18: "",
    providernum_19: "",
    providernum_20: "",
  },


};



/* 
- rebuild the settings object according to the structure of settingsTemplate 
(derived from defaultSettings), 
- if structure is the same (i.e. the values have the same data types), 
retain the value of storedSettings. if different, take on the value of defaultSettings
NOTE:
- if the key doesn't exist in storedSettings, the storedValue will be null, and so the rebuiltSettings 
will default to the value in default settings.

*/
function rebuildSettingsStructure(settingsTemplate, storedSettings){
  let rebuiltSettings = {};
  // console.log(storedSettings);
  for (const [key, value] of Object.entries(settingsTemplate)){
    
    const storedValue = storedSettings[key];
    // console.log(key);
    // console.log(value);
    // console.log(storedValue);

    /* 
    - if the key doesn't exist in storedSettings, the storedValue will be null, 
    and so will not match the value from the default settings template. 
    Therefore, the rebuiltSettings will default to the value in the default settings template.
    */
    if (typeof value != typeof storedValue){
      rebuiltSettings[key] = value;
    } 
    else { // value types match
      if (typeof value == "boolean" || typeof value == "string" || typeof value == "number"){
        rebuiltSettings[key] = storedValue;
      }
      else if (Array.isArray(value)){
        const settingsTemplate_firstIndex = value[0]
        rebuiltSettings[key] = rebuildSettingsStructure_Array(settingsTemplate_firstIndex, storedValue);
      }
      else if (typeof value == "object" //&& typeof storedValue == "object" 
          && !Array.isArray(value) 
          && value !== null
      ){
        // console.log("hi2");
        rebuiltSettings[key] = rebuildSettingsStructure(value, storedValue);
      } 
      else { 
        // value types match, but is not boolean, string, number, or object. 
        // may be bigint, undefined, symbol, null
        console.log("UNEXPECTED:" + key + value);
        rebuiltSettings[key] = storedValue;
      }
    }
  }

  return rebuiltSettings;
}

/* 
NOTE:
- settingsTemplate_firstIndex is just the first item in the array. this is used as the template
for creating settingsTemplate_correctIndexNum, which is the same template with the correct index number.
This template is then used for rebuilding the rest of the items in the array.
- we can't just use the array itself from default Settings, in case storedSettingsArray is longer
than default Settings Array
- if storedSettingsArray isn't an array, just return an empty array.
*/
function rebuildSettingsStructure_Array(settingsTemplate_firstIndex, storedSettingsArray){
  console.log(storedSettingsArray);
  console.log(storedSettingsArray.length);
  if (!Array.isArray(storedSettingsArray)){
    return [];
  }

  let rebuiltSettingsArray = [];
  for (let i = 0; i < storedSettingsArray.length; i++){
    const buttonNum = i+1;
    const settingsTemplate_correctIndexNum = 
      getSettingsTemplateWithCorrectIndexNum(settingsTemplate_firstIndex, buttonNum);

    storedSettingsOneItem = storedSettingsArray[i];

    rebuiltSettingsArray.push(
      rebuildSettingsStructure(settingsTemplate_correctIndexNum, storedSettingsOneItem));

  }
  console.log(rebuiltSettingsArray);
  return rebuiltSettingsArray;
}

/* 
- from settingsTemplate_firstIndex, returns a settingsTemplate object with the
 correct structure and index number
ASSUMES:
- the index number is in the format _X_, and so can be easily searched for and replaced.
  - e.g. bcBillingButton2_3_enabled. where _3_ denotes that it's the 3rd element in the array.
NOTES
- assumes the settingsTemplate_firstIndex is the first element in its respective array.
- we don't care about the actual value stored in the settings, as this is just the settingsTemplate.
 this is why we store an empty keybinding
*/
function getSettingsTemplateWithCorrectIndexNum(settingsTemplate_firstIndex, buttonNum){
  let rebuiltSettings = {};
  for (const [key, value] of Object.entries(settingsTemplate_firstIndex)){
    const keySplitWithoutGroupButtonNum = key.split(/\_\d+\_/); // e.g. "bcBillingButton1", "_1_", "enabled"
    const keyWithCorrectGroupButtonNum = 
      keySplitWithoutGroupButtonNum[0] + "_" + buttonNum + "_" + keySplitWithoutGroupButtonNum[1];
    if (typeof value == "boolean" || typeof value == "string" || typeof value == "number"){
      // console.log(key);
      rebuiltSettings[keyWithCorrectGroupButtonNum] = value;
      // console.log(document.getElementById(key).checked);
    } 
    else if (key.includes("_keybinding")){
      rebuiltSettings[keyWithCorrectGroupButtonNum] = returnEmptyKeybinding();
    }
    else{
      console.assert(typeof value == "object");
      rebuiltSettings[keyWithCorrectGroupButtonNum] =  
        getSettingsTemplateWithCorrectIndexNum(value, buttonNum);
    }
  }
  
  return rebuiltSettings;
}

/* 
- ensure stored settings matches the default settings object in structure (although the values may be different). 
if doesn't match, then fixes it.
- also clears the storage
NOTE
- this rebuilds the settings according to the structure of settingsStructure and stores it in storage.
HOW TO TEST THIS:
- uncomment setTestSettings in options.js, reload the program, and open the GUI settings page. 
It loads in settings that are invalid/out of date and there should be an error when 
you open the GUI settings page.
- re-comment out setTestSettings and reload the program. This function should run
and fix the error. Inspect to verify.
 */
async function checkStoredSettingsStructure(){
  const storedSettings = await browser.storage.local.get(defaultSettings);
  const rebuiltSettings = rebuildSettingsStructure(defaultSettings, storedSettings);
  console.log(rebuiltSettings);
  console.log(storedSettings);
  await browser.storage.local.clear();
  await browser.storage.local.set(rebuiltSettings);
  console.log(await browser.storage.local.get());
}


