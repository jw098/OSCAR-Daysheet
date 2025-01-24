

// console.log("hi");

// check frequency, provider list, days in advance
checkDaysheet();
// console.log(urlDaySheet(54, 0));
// checkSnapshotAtInterval(1);
// console.log("hi20");
// getDaysheetsForProvider(54, 2);

// saveDaysheet contains an array of ProviderDaysheets

class DaySheet {
	constructor(date, table){
		this.date = date;  // Date
		this.table = table; // array of array of String
	}
}

class ProviderDaysheets {
	constructor(providerNum, daysheets){
		this.providerNum = providerNum; // int
		this.daysheets = daysheets; // array of DaySheet
	}
}


async function checkDaysheet(){
	const settingsObject = await browser.storage.local.get();
	const check_frequency = settingsObject.check_frequency;
	const date_offset = settingsObject.date_offset;
	const url = settingsObject.url;
	const providersObject = settingsObject.provider_number;
	const providerList = getProviderList(providersObject);
	console.log(settingsObject);
	console.log(date_offset);
	console.log(check_frequency);
	try{
		checkSnapshotAtInterval(check_frequency, date_offset, url, providerList);
	}catch(e){
		console.error(e);
	}
}



// get snapshot of daysheets every N hours.
async function checkSnapshotAtInterval(checkFrequencyInHours, numDaysInAdvance, url, providerList){
	const currentDate = new Date();
	const lastCheckObject = await browser.storage.local.get("daysheet_lastChecked");
	let lastCheck = lastCheckObject.daysheet_lastChecked;
	console.log("Last check: " + lastCheck);
	if (lastCheck == null){
		console.log("No previous check.");
		lastCheck = new Date(-8.64e15);  // minimum date
	}

	const millisecondsElapsed = (currentDate - lastCheck);
	const hoursElapsed = millisecondsElapsed/(60*60*1000);
	console.log(millisecondsElapsed);
	console.log("hoursElapsed: " + hoursElapsed);
	console.log("checkFrequencyInHours: " + checkFrequencyInHours);

	if (hoursElapsed > checkFrequencyInHours){
		const providerDataList = await getDaysheetsForProviderList(providerList, numDaysInAdvance, url);

		// check if all the daysheet data is null
		let all_data_null = true;
		for (const providerData of providerDataList){
			if (providerData.daysheets != null){
				all_data_null = false;
			}
		}

		if (all_data_null){
			throw new Error("All ProviderDaysheets have null daysheets.");
		}else{
			await browser.storage.local.set({
				saveDaysheet: providerDataList
			});	
	
			lastCheck = currentDate;
			await browser.storage.local.set({
				daysheet_lastChecked: lastCheck
			});			
		}
	}

	console.log(await browser.storage.local.get("saveDaysheet"));
}



// int int string -> array of array of strings
async function getDaysheetTableData(providerNum, dayOffset, url) {
	// console.log("getDaysheetInfo");
	urlDaySheet(providerNum, dayOffset, url);
	const otherPageXMLText = await getXMLHTTP(urlDaySheet(providerNum, dayOffset, url));
	const otherPageHTML = new DOMParser().parseFromString(otherPageXMLText, "text/html");
	const tableDataRaw = otherPageHTML.querySelectorAll("body > table:nth-child(2) > tbody:nth-child(1) > tr"); 
	let tableData = [];
	for (let row of tableDataRaw){
		const rowDataRaw = row.children;
		// let rowText = "";
		let rowData = [];
		for (let cell of rowDataRaw){
			let text = cell.textContent.trim();
			text = text.replace(/(\r\n|\n|\r)/gm, " ");
			rowData.push(text);
			// rowText += text + " | ";
		}	
		// console.log(rowTextList);	
		// const rowName = "row" + i;
		tableData.push(rowData);
	}

	return tableData;
}


// int int string -> ProviderDaysheets
async function getDaysheetsForProvider(providerNum, numDaysInAdvance, url){
	// console.log("getDaysheetsForProvider");
	if (numDaysInAdvance < 0){
		numDaysInAdvance = 0;
	}
	let allDaysheets = [];
	try {
		for (let i = 0; i < numDaysInAdvance+1; i++){
			let daysheetInfo = await getDaysheetTableData(providerNum, i, url);
			const theDate = todayPlusOffset(i);
			const oneDay = new DaySheet(theDate, daysheetInfo);
			allDaysheets.push(oneDay);
		}
	}catch{
		allDaysheets = null;
	}

	return new ProviderDaysheets(providerNum, allDaysheets);
}


// array(int) int string -> array of ProviderDaysheets
async function getDaysheetsForProviderList(providerNumList, numDaysInAdvance, url){
	// console.log("saveDaysheetsForProviderList");
	let providerDataList = []; // array of ProviderDaysheets
	for (const providerNum of providerNumList){
		const providerData = await getDaysheetsForProvider(providerNum, numDaysInAdvance, url);
		providerDataList.push(providerData);
	}

	return providerDataList;
}









/////////////////////////////////////////////////////
// get URL, URL elements
/////////////////////////////////////////////////////


// int dayOffset: 0 is for today, 1 for tomorrow, etc.
function urlDaySheet(providerNum, dayOffset, url){
	let targetDate = todayPlusOffset(dayOffset);
	targetDateString = targetDate.toLocaleDateString('en-CA');	
	var newURL = getURLOrigin() + "report/displayDaysheet.do?dsmode=all&provider_no=" + providerNum + "&sdate=" + targetDateString + "&edate=" + targetDateString + "&sTime=8&eTime=18";
	// console.log(newURL);
	return newURL;
}


function getDemographicNum(){
	var params = {}; //Get Params
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;``
	        params[nv[0]] = nv[1] || true;
	    }
	}

	return params.demographicNo;

}

function getProviderNum(){
	var params = {}; //Get Params
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;``
	        params[nv[0]] = nv[1] || true;
	    }
	}
	return params.providerNo;
}

/* 
- returns today's date as YYYY-MM-DD
 */
function todayDateYYYYMMDD(){
	// const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	// const today = new Date();
	// const todayDate = today.getDate();
	// const todayMonth = today.getMonth()+1;
	// const todayYear = today.getFullYear();

	const todayFullDate = new Date().toLocaleDateString('en-CA');
	// console.log(todayFullDate);
	return todayFullDate;
}
