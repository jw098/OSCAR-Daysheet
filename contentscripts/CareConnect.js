// ==UserScript==
// @name Pagescraper V3 JY eMail, Care Connect, copyable Telephone links
// @namespace Stanscripts
// @description adds demographic details to echart with helpful links
// @include */casemgmt/forward.jsp?action=view&demographic*
// @include  *careconnect*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @version 17.2 Fixed eMAIL for FF ESR 91.3; remove Doxy, eMail, and QuickLinks
// ==/UserScript== 



checkEnabled_CareConnect();
async function checkEnabled_CareConnect(){
	const isEnabled = await browser.storage.local.get('enabled');
	if(!isEnabled.enabled){
		return;
	}
	else {
		const eChartObj = await browser.storage.local.get('eChart');
		const eChart = eChartObj.eChart;
		const demographicInfo = eChart.demographicInfo;
		const CareConnect_enabled = demographicInfo.demographicInfo_CareConnect_enabled;

		if (CareConnect_enabled){
			loadPHNToCareConnect();
		}

	}
}

/* 
- load PHN from storage and paste to CareConnect search field. then clear PHN from storage
 */
async function loadPHNToCareConnect(){
	const PHNObject = await browser.storage.local.get("PHN");
	const PHN = PHNObject.PHN;
	console.log(PHN);
	if(PHN != undefined){
		console.log("Filled PHN from local storage");
		$('#search').val(PHN);
		browser.storage.local.set({PHN: ""});	
	}
}