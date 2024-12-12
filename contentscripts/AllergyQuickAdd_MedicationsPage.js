

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_AllergyQuickAdd_MedicationsPage();
async function checkEnabled_AllergyQuickAdd_MedicationsPage(){
	const isEnabled = await browser.storage.local.get('enabled');

	console.log("Allergy_QuickAdd enabled? " + isEnabled.enabled);
	console.log(isEnabled);


	if(!isEnabled.enabled){
		return;
	}
	else {
		const allergyQuickAddObj = await browser.storage.local.get('allergyQuickAdd');
		const allergyQuickAdd = allergyQuickAddObj.allergyQuickAdd;
		if (allergyQuickAdd){
			medPage_AddAllergyButtons();
		}
	}
}


/* 
PURPOSE
- on the Medication page, add the allergy buttons if the Allergies not yet set.
 */
async function medPage_AddAllergyButtons(){
	if(areAllergiesNotSet_MedsPage()){
		addButtonNKDA_FromMedPage();
		addPenicillinButton_FromMedPage();
		addSulfaButton_FromMedPage();
	}
	else if (isNKDA()){
		addButtonRemoveNKDA_FromMedPage();
	}
	// medPageKeydownListener();
	await browser.storage.local.set({ nextPageValue: 'stop'});
}

/* 
- returns true if NKDA has been set as one of the allergies
 */
function isNKDA(){
	let allergyEntry = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/div/p[3]/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	const allergyEntryList = document.querySelectorAll("p.PropSheetMenuItemLevel1 > a:nth-child(1):not([href])");
	console.log(allergyEntryList);
	for (let i = 0; i < allergyEntryList.length; i++){
		const allergyEntry = allergyEntryList[i];
		const allergyEntryText = allergyEntry.innerText;
		if(allergyEntryText.includes("NKDA")){
			return true;
		}
	}
	return false;
}

/*
- returns true if allergies have not been set.
*/
function areAllergiesNotSet_MedsPage(){
	let allergyEntry = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/div/p[3]/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	return allergyEntry == null;
}

/////////////////////////////////////////////
// Change page
/////////////////////////////////////////////


/*
note:
- assumes current page is Medications
*/
function fromMedsToAddAllergy(){
	let addAllergyButton = document.evaluate("//div[@class='PropSheetMenu']/p[1]/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	addAllergyButton.click();
}


/////////////////////////////////////////////
// Keydown listener
/////////////////////////////////////////////

//currently disabled
/*
- keyboard shortcuts on the Medications page.
*/
function medPageKeydownListener(){
	window.addEventListener('keydown', function (theEvent){
		const theKey = theEvent.key;
		const theAltKey = theEvent.altKey;
		switch(true){
			case theAltKey && theKey == 'z':
				document.getElementById('autoNKDAButton').click();
				break;
		}
	}, true);
}



/////////////////////////////////////////////
// Add button on Medication Page
/////////////////////////////////////////////


function addButtonRemoveNKDA_FromMedPage(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("removeNKDAButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="removeNKDAButton" type="button" value="Remove NKDA" title = "Automatically clicks through the pages and removes NKDA from the allergy list. User must confirm to inactivate the allergy." style="font-size:14px"><br/>');

	addButtonRemoveNKDAListener_FromMedPage();	
}

function addButtonRemoveNKDAListener_FromMedPage(){
	var theButton = document.getElementById('removeNKDAButton');
	theButton.addEventListener('click', async function () { 
  		fromMedsToAddAllergy();
		await browser.storage.local.set({ nextPageValue:"toRemoveNKDAThenMedsThenStop"})
  	},true);
}

/* 
- add a NKDA button that automatically clicks through and ends up back in Meds.
*/ 
function addButtonNKDA_FromMedPage(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("autoNKDAButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="autoNKDAButton" type="button" value="Set NKDA" title = "Automatically clicks through the pages and adds NKDA to the allergy list" style="background-color: red; font-size:14px"><br/>');

	// var inputButton = document.createElement('input');
	// inputButton.id = 'autoNKDAButton';
	// inputButton.type = 'button';
	// inputButton.value = 'Auto NKDA';
	// inputButton.style.backgroundColor = 'red';
	// targetDiv.before(inputButton);	
	addButtonNKDAListener_FromMedPage();
}

function addButtonNKDAListener_FromMedPage(){
	var theButton = document.getElementById('autoNKDAButton');
	theButton.addEventListener('click', async function () { 
  		fromMedsToAddAllergy();
		await browser.storage.local.set({ nextPageValue:"toAddNKDAThenAddReactionThenAddAllergyThenMedsThenStop"})
  	},true);
}

function addPenicillinButton_FromMedPage(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addPenicillinButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="addPenicillinButton" type="button" value="Add Penicillin Allergy" style="background-color: red; font-size:14px"><br/>');
	addPenicillinButtonListener_FromMedPage();
}

function addPenicillinButtonListener_FromMedPage(){
	var theButton = document.getElementById('addPenicillinButton');
	theButton.addEventListener('click', async function () { 
  		fromMedsToAddAllergy();
		await browser.storage.local.set({ nextPageValue:"PENtoAddReaction"})
  	},true);
}

function addSulfaButton_FromMedPage(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addSulfaButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="addSulfaButton" type="button" value="Add Sulfa Allergy" style="background-color: red; font-size:14px"><br/>');
	addSulfaButtonListener_FromMedPage();
}

function addSulfaButtonListener_FromMedPage(){
	var theButton = document.getElementById('addSulfaButton');
	theButton.addEventListener('click', async function () { 
  		fromMedsToAddAllergy();
		await browser.storage.local.set({ nextPageValue:"SULFAtoAddReaction"})
  	},true);
}




