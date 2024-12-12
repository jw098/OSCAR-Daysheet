// ==UserScript==
// @name Billing Screen Buttons
// @namespace   PMscripts
// @description  On the BC Billing page, buttons to automatically bill age-related codes and other common codes. 
// @include     *billing.do?billRegion=BC&billForm=*
// @include     *billing.do?billRegion=BC&changeBillForm=*
// @include     *billing.do?billRegion=BC&billForm=CFP&hotclick=*
// @include     *billing/CA/BC/CreateBilling*
// @include     *SaveBilling.do*
// @include     *billing/CA/BC/billingBC.jsp*
// @include     *CaseManagementEntry.do
// @exclude    *CaseManagementEntry.do?method=issuehistory&demographicNo*
// @require   https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @grant       none
// @version 2.0 For contract FP - all docs + LTCI line
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_BCBillingCodeInput();
async function checkEnabled_BCBillingCodeInput(){
	// const all = await browser.storage.local.get(null);
	// console.log(all);
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	const isBillingCodeInputPage = !!document.getElementById("billingFormTable");
	console.log(isBillingCodeInputPage);
	if(!isEnabled.enabled || !isBillingCodeInputPage){
		return;
	}
	else {

		const billingCodeInputObj = await browser.storage.local.get('billingCodeInput');
		const billingCodeInput = billingCodeInputObj.billingCodeInput;

		console.log(billingCodeInputObj.billingCodeInput);

		// Button Group 3
		if (billingCodeInput.bcBillingButtonGroup3_enable){
			addSpaceForBillingButtons(3);
			addBillingButtonRow(billingCodeInput.bcBillingButtonGroup3, 3);
		}
		// Button Group 2
		if (billingCodeInput.bcBillingButtonGroup2_enable){
			addSpaceForBillingButtons(2);
			addBillingButtonRow(billingCodeInput.bcBillingButtonGroup2, 2);
		}

		// Button Group 1
		if (billingCodeInput.bcBillingButtonGroup1_enable){
			addSpaceForBillingButtons(1);
			addBillingButtonRow(billingCodeInput.bcBillingButtonGroup1, 1);
		}
		
		// Keyboard shortcuts

		const billingCodeInput_keyboardShortcuts = billingCodeInputObj.billingCodeInput.billingCodeInput_keyboardShortcuts;
		if (billingCodeInput_keyboardShortcuts.billingCodeInput_shortcuts_enabled){
			billingCodeInputPage_KeydownListeners(billingCodeInput_keyboardShortcuts);
		}

		// scroll to bottom of page
		if (billingCodeInputObj.billingCodeInput.billingCodeInput_PageEnd){
			scrollToPageEnd_BCBillingConfirm();
		}

		// Default Billing Physician
		// setDefaultBillingPhysician("Wong");

		// Time code alert
		if (billingCodeInputObj.billingCodeInput.billingCodeInput_checkTimeCode){
			checkTimeCodeBilling();
		}
		
	}
}

function scrollToPageEnd_BCBillingConfirm(){
	window.scrollTo(0, document.body.scrollHeight);
}


/* 
- ensures time code billings have start and end times, and that number of units for time-based billing do not exceed the time difference between start and end time.
 */
function checkTimeCodeBilling(){
	const continueButton = document.evaluate("id('buttonRow')/td/input[@value='Continue']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	continueButton.addEventListener('click', function () { 
		const serviceCode1 = document.getElementById("billing_1_fee").value;
		// only run the below code if the service code is 98010 or 98011
		if (serviceCode1 == 98010 || serviceCode1 == 98011 || serviceCode1 == 98012){
			alertTimeCode();
		}
		else {
			window.onbeforeunload = null;
		}

	}, true);
}

function alertTimeCode(){
	if(isExcessBilledTimeUnits()){
		alert("Number of units for time-based billing exceeds the time difference between start and end time.");
		window.onbeforeunload = function() {
			return 'You have unsaved changes!';
		}
	} 
	else if(isEndTimeEmpty()){
		alert("End Time is empty.");
		window.onbeforeunload = function() {
			return 'You have unsaved changes!';
		}
	} 
	else if(isStartTimeEmpty()){
		alert("Start Time is empty.");
		window.onbeforeunload = function() {
			return 'You have unsaved changes!';
		}
	} 
	else {
		window.onbeforeunload = null;
	}
}


/* 
- return true if number of time units billed exceeds the expected number of time units, based on start and end time.
 */
function isExcessBilledTimeUnits(){
	const endTimeVal = document.getElementById("serviceEndTime").value;
	const startTimeVal = document.getElementById("serviceStartTime").value;

	const endTimeHours = Number(endTimeVal.split(":")[0]);
	const endTimeMin = Number(endTimeVal.split(":")[1]);
	const startTimeHours = Number(startTimeVal.split(":")[0]);
	const startTimeMin = Number(startTimeVal.split(":")[1]);

	const timeDifference = (endTimeHours + endTimeMin/60) - (startTimeHours + startTimeMin/60);
	
	const expectedBilledTimeUnits = +(timeDifference*4).toFixed(2);
	const actualBilledTimeUnits = document.getElementById("billing_1_fee_unit").value;
	console.log(timeDifference);
	console.log(expectedBilledTimeUnits);

	return actualBilledTimeUnits > expectedBilledTimeUnits;
}


function isEndTimeEmpty(){
	const endTime = document.getElementById("serviceEndTime");

	return endTime.value == "";
}

function isStartTimeEmpty(){
	const startTime = document.getElementById("serviceStartTime");

	return startTime.value == "";
}


/* 
- set the Billing Physician to selectedPhysicianName.
 */
function setDefaultBillingPhysician(selectedPhysicianName){
	const selectPhysician = $('#billingPatientInfo > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > div:nth-child(1) > div:nth-child(1) > select:nth-child(2)')[0]
	const physicianList = selectPhysician.children;

	let selectedPhysicianValue = "";
	for (let i = 0; i < physicianList.length; i++){
		const aPhysician = physicianList[i];
		const aPhysicianName = aPhysician.innerText;
		const aPhysicianVal = aPhysician.value;
		
		if (aPhysicianName.includes(selectedPhysicianName)){
			selectedPhysicianValue = aPhysicianVal;
		}
	}

	selectPhysician.value = selectedPhysicianValue;
}