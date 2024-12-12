

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_AllergyQuickAdd_AddReactionPage();
async function checkEnabled_AllergyQuickAdd_AddReactionPage(){
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
			addReactionPage_Actions();
		}
	}
}




async function addReactionPage_Actions(){
	const nextPageObj = await browser.storage.local.get('nextPageValue');
	const nextPage = nextPageObj.nextPageValue;
	switch (nextPage){
		case 'toAddAllergyThenMedsThenStop':
			fromAddReactiontoAddAllergy();
			await browser.storage.local.set({ nextPageValue:"toMedsThenStop"})
			break;
		default:
			addButtonAddAllergyThenToMeds_FromAddReaction();
	}
}

/////////////////////////////////////////////
// Change page
/////////////////////////////////////////////


/*
NOTE:
- assumes the current page is the Add Reaction Page.
*/
function fromAddReactiontoAddAllergy(){
	let addReactionButton = document.evaluate("//input[@value='Add Allergy/Adverse Reaction']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	addReactionButton.click();
	
}



/////////////////////////////////////////////
// Add button on Add Reaction page Page
/////////////////////////////////////////////


/*
- assumes current page is AddReaction.
*/
function addButtonAddAllergyThenToMeds_FromAddReaction(){
	removeAlreadyExistingElementAndBrTag(document.getElementById("addAllergyThenToMeds"));
	const targetDivChild = document.evaluate("//input[contains(@value, 'Add Allergy')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	const targetDiv = targetDivChild.parentElement.parentElement;
	// let targetDiv = document.evaluate("//form[@name='RxAddAllergyForm']/table[1]/tbody/tr[9]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	targetDiv.insertAdjacentHTML('beforeend',	'<input id="addAllergyThenToMeds" type="button" value="Add Allergy Then To Medications" style="background-color: red; font-size:14px">');
	buttonListenerAddAllergyThenToMeds_FromAddReaction();

}

function buttonListenerAddAllergyThenToMeds_FromAddReaction(){
	var theButton = document.getElementById('addAllergyThenToMeds');
	theButton.addEventListener('click', async function () { 
  		fromAddReactiontoAddAllergy();  		
		await browser.storage.local.set({ nextPageValue:"toMedsThenStop"})
  	},true);
}
