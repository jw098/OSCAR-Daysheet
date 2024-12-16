

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




