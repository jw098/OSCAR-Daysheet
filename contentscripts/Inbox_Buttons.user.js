// ==UserScript==
// @name           Inbox_Buttons
// @namespace      oscar
// @include        */dms/inboxManage*
// @description		Within Inbox: A button that opens all reports (including acknowledged and filed reports), as well as one that open just new reports.
// @grant	   none
// ==/UserScript==



/////////////////////////////////
// Load New Reports Button
/////////////////////////////////

function addButtonLoadNewReports(){
	// if the button already exists, delete it before reloading the button with a new listener.
	removeAlreadyExistingElement_Inbox(document.getElementById('loadNewReports'));

	let targetDiv = document.querySelectorAll('#lab_form > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')[0];
	console.log(targetDiv);
	var inputButton = document.createElement('input');
	inputButton.id = 'loadNewReports';
	inputButton.type = 'button';
	inputButton.value = 'Load New Reports';
	targetDiv.appendChild(inputButton);	
	addButtonLoadNewReportsListener();
}

function addButtonLoadNewReportsListener(){
  var theButton = document.getElementById('loadNewReports');
  //https://carefiniti.kai-oscar.com/oscar/dms/inboxManage.do?method=prepareForIndexPage&providerNo=54

  const URL = getURLOrigin() + "dms/inboxManage.do?method=prepareForIndexPage&providerNo=" + getProviderNum();
  console.log(URL);
  theButton.addEventListener('click', function () { 
	// console.log('hihi');
  	window.open(URL,"_self"); 
  },true);
}
/* 
PURPOSE
- if the given element already exists in the document, remove it.
 */
function removeAlreadyExistingElement_Inbox(element){
	if(!!element){
		element.remove();
	}
}

/////////////////////////////////
// Load All Reports Button
/////////////////////////////////

function addButtonLoadAllReports(){
	// if the button already exists, delete it before reloading the button with a new listener.
	removeAlreadyExistingElement_Inbox(document.getElementById('loadAllReports'));

	let targetDiv = document.querySelectorAll('#lab_form > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')[0];
	console.log(targetDiv);
	var inputButton = document.createElement('input');
	inputButton.id = 'loadAllReports';
	inputButton.type = 'button';
	inputButton.value = 'Load All Reports';
	targetDiv.appendChild(inputButton);	
	addButtonLoadAllReportsListener();
}

function addButtonLoadAllReportsListener(){
  var theButton = document.getElementById('loadAllReports');
  //https://carefiniti.kai-oscar.com/oscar/dms/inboxManage.do?method=prepareForIndexPage&providerNo=54&searchProviderNo=54&status=&abnormalStatus=all

  const URL = getURLOrigin() + "dms/inboxManage.do?method=prepareForIndexPage&providerNo=" + getProviderNum() + "&searchProviderNo=" + getProviderNum() + "&status=&abnormalStatus=all";
  console.log(URL);
//   console.log('hihi2');
  theButton.addEventListener('click',function () { 
  	window.open(URL,"_self"); 
  },true);
}

/////////////////////////////////
// Load Today's Reports Button
/////////////////////////////////

function addButtonLoadTodayReports(){
	// if the button already exists, delete it before reloading the button with a new listener.
	removeAlreadyExistingElement_Inbox(document.getElementById('loadTodayReports'));

	let targetDiv = document.querySelectorAll('#lab_form > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')[0];
	console.log(targetDiv);
	var inputButton = document.createElement('input');
	inputButton.id = 'loadTodayReports';
	inputButton.type = 'button';
	inputButton.value = "Load Today's Reports";
	targetDiv.appendChild(inputButton);	
	addButtonLoadTodayReportsListener();
}

function addButtonLoadTodayReportsListener(){
  var theButton = document.getElementById('loadTodayReports');
  //https://carefiniti.kai-oscar.com/oscar/dms/inboxManage.do?method=prepareForIndexPage&providerNo=54&searchProviderNo=54&status=&abnormalStatus=all

  const URL = getURLOrigin() + "dms/inboxManage.do?method=prepareForIndexPage&providerNo=" + getProviderNum() + "&searchProviderNo=" + getProviderNum() + "&startDate=" + todayDateYYYYMMDD() + "&status=&abnormalStatus=all";
  console.log(URL);
//   console.log('hihi2');
  theButton.addEventListener('click',function () { 
  	window.open(URL,"_self"); 
  },true);
}


/////////////////////////////////
// URL
/////////////////////////////////


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