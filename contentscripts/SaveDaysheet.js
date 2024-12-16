

// console.log("hi");

// check frequency, provider list, days in advance

console.log(urlDaySheet(54, 0));
checkSnapshotAtInterval(1);
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

function testprint(){
	console.log("test print");
}


// get snapshot of daysheets every N hours.
async function checkSnapshotAtInterval(checkFrequencyInHours){
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
		saveDaysheetsForProviderList([54, 107], 2);
		lastCheck = currentDate;
		await browser.storage.local.set({
			daysheet_lastChecked: lastCheck
		});
	}

	console.log(await browser.storage.local.get("saveDaysheet"));
}



// int int -> array of array of strings
async function getDaysheetTableData(providerNum, dayOffset) {
	// console.log("getDaysheetInfo");
	const otherPageXMLText = await getXMLHTTP(urlDaySheet(providerNum, dayOffset));
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


// int int -> ProviderDaysheets
async function getDaysheetsForProvider(providerNum, numDaysInAdvance){
	// console.log("getDaysheetsForProvider");
	if (numDaysInAdvance < 0){
		numDaysInAdvance = 0;
	}

	let allDaysheets = [];
	for (let i = 0; i < numDaysInAdvance+1; i++){
		let daysheetInfo = await getDaysheetTableData(providerNum, i);
		const theDate = todayPlusOffset(i);
		const oneDay = new DaySheet(theDate, daysheetInfo);
		allDaysheets.push(oneDay);
	}

	return new ProviderDaysheets(providerNum, allDaysheets);
}


// array(int) int -> void
async function saveDaysheetsForProviderList(providerNumList, numDaysInAdvance){
	// console.log("saveDaysheetsForProviderList");
	providerDataList = []; // array of ProviderDaysheets
	for (const providerNum of providerNumList){
		providerData = await getDaysheetsForProvider(providerNum, numDaysInAdvance);
		providerDataList.push(providerData);
	}
	// console.log(providerDataList);

	await browser.storage.local.set({
		saveDaysheet: providerDataList
	});	
}





/////////////////////////////////////////////////////
// Date
/////////////////////////////////////////////////////


// int -> Date
function todayPlusOffset(dayOffset){
	let targetDate = new Date();
	targetDate.setDate(targetDate.getDate()+dayOffset);
	return targetDate;
}




/////////////////////////////////////////////////////
// get URL, URL elements
/////////////////////////////////////////////////////


// int dayOffset: 0 is for today, 1 for tomorrow, etc.
function urlDaySheet(providerNum, dayOffset){
	let targetDate = todayPlusOffset(dayOffset);
	targetDateString = targetDate.toLocaleDateString('en-CA');	
	var newURL = getURLOrigin() + "report/displayDaysheet.do?dsmode=all&provider_no=" + providerNum + "&sdate=" + targetDateString + "&edate=" + targetDateString + "&sTime=8&eTime=18";

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
