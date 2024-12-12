
// @name        EChart_Buttons
// @namespace   Stanscripts
// @description Various navigation buttons for e-chart screen (e.g. Lab req, Ultrasound req, X-ray req).  Set your own specific fid (form number ID) or Measurement groupName. Alt+Shift+Q,W,Z opens the eForms specified.
// @include     */casemgmt/forward.jsp?action=view&demographic*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       none
// ==/UserScript==


// ///////////////////////////////////////////////////////////////////////////////////////////
// // Load Array of Buttons
// ///////////////////////////////////////////////////////////////////////////////////////////



function loadMeasurementButtonShortcuts(measurementButtons){
	let buttonBlockID = 'measurementButtonBlock';
	removeAlreadyExistingElement_eChart(document.getElementById(buttonBlockID));
	addBlock(buttonBlockID);

	for (let i = 0; i < measurementButtons.length; i++){
		const oneMeasurementButton = measurementButtons[i];
		addOneMeasurementButton(oneMeasurementButton, (i+1), buttonBlockID);
	}
}


function loadEFormButtonShortcuts(eFormButtons){
	let buttonBlockID = 'eFormButtonBlock';
	removeAlreadyExistingElement_eChart(document.getElementById(buttonBlockID));
	addBlock(buttonBlockID);

	for (let i = 0; i < eFormButtons.length; i++){
		const oneEFormButton = eFormButtons[i];
		addOneEFormButton(oneEFormButton, (i+1), buttonBlockID);
	}
}

///////////////////////////////////////////////////////////////
// Load Buttons
///////////////////////////////////////////////////////////////

function addBlock(id){
	var targetDiv = document.getElementById('rightNavBar');
	var theBlock = document.createElement('div');
	theBlock.id = id;
	theBlock.class = 'rightBox';
	theBlock.style = 'display: block;';
	targetDiv.appendChild(theBlock);
}

function addOneMeasurementButton(oneMeasurementButton, buttonNum, buttonBlockID){
	// if not enabled, stop this function
	const enabled = oneMeasurementButton[`measurementButton_${buttonNum}_enabled`];
	if (!enabled){
		return;
	}
	
	const name = oneMeasurementButton[`measurementButton_${buttonNum}_name`];
	const groupName = oneMeasurementButton[`measurementButton_${buttonNum}_groupName`];
	const button_enabled = oneMeasurementButton[`measurementButton_${buttonNum}_button_enabled`];
	const shortcuts = oneMeasurementButton[`measurementButton_${buttonNum}_shortcuts`];
	const shortcuts_enabled = shortcuts[`measurementButton_${buttonNum}_shortcuts_enabled`];
	const shortcuts_keybinding = shortcuts[`measurementButton_${buttonNum}_shortcuts_keybinding`];

	// add listener for keyboard shortcut
	if(shortcuts_enabled){
		window.addEventListener('keydown', function(theEvent) {
			if(keybindingMatches(shortcuts_keybinding, theEvent)){
				// clickAction();
				openMeasurementLink(groupName);
			}
		});
	}

	if (button_enabled){
		addButtonMeasurement(`measurementButton${buttonNum}`, name, groupName, buttonBlockID);
	}
}


function addOneEFormButton(oneEFormButton, buttonNum, buttonBlockID){
	// if not enabled, stop this function
	const enabled = oneEFormButton[`eFormButton_${buttonNum}_enabled`];
	if (!enabled){
		return;
	}
	const name = oneEFormButton[`eFormButton_${buttonNum}_name`];
	const fid = oneEFormButton[`eFormButton_${buttonNum}_fid`];
	const button_enabled = oneEFormButton[`eFormButton_${buttonNum}_button_enabled`];
	const shortcuts = oneEFormButton[`eFormButton_${buttonNum}_shortcuts`];
	const shortcuts_enabled = shortcuts[`eFormButton_${buttonNum}_shortcuts_enabled`];
	const shortcuts_keybinding = shortcuts[`eFormButton_${buttonNum}_shortcuts_keybinding`];

	// add listener for keyboard shortcut
	if(shortcuts_enabled){
		window.addEventListener('keydown', function(theEvent) {
			if(keybindingMatches(shortcuts_keybinding, theEvent)){
				// clickAction();
				openEFormLink(fid);
			}
		});
	}

	if (button_enabled){
		addButtonEForm(`eFormButton${buttonNum}`, name, fid, buttonBlockID);
	}
}


/* 
PURPOSE
- if the given element already exists in the document, remove it.
 */
function removeAlreadyExistingElement_eChart(element){
	if(!!element){
		element.remove();
	}
}

 
 // wrap in block level element so button is next line.
function addButtonEForm(id, value, fid, divBlock){
	let targetDiv = document.getElementById(divBlock);
	if (targetDiv == null){
		targetDiv = document.getElementById('rightNavBar');
	}
	var inputButton = document.createElement('input');
	inputButton.id = id;
	inputButton.type = 'button';
	inputButton.value = value;
	targetDiv.appendChild(inputButton);	
	openEFormButton_ClickListener(id, fid);
}


 // wrap in block level element so button is next line.
function addButtonMeasurement(id, name, groupName, divBlock){
	let targetDiv = document.getElementById(divBlock);
	if (targetDiv == null){
		targetDiv = document.getElementById('rightNavBar');
	}
	var inputButton = document.createElement('input');
	inputButton.id = id;
	inputButton.type = 'button';
	inputButton.value = name;
	targetDiv.appendChild(inputButton);	
	openMeasurementButton_ClickListener(id, groupName);
}


///////////////////////////////////////////////////////////////
// Click Listener
///////////////////////////////////////////////////////////////

function openEFormButton_ClickListener(id, fid){
	var theButton = document.getElementById(id);
	theButton.addEventListener('click',function () { openEFormLink(fid); },true);
}

function openMeasurementButton_ClickListener(id, groupName){
	var theButton = document.getElementById(id);
	theButton.addEventListener('click',function () { openMeasurementLink(groupName); },true);
}

///////////////////////////////////////////////////////////////
// Open Link
///////////////////////////////////////////////////////////////
 
function openMeasurementLink(groupName){
	var elements = (window.location.pathname.split('/', 2));
	const firstElement = (elements.slice(1));
	const vPath = (location.protocol + "//" + location.host + "/"  + firstElement + "/");
  	
	var measurementPath = 
		vPath + "oscarEncounter/oscarMeasurements/SetupMeasurements.do?groupName=" + groupName;
	window.open(measurementPath);
}

function openEFormLink(fid){
	// if given FID is not an integer, open the emptyFID.html page.
	// console.log(fid);
	// console.log(Number(fid));
	// console.log(Number.isInteger(Number(fid)));
	if(fid == "" || !Number.isInteger(Number(fid))){
		window.open(browser.runtime.getURL("emptyFID.html"));
		return;
	}
	var elements = (window.location.pathname.split('/', 2));
	const firstElement = (elements.slice(1));
	const vPath = (location.protocol + "//" + location.host + "/"  + firstElement + "/");
  	
	var formPath = 
		vPath + "eform/efmformadd_data.jsp?fid=" + fid + "&demographic_no=" + findDemogNum();
	window.open(formPath)
}

function findDemogNum(){
	var myParam = location.search.split('demographicNo=')[1];
	//alert(myParam)
	var res = myParam.indexOf("&");
	var demo_no = myParam.substring(0,res);
	return demo_no;
}
