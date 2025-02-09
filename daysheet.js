

checkEnabled_Daysheets();
async function checkEnabled_Daysheets(){
	const isEnabledObject = await browser.storage.local.get('enabled');
  const isEnabled = isEnabledObject.enabled;
	console.log("Global enabled? " + isEnabled);
  const disabled_warning = document.getElementById("disabled_warning");
  const selected_provider_label = document.getElementById("selected_provider_label");
  const selected_provider = document.getElementById("selected_provider");
  const selected_date_label = document.getElementById("selected_date_label");
  const selected_date = document.getElementById("selected_date");

  disabled_warning.classList.toggle("hide", isEnabled);
  selected_provider_label.classList.toggle("hide", !isEnabled);
  selected_provider.classList.toggle("hide", !isEnabled);
  selected_date.classList.toggle("hide", !isEnabled);
  selected_date_label.classList.toggle("hide", !isEnabled);

	if(!isEnabled){
		return;
	}
	else {

    await loadProviderList();
    await loadDates();
    await displayDaysheets();
    getDaysheetSettings();
	}
}



// just for testing
async function getDaysheetSettings(){
  const lastCheckObject = await browser.storage.local.get("daysheet_lastChecked");
	let lastCheck = lastCheckObject.daysheet_lastChecked;
	console.log("Last check: " + lastCheck);
  console.log(await browser.storage.local.get("saveDaysheet"));
}

async function loadProviderList(){
  const providersObject = await browser.storage.local.get("provider_number"); 
  const providerList = getProviderList(providersObject.provider_number);
  const providerListNode = document.getElementById("selected_provider");
  for (let provider_num of providerList){
    const option = document.createElement("option");
    option.value = provider_num;
    option.innerText = provider_num;
    providerListNode.appendChild(option);
  }

  providerListNode.addEventListener("change", () => {
    displayDaysheets();
  });

}

async function loadDates(){
  const dateOffsetObject = await browser.storage.local.get("date_offset"); 
  const maxDateOffset = Number(dateOffsetObject.date_offset);
  // console.log(maxDateOffset);
  const dateListNode = document.getElementById("selected_date");

  for (let offset = 0; offset < (maxDateOffset+1); offset++){
    const option = document.createElement("option");
    const targetDate = todayPlusOffset(offset);
    const targetDateString = targetDate.toLocaleDateString('en-CA');	

    option.value = targetDateString;
    option.innerText = targetDateString;
    dateListNode.appendChild(option);
  }

  dateListNode.addEventListener("change", () => {
    displayDaysheets();
  });
}


async function displayDaysheets(){
  const saveDaysheetsObject = await browser.storage.local.get("saveDaysheet");
  const providerDaysheetsList = saveDaysheetsObject.saveDaysheet;
  if (providerDaysheetsList == null){
    displayDaysheetNotFetchedWarning();
    console.log("Daysheet data haven't been fetched yet.");
    return;
  }
  // console.log(providerDaysheetsList);

  const selected_provider_node = document.getElementById("selected_provider");
  const selected_provider_num = selected_provider_node.value;
  const selected_date_node = document.getElementById("selected_date");
  const selected_date_string = selected_date_node.value;

  let table_to_display = [];
  for (let providerDaysheets of providerDaysheetsList){
    const providerNum = providerDaysheets.providerNum;
    if (providerNum == selected_provider_num){
      const daysheetList = providerDaysheets.daysheets;
      if (daysheetList == null){
        displayNullDaysheet();
        return;
      }
      for (let daysheet of daysheetList){
        const date = daysheet.date;
        const date_string = date.toLocaleDateString('en-CA');	
        if (date_string == selected_date_string){
          table_to_display = daysheet.table;
        }
      }
    }
  }
  // const oneTable = providerDaysheetsList[0].daysheets[0].table;
  // console.log(table_to_display);
  displayOneDaysheet(table_to_display);

}

function displayDaysheetNotFetchedWarning(){
  const section = document.getElementById("displayed_table");
  // first remove existing tables 
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  const label = document.createElement('label');
  label.textContent = "Daysheet data haven't been fetched yet. Load/refresh the OSCAR Scheduled page."
  section.appendChild(label);
}

function displayNullDaysheet(){
  const section = document.getElementById("displayed_table");
  // first remove existing tables 
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  const label = document.createElement('label');
  label.textContent = "No daysheet data to display. Likely invalid provider number."
  section.appendChild(label);
}

async function displayOneDaysheet(table){
  const section = document.getElementById("displayed_table");
  // first remove existing tables 
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  // create the new table from given daysheet
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
  
  section.appendChild(tableElement);

}




