




///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////

checkEnabled_TicklerPrefixWriteEncounter_EncounterPage();
async function checkEnabled_TicklerPrefixWriteEncounter_EncounterPage(){
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
			prefixWriteToEncounter_submitExit_EChartPage();
		}

		if(prefixSubmitWrite){
			prefixWriteToEncounter_EChartPage_writeFromStorageOnLoad("submitWriteEncounter");
		}

	}
}




/////////////////////////////////////////////////////////
// Submit Exit
/////////////////////////////////////////////////////////



/* 
NOTE:
- writeTicklerWhenMessageEvent: writes the tickler message if the eChart is already open when the Tickler is made.
- writeFromStorageOnLoad: writes the tickler message if the eChart was closed at the time of Tickler creation. 
This writes the tickler message when the eChart opens, as long as the patient name matches.
 */
function prefixWriteToEncounter_submitExit_EChartPage(){
	prefixWriteToEncounter_submitExit_writeTicklerWhenMessageEvent();
	prefixWriteToEncounter_EChartPage_writeFromStorageOnLoad("submitExit");
}

/* 
PURPOSE
- Adds event listener for the message event.
- when message received, posts the tickler message, if the patient name matches the message.
NOTE:
- this only works if the E-chart is already open when the Tickler was sent. Otherwise, the message won't be received.
- for the tickler message to be posted on eChart loading, see writeFromStorageOnLoad.
- after posting the message, set writeEncounter to "none", to avoid double posting. 
this is done on a delay to account for the case where eChart page is immediately refreshed upon posting the Tickler; 
by delaying resetting the writeEncounter to none, prefixWriteToEncounter_EChart_writeFromStorageOnLoad has a chance to post the message.
*/
function prefixWriteToEncounter_submitExit_writeTicklerWhenMessageEvent(){
	const encounterChannel = new BroadcastChannel("encounterChannel");
	encounterChannel.addEventListener("message", function(event){
		let ticklerMessage = event.data.ticklerMessage;
		console.log(ticklerMessage);
		if(patientNameMatchesMessage(ticklerMessage)){
			postTicklerMessage(ticklerMessage);

			clearStoredMessageData();
		}
	});

}



function postTicklerMessage(ticklerMessage){
	const targetTextArea = document.querySelector("textarea[id^='caseNote']");
	// console.log(targetTextArea);
	const originalContent = targetTextArea.value;
	const messageText = ticklerMessage.messageText;
	const taskAssignedTo = ticklerMessage.taskAssignedTo;

	console.log(originalContent);
	const newContent = 
		originalContent + `\n\n[Tickler message to ${taskAssignedTo}]\n ` + messageText + "\n-------------------------------------------\n";
	console.log(newContent);

	targetTextArea.value = newContent;
}
	

/* 
- set writeEncounter to none and clear message data
NOTES
- circumstances in which we clear message data:
  - after posting a message using BroadcastChannel
  - when opening EChart and the writeEncounterType is "none"
  - when opening EChart and the patient name doesn't match
  - when opening EChart and the patient name matches, after posting the message
*/
function clearStoredMessageData(){
	const ticklerMessage = {
		messageText: "",
		taskAssignedTo: "",
		messagePatientName: ""
	};

	setTimeout(async () => {
		await browser.storage.local.set({
			ticklerMessage,
			writeEncounter: "none"
		});
		console.log("set writeEncounter to none and cleared message data.");
	}, 1000)
}



/////////////////////////////////////////////////////////
// Submit Write
/////////////////////////////////////////////////////////

/* 
PURPOSE:
- prefix the tickler message with `Tickler message to ${taskAssignedTo}: `. and paste the message
when the eChart loads.
NOTES:
- get writeEncounter from local storage. proceed only if storedWriteEncounter matches given writeEncounterType. 
writeEncounterType tells us whether the 'Submit and Exit' or 'Submit and Write to Encounter' buttons were just pressed.
  - checking writeEncounterType also prevents double posting if both prefixSubmitExit and prefixSubmitWrite are enabled.
- set writeEncounter to 'none' to avoid posting tickler message text when not intended.
- post only if messagePatientName matches current patient
*/
async function prefixWriteToEncounter_EChartPage_writeFromStorageOnLoad(writeEncounterType){
	console.log("writeEncounterType: " + writeEncounterType);

	/* 
	- proceed only if storedWriteEncounter matches given writeEncounterType
	
	*/
	const storedWriteEncounterObj = await browser.storage.local.get('writeEncounter');
	const storedWriteEncounter = storedWriteEncounterObj.writeEncounter;
	console.log(storedWriteEncounter);
	if(storedWriteEncounter == "none"){
		clearStoredMessageData();
		return;
	}
	else if(storedWriteEncounter != writeEncounterType){
		return;
	}


	/* 
	get the ticklerMessage 
	*/
	const ticklerMessageObj = await browser.storage.local.get('ticklerMessage');
	let ticklerMessage = ticklerMessageObj.ticklerMessage;
	console.log(ticklerMessage);

	/* 
	- ensure it is the correct patient before proceeding.
	- if wrong patient, clear message data
	 */
	if(!patientNameMatchesMessage(ticklerMessage)){
		console.log("messagePatientName doesn't match current patient.")
		clearStoredMessageData();
		return;
	}
	
	/* 
	get the target text area 
	*/
	const targetTextArea =  await getTargetTextArea();
	// console.log(targetTextArea);

	/* 
	post tickler message to target text area, after the original content. 
	*/
	const originalContent = targetTextArea.value;
	const messageText = ticklerMessage.messageText;
	const taskAssignedTo = ticklerMessage.taskAssignedTo;
	const originalContentWithoutMessage = 
		getOriginalContentWithoutMessage(originalContent, messageText);
	console.log(originalContent);
	console.log(originalContentWithoutMessage);
	const newContent = 
		originalContentWithoutMessage + `\n[Tickler message to ${taskAssignedTo}]\n ` + messageText + "\n-------------------------------------------\n";
	console.log(newContent);

	targetTextArea.value = newContent;


	/* 
	- set writeEncounter to none and clear message data
	*/
	clearStoredMessageData();
	
}

/* 
NOTE:
- Tickler Write to Encounter will automatically post the message to the Encounter. This function removes that text so we only get the original content, without the message.
- sometimes, the tickler message isn't automatically posted though.
 */
function getOriginalContentWithoutMessage(originalContent, messageText){
	const lastIndexOfText = originalContent.lastIndexOf(messageText);
	if (lastIndexOfText < 0) {
		return originalContent;
	}
	else {
		return originalContent.substring(0, lastIndexOfText);
	}

}

/* 
PURPOSE:
- get the text in the current active text area.
NOTE
- can't just use queryselector("textarea[id^='caseNote']") because it doesn't load right away. id="notCPP" loads right away, but the case notes do not.
- so, we wait for the page to fully load, and set focus to the case note, by which time it has loaded.
*/
function getTargetTextArea(){
	return new Promise(function(resolve, reject){
		
		document.addEventListener("focusin", setTargetFocus);
	
		function setTargetFocus(event){
			document.removeEventListener('focusin',setTargetFocus);
			resolve(document.querySelector("textarea[id^='caseNote']"));
		}
	});
}


function patientNameMatchesMessage(ticklerMessage){
	let currentPatientName = document.querySelectorAll(".Header > a:nth-child(1)")[0].innerText.replace(/[\s]/g, "");
	let messagePatientName = ticklerMessage.messagePatientName;
	

	currentPatientName = currentPatientName.toUpperCase().split("(")[0];
	messagePatientName = messagePatientName.toUpperCase().split("(")[0];
	console.log(currentPatientName);
	console.log(messagePatientName);

	return currentPatientName == messagePatientName;

}
