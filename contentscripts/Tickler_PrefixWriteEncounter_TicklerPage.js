

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////

checkEnabled_TicklerPrefixWriteEncounter_TicklerPage();
async function checkEnabled_TicklerPrefixWriteEncounter_TicklerPage(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Tickler_KeyboardShortcuts enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const ticklerObj = await browser.storage.local.get('tickler');
		const tickler = ticklerObj.tickler;
		const prefixSubmitWrite = tickler.tickler_prefixWriteEncounter_submitWrite;
		const prefixSubmitExit = tickler.tickler_prefixWriteEncounter_submitExit;

		if(prefixSubmitExit){
			prefixWriteToEncounter_submitExit_TicklerPage();
		}

		if(prefixSubmitWrite){
			prefixWriteToEncounter_submitWrite_TicklerPage();
		}


	}
}





/////////////////////////////////////////////////////////
// Submit Exit
/////////////////////////////////////////////////////////



/* 
PURPOSE:
- when clicking button 'Submit and Exit', save to local storage the tickler message text 
and the person the task was assigned to.
- also, set writeEncounter to submitExit.
- also, send the message via BroadcastChannel
 */
function prefixWriteToEncounter_submitExit_TicklerPage(){
	const  submitExitButton = 
		document.evaluate("//input[@value='Submit and EXIT']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	submitExitButton.addEventListener("click",  async function(){
		saveMessageToStorageAndBroadcast("submitExit");
	});

}

/////////////////////////////////////////////////////////
// Submit Write
/////////////////////////////////////////////////////////

/* 
PURPOSE:
- when clicking button 'Submit & Write to Encounter', save to local storage the tickler message text 
and the person the task was assigned to.
- also, set writeEncounter to submitWriteEncounter.
 */
function prefixWriteToEncounter_submitWrite_TicklerPage(){
	const  submitWriteEncounterButton = 
		document.evaluate("//input[@value='Submit & Write to Encounter']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

	if(submitWriteEncounterButton != null){
		submitWriteEncounterButton.addEventListener("click", async function(){
			saveMessageToStorageAndBroadcast("submitWriteEncounter");
		});
	}
}



/* 
NOTE:
- writeEncounterType is either 'none', 'submitExit', 'submitWrite'. 
  - 'none' means no writeEncounter. 
  - 'submitExit' means Submit and EXIT. 
  - 'submitWrite' means Submit and write to encounter.
*/
async function saveMessageToStorageAndBroadcast(writeEncounterType){
	const taskAssignedToDropdown = document.querySelector("select[name='task_assigned_to']");
	const taskAssignedTo = taskAssignedToDropdown.options[taskAssignedToDropdown.selectedIndex].text;

	const messageTextArea = 
		document.evaluate("//textarea",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	const messageText = messageTextArea.value;

	console.log(taskAssignedTo);
	console.log(messageText)

	const patientName = document.querySelector("input[name='keyword']").value.replace(/[\s]/g, "");

	let ticklerMessage = {
		messageText: messageText,
		taskAssignedTo: taskAssignedTo,
		messagePatientName: patientName
	};

	/* 
	- postMessage sends the ticklerMessage data, which will be received by the encounterChannel listener,
	which was initialized by prefixWriteToEncounter_submitExit_writeTicklerWhenMessageEvent
	 */
	if(writeEncounterType == "submitExit"){
		const encounterChannel = new BroadcastChannel("encounterChannel");
		encounterChannel.postMessage({
			ticklerMessage
		});
	}

	await browser.storage.local.set({
		ticklerMessage,
		writeEncounter: writeEncounterType
	});

}

