// ==UserScript==
// @name						Consultations_KeyboardShortcuts
// @namespace				oscar
// @include					*/oscarConsultationRequest/ConsultationFormRequest.jsp*
// @description			Within Consultations: Alt+1 to 'Submit Consultation Request'. Automatically pastes Past Medical history, Social history, and Family history to the Clinical information text area.
// @require 				http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant						GM.setValue
// @grant						GM.getValue
// @grant						GM.deleteValue
// ==/UserScript==
//"*://*/*/oscarEncounter/ViewRequest.do*"
 
///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_Consultations();
async function checkEnabled_Consultations(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const consultationsObj = await browser.storage.local.get('consultations');
		const consultations = consultationsObj.consultations;
		const consultations_keyboardShortcuts = consultations.consultations_keyboardShortcuts;
		if (consultations_keyboardShortcuts.consultations_shortcuts_enabled){
			keydownEventListener_Consultations(consultations_keyboardShortcuts);
		}
		if (consultations.postPatientAgeGender){
			postPatientAgeGender();
		}
		if (consultations.postAllHistory){
			postAllHistory();
		}
	}
}


////////////////////////////////
// Keydown Event Listeners
////////////////////////////////

function keydownEventListener_Consultations(consultations_keyboardShortcuts){
	const close_enabled = 
	consultations_keyboardShortcuts.consultations_shortcuts_close_enabled;
	const close_keybinding = 
	consultations_keyboardShortcuts.consultations_shortcuts_close_keybinding;
	const submit_enabled = 
	consultations_keyboardShortcuts.consultations_shortcuts_submit_enabled;
	const submit_keybinding = 
	consultations_keyboardShortcuts.consultations_shortcuts_submit_keybinding;


	// let currentURL = window.location.href;
	// const eChartPage = /casemgmt\/forward\.jsp\?action\=view\&/;
	// const consultationPage = /oscarConsultationRequest\/ConsultationFormRequest\.jsp/;
	
	window.addEventListener('keydown', function(theEvent) {
		switch(true){
			case close_enabled && keybindingMatches(close_keybinding, theEvent):	// If on Consultation page, hotkey to close window.
				window.close();
				break;
			case submit_enabled && keybindingMatches(submit_keybinding, theEvent):
				var theTarget1 = document.evaluate("//input[@value='Submit Consultation Request']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget1.click();

				// if (theTarget1 != null){
				// 	theTarget1.click();
				// }

				// const theTarget2 = document.evaluate("//input[@value='Update Consultation Request']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				// if (theTarget2 != null){
				// 	theTarget2.click();
				// }

				break;					
		}	
	 
	}, true);
}




////////////////////////////////
// Patient Age and Gender
////////////////////////////////



function postPatientAgeGender(){
	const theTarget = document.evaluate("//textarea[@name='reasonForConsultation']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	
	const genderAndAge = document.querySelectorAll(".Header")[0].childNodes[2].nodeValue.trim().split("\t");
	
	const age2 = genderAndAge[1];

	const birthDate = document.querySelectorAll("td.tite4:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)")[0].innerText;
	const genderLetter = document.querySelectorAll("td.tite4:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)")[0].innerText;

	const age = calcPatientAge(birthDate);
	const gender = getGender(genderLetter);
	console.log(age2);


	theTarget.value = "Please see this " + age + gender + " for ";
}

function getGender(genderLetter){
	let gender = "";
	switch(genderLetter){
		case "M":
			gender = " male";
			break;
		case "F":
			gender = " female";
			break;
		case "O":
			gender = " (sex: Other)";
			break;
		case "U":
			gender = " (sex: Undefined)";
			break;
		case "T":
			gender = " transgender";
			break;
	}

	return gender;
}

function calcPatientAge(birthDate){
  const ageYears = yearsDiff(new Date(), new Date(birthDate));

  if (ageYears >= 2){
		return ageYears + "-year-old";
  }
  else {
  	const ageMonths = monthsDiff(new Date(), new Date(birthDate));
  	return ageMonths + "-month-old";
  }

  
}

function monthsDiff(d1, d2){
	const diffTime = Math.abs(d1 - d2); // time difference in milliseconds
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return Math.floor(diffDays/30);
	// return (
	//     d1.getMonth() -
	//     d2.getMonth() +
	//     12 * (d1.getFullYear() - d2.getFullYear())
	//   );
}

function yearsDiff(d1, d2) {    
	const diffTime = Math.abs(d1 - d2); // time difference in milliseconds
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  var timeFromEpoch = new Date(diffTime);  // the date diffTime miliseconds from the epoch (1970)
  console.log(timeFromEpoch);
  const yearsDiff = Math.abs(timeFromEpoch.getUTCFullYear() - 1970);
	return yearsDiff;
}

/////////////////////////////////////////////////////////////////
// Past Medical History, Social History, Family History
/////////////////////////////////////////////////////////////////



async function postAllHistory() {

	const [medHistory, socHistory, famHistory, otherMeds] = await Promise.all([getHistory(urlMedHistory()), getHistory(urlSocHistory()), getHistory(urlFamHistory()), getHistory(urlOtherMeds())]);

	const allHistory = "Past Medical History:\n" + medHistory + "\nSocial History:\n" + socHistory + "\nFamily History:\n"  + famHistory;
	// console.log(allHistory);
	
	const clinInfoTextBox = document.getElementById('clinicalInformation');
	clinInfoTextBox.value = allHistory;

	const currentMedsBox = document.getElementById('currentMedications');
	currentMedsBox.value += "\n\nOther Meds:\n"  + otherMeds;
}




// not used.
async function getXMLHTTP2(consultItemURL){
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", consultItemURL, true);
	
	xmlhttp.onload = async function(){
		if (xmlhttp.status == 200) {
			// console.log(xmlhttp.responseText);
      return xmlhttp.responseText;
    }
	};
	xmlhttp.send();
}

async function getHistory(URL) {
	const otherPageXMLText = await getXMLHTTP(URL);
	const otherPageHTML = new DOMParser().parseFromString(otherPageXMLText, "text/html");
  const historyDivList = otherPageHTML.querySelectorAll("body > div"); 

  if (historyDivList.length == 0){
  	return "<no data>\n"
  }
  else {
		const historyText = getHistoryAsText(historyDivList);
		console.log(historyText);

		return historyText;
  }

}



function getHistoryAsText(historyDivList){
	let historyTextAllLines = "";
	for (i = 0; i < historyDivList.length; i++){
		const historyDiv = historyDivList[i];
		const isArchived = historyDiv.children[1].innerText.includes("ARCHIVED");
		if(isArchived){
			// don't add text that is ARCHIVED.
			continue;
		}
		const historyTextOneLine = historyDiv.children[0].innerText;
		historyTextAllLines += historyTextOneLine + "\n";
	}
	return historyTextAllLines;
}

/////////////////////////////////////////////////////
// get URL, URL elements
/////////////////////////////////////////////////////


function urlSocHistory(){
	var newURL = getURLOrigin() + "CaseManagementEntry.do?method=issuehistory&demographicNo="+ getDemographicNum() + "&issueIds=65";

	return newURL;
}

function urlMedHistory(){
	var newURL = getURLOrigin() + "CaseManagementEntry.do?method=issuehistory&demographicNo="+ getDemographicNum() + "&issueIds=66";

	return newURL;
}

function urlFamHistory(){
	var newURL = getURLOrigin() + "CaseManagementEntry.do?method=issuehistory&demographicNo="+ getDemographicNum() + "&issueIds=69";

	return newURL;
}


function urlEChart(){
	var newURL = getURLOrigin() + "casemgmt/forward.jsp?action=view&demographicNo="+ getDemographicNum();

	return newURL;
}


function urlOtherMeds(){
	var newURL = getURLOrigin() + "CaseManagementEntry.do?method=issuehistory&demographicNo="+ getDemographicNum() + "&issueIds=64";

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

	return params.de;

}
