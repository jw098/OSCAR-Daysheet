

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_AllergyQuickAdd_AddAllergyPage();
async function checkEnabled_AllergyQuickAdd_AddAllergyPage(){
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
			addAllergyPage_Actions();
		}
	}
}



async function addAllergyPage_Actions(){
	const nextPageObj = await browser.storage.local.get('nextPageValue');
	const nextPage = nextPageObj.nextPageValue;
	// console.log('nextPage: ' + nextPage);
	switch (nextPage){
		case 'toAddNKDAThenAddReactionThenAddAllergyThenMedsThenStop':  // from Med. going to Add Reaction
			NKDAFromAddAllergyToAddReaction();  // clicks the default NKDA button, which adds NKDA and goes to Add Reaction.
			await browser.storage.local.set({ nextPageValue:"toAddAllergyThenMedsThenStop"});

			break;
		case 'toMedsThenStop': // from Add Reaction. going to Med.
			fromAddAllergyToMedications();
			await browser.storage.local.set({ nextPageValue:"stop"});
			break;
		case 'PENtoAddReaction': 
			penFromAddAllergyToAddReaction();
			await browser.storage.local.set({ nextPageValue:"stop"});
			break;					
		case 'SULFAtoAddReaction': 
			sulfaFromAddAllergyToAddReaction();
			await browser.storage.local.set({ nextPageValue:"stop"});
			break;
		case 'toRemoveNKDAThenMedsThenStop':
			removeNKDA();
			await browser.storage.local.set({ nextPageValue:"toMedsThenStop"});
			break;
		default:
			if(areAllergiesNotSet_AddAllergyPage()){
				addButtonNKDA_FromAddAllergy();	
			}
			addPenicillinButton_FromAddAllergy();
			addSulfaButton_FromAddAllergy();
			// medPageKeydownListener();	
			addButtonBackToSearchDrugs();

	}
}

/*
- returns true if allergies have not been set.
*/
function areAllergiesNotSet_AddAllergyPage(){
	let allergyEntry = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/div/p[3]/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	return allergyEntry == null;
}


/* 
- click the add allergy button. The page should then refresh from Add Allergy to Add Allergy.
 */
function clickAddAllergy_fromAddAllergyPage_toAddAllergyPage_oscar19(){
	const addAllergyButton = document.evaluate("//input[contains(@value, 'Add Allergy')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	addAllergyButton.click();
}

/* 
- assumes we are on Add Allergy page
- inactivates the NKDA allergy entry.
 */
function removeNKDA(){
	const allergyEntryList = document.querySelectorAll(".allergy_table > tbody:nth-child(1) > tr");
	for (let i = 1; i < allergyEntryList.length; i++){
		const allergyEntry = allergyEntryList[i];
		const allergyEntryValues = allergyEntry.children;
		const allergyDescription = allergyEntryValues[2].innerText;
		// console.log(allergyDescription);
		if (allergyDescription == "NKDA"){
			const inactivate = allergyEntryValues[11].children[1];
			// console.log(inactivate);
			inactivate.click();
		}
	}
}

function sendEnter(){
	const ke = new KeyboardEvent('keydown', {
		bubbles: true, cancelable: true, keyCode: 13
	});
	document.body.dispatchEvent(ke);
}



/////////////////////////////////////////////
// Changes the page from one to another
/////////////////////////////////////////////

/*
NOTE:
- assumes the current page is the Add Allergy Page.
*/
function  NKDAFromAddAllergyToAddReaction(){
	let defaultNKDAButton = document.evaluate("//input[@value='NKDA']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	// let defaultNKDAButton = document.evaluate("//form[@name='RxSearchAllergyForm']/table[1]/tbody/tr[3]/td/input[4]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	/* 
	- if OSCAR 15: clicking the button should bring you to the Add Reaction page
	 */
	defaultNKDAButton.click();

	/* 
	- if OSCAR 19: clicking the button will keep you on the same page
	 */
	clickAddAllergy_ifOscar19();
}


/* 
In OSCAR 19, Add Reaction page no longer exists, and we stay on the same page.
- So, if we're still on the addAllergy page, we are likely in OSCAR 19.
- if in OSCAR 19, click the add Allergy button.
*/
function clickAddAllergy_ifOscar19(){
	setTimeout(async () => {
		if(isAddAllergyPage()){
			clickAddAllergy_fromAddAllergyPage_toAddAllergyPage_oscar19();
			await browser.storage.local.set({ nextPageValue:"toMedsThenStop"});

		}
	}, 100);
}

function isAddAllergyPage(){
	let addAllergyPage1 = /oscarRx\/ShowAllergies2\.jsp/;
	let addAllergyPage2 = /oscarRx\/deleteAllergy\.do/;
	let addAllergyPage3 = /oscarRx\/showAllergy\.do/;
	let currentURL = window.location.href;

	return addAllergyPage1.test(currentURL) || addAllergyPage2.test(currentURL) || addAllergyPage3.test(currentURL);

}

/*
NOTE:
- assumes the current page is the Add Allergy Page.
*/
function  fromAddAllergyToMedications(){
	// let backToMedications = document.evaluate("//input[@value='Back to Search Drug']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	// backToMedications.click();

	let addMedicationsURL = getURLOrigin() + "oscarRx/SearchDrug3.jsp";
	window.open(addMedicationsURL, "_self");
	
}

function penFromAddAllergyToAddReaction(){
	let defaultPenicillinButton = document.evaluate("//input[@value='Penicillin']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	// let defaultPenicillinButton = document.evaluate("//form[@name='RxSearchAllergyForm']/table[1]/tbody/tr[3]/td/input[5]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	defaultPenicillinButton.click();

}

function sulfaFromAddAllergyToAddReaction(){
	let defaultSulfaButton = document.evaluate("//input[@value='Sulfa']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	// let defaultSulfaButton = document.evaluate("//form[@name='RxSearchAllergyForm']/table[1]/tbody/tr[3]/td/input[6]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	defaultSulfaButton.click();	

}





/////////////////////////////////////////////
// Add button on Add Allergy page Page
/////////////////////////////////////////////


/* 
- add a NKDA button that automatically
*/ 
function addButtonNKDA_FromAddAllergy(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("autoNKDAButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	
	// console.log(activeAllergies);
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="autoNKDAButton" type="button" value="Set NKDA" title = "Automatically clicks through the pages and adds NKDA to the allergy list" style="background-color: red; font-size:14px"><br/>');

	// var inputButton = document.createElement('input');
	// inputButton.id = 'autoNKDAButton';
	// inputButton.type = 'button';
	// inputButton.value = 'Auto NKDA';
	// inputButton.style.backgroundColor = 'red';
	// targetDiv.before(inputButton);	
	addButtonNKDAListener_FromAddAllergy();
}

 
function addButtonNKDAListener_FromAddAllergy(){
	var theButton = document.getElementById('autoNKDAButton');
	theButton.addEventListener('click', async function () { 
		NKDAFromAddAllergyToAddReaction();
		await browser.storage.local.set({ nextPageValue:"toAddAllergyThenMedsThenStop"});
  	},true);
}

function addButtonBackToSearchDrugs(){
	// const backToSearchDrugButton = document.evaluate("//input[@value='Back to Search Drug']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	// if(backToSearchDrugButton == null){
	
	// }

	removeAlreadyExistingElementAndBrTag(document.getElementById("backToSearchDrugButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="backToSearchDrugButton" type="button" value="Back to Search Drug" style="background-color: lightBlue; font-size:14px"><br/>');
	addButtonBackToSearchDrugs_buttonListener();

}

function addButtonBackToSearchDrugs_buttonListener(){
	var theButton = document.getElementById('backToSearchDrugButton');
	theButton.addEventListener('click', function () { 
		let addMedicationsURL = getURLOrigin() + "oscarRx/SearchDrug3.jsp";
		window.open(addMedicationsURL, "_self");
  	},true);
}

function addPenicillinButton_FromAddAllergy(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addPenicillinButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="addPenicillinButton" type="button" value="Add Penicillin Allergy" style="background-color: red; font-size:14px"><br/>');
	addPenicillinButtonListener_FromAddAllergy();
}

function addPenicillinButtonListener_FromAddAllergy(){
	var theButton = document.getElementById('addPenicillinButton');
	theButton.addEventListener('click', function () { 
		penFromAddAllergyToAddReaction();
  	},true);
}

function addSulfaButton_FromAddAllergy(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addSulfaButton"));
	let activeAllergies = document.evaluate("//div[@class='PropSheetMenu']/p[1]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	let targetDiv = activeAllergies;

	targetDiv.insertAdjacentHTML('beforebegin',	'<input id="addSulfaButton" type="button" value="Add Sulfa Allergy" style="background-color: red; font-size:14px"><br/>');
	addSulfaButtonListener_FromAddAllergy();
}

function addSulfaButtonListener_FromAddAllergy(){
	var theButton = document.getElementById('addSulfaButton');
	theButton.addEventListener('click', function () { 
  		sulfaFromAddAllergyToAddReaction();
  	},true);
}

function addButtonAddAllergyThenToMeds_FromAddAllergy(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addAllergyThenToMeds"));
	const targetDivChild = document.evaluate("//input[contains(@value, 'Add Allergy')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	const targetDiv = targetDivChild.parentElement.parentElement;

	targetDiv.insertAdjacentHTML('beforeend',	'<input id="addAllergyThenToMeds" type="button" value="Add Allergy Then To Medications" style="background-color: red; font-size:14px">');
	buttonListenerAddAllergyThenToMeds_FromAddAllergy();

}

function buttonListenerAddAllergyThenToMeds_FromAddAllergy(){
	var theButton = document.getElementById('addAllergyThenToMeds');
	theButton.addEventListener('click', async function () { 
  		// fromAddReactiontoAddAllergy();  		
		await browser.storage.local.set({ nextPageValue:"toMedsThenStop"})
  	},true);
}
