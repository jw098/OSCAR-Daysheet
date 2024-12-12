// ==UserScript==
// @name           EChart_KeyboardShortcuts
// @namespace      oscar
// @include        */casemgmt/forward.jsp?action=view&*
// @description		Within the E-chart: Alt+1 to Sign/Save/Bill. Alt+2 to Save. Alt+3 to Sign/Save. Alt+4 to Exit. Alt+W, Alt+Q, Alt+A to open Consultation, eForms, Ticklers respectively. When the CPP pop-up windows are open (e.g. for Social History, Medical History, etc.), Alt+1 to Sign & Save, Escape to close the pop-up window.
// @grant	   none
// ==/UserScript==


function keydownEventListener_mainWindow(eChart_mainWindow_keyboardShortcuts){
	window.addEventListener('keydown', function(theEvent) {
		if (!CPPWindowPresent()){
			eChartPageHotkeys(eChart_mainWindow_keyboardShortcuts, theEvent);
		}
	
	}, true);
}

function keydownEventListener_CPPWindow(eChart_CPPWindow_keyboardShortcuts){
	window.addEventListener('keydown', function(theEvent) {
		if (CPPWindowPresent()){
			console.log('cpp window present');
			CPPWindowHotkeys(eChart_CPPWindow_keyboardShortcuts, theEvent);
		}
	
	}, true);
}




function eChartPageHotkeys(eChart_mainWindow_keyboardShortcuts, theEvent){
	const eChart_shortcut_meds_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_meds_enabled;
	const eChart_shortcut_meds_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_meds_keybinding;
	const eChart_shortcut_eforms_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_eforms_enabled;
	const eChart_shortcut_eforms_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_eforms_keybinding;		
	const eChart_shortcut_tickler_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_tickler_enabled;
	const eChart_shortcut_tickler_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_tickler_keybinding;		
	const eChart_shortcut_consults_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_consults_enabled;
	const eChart_shortcut_consults_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_consults_keybinding;			
	const eChart_shortcut_SignSaveBill_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_SignSaveBill_enabled;
	const eChart_shortcut_SignSaveBill_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_SignSaveBill_keybinding;	
	const eChart_shortcut_save_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_save_enabled;
	const eChart_shortcut_save_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_save_keybinding;	
	const eChart_shortcut_signSave_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_signSave_enabled;
	const eChart_shortcut_signSave_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_signSave_keybinding;	
	const eChart_shortcut_exit_enabled = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_exit_enabled;
	const eChart_shortcut_exit_keybinding = 
		eChart_mainWindow_keyboardShortcuts.eChart_shortcut_exit_keybinding;	
	

	let theTarget = null;
	switch(true){

		case eChart_shortcut_meds_enabled && 
			keybindingMatches(eChart_shortcut_meds_keybinding, theEvent):  // Medications
			const rxID = document.getElementById("Rx");
			theTarget = document.evaluate("//div[@id='Rx']//a[contains(text(), 'Medication')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			// theTarget = document.evaluate("//div[@id='Rx']/div/div/h3/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case eChart_shortcut_eforms_enabled && 
			keybindingMatches(eChart_shortcut_eforms_keybinding, theEvent):  // eForms
			theTarget = document.evaluate("//div[contains(@id, 'menuTitleeforms')]/h3/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

			// theTarget = document.evaluate("//div[@id='menuTitleeforms ']/h3/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case eChart_shortcut_consults_enabled && 
			keybindingMatches(eChart_shortcut_consults_keybinding, theEvent): // Consultation			

			theTarget = document.evaluate("//div[contains(@id, 'menuTitleconsultation')]/h3/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;  //"id('menuTitleconsultation ')/h3/a"  //"id('consultation')/div/div[2]/h3/a"  /html/body/div/div/div[4]/div[10]/div/div[2]/h3/a
		case eChart_shortcut_tickler_enabled && 
			keybindingMatches(eChart_shortcut_tickler_keybinding, theEvent):  // Tickler

			theTarget = document.evaluate("//div[contains(@id, 'menuTitletickler')]/h3/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case eChart_shortcut_SignSaveBill_enabled && 
			keybindingMatches(eChart_shortcut_SignSaveBill_keybinding, theEvent):  // Sign, Save, and Bill

			theTarget = document.evaluate("id('save')/span/*[self::input or self::a][contains(@title,'Bill')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

			// theTarget = document.evaluate("id('save')/span/input[contains(@src,'dollar-sign-icon.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case eChart_shortcut_save_enabled && 
			keybindingMatches(eChart_shortcut_save_keybinding, theEvent):  // Save
			theTarget = document.getElementById("saveImg");
			// theTarget = document.evaluate("id('save')/span/input[contains(@src,'media-floppy.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case eChart_shortcut_signSave_enabled && 
			keybindingMatches(eChart_shortcut_signSave_keybinding, theEvent):  // Sign and Save
			theTarget = document.getElementById("signSaveImg");
			// theTarget = document.evaluate("id('save')/span/input[contains(@src,'note-save.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;

			// setting focus to the button, and then clicking gives more consistent behavior. Otherwise, sometimes it gives the confirm dialog on close.
			theTarget.focus();
			setTimeout(function() {
				theTarget.click();				
			}, 50);
			// the manual closure of the window is because sometimes it doesn't automatically close after Save and Signing. This often happens when automatically pasting text from submitting a Tickler.
			setTimeout(function() {
				window.close();
			}, 500);
			break;
		case eChart_shortcut_exit_enabled && 
			keybindingMatches(eChart_shortcut_exit_keybinding, theEvent): // Exit
			window.close();
			// theTarget = document.evaluate("id('save')/span/input[contains(@src,'system-log-out.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			// theTarget.click();
			break;

	}
}

/*
PURPOSE:
- return true if the CPP popup window is present.
*/
function CPPWindowPresent(){
	return document.getElementById('frmIssueNotes').offsetParent != null;
}


function CPPWindowHotkeys(eChart_CPPWindow_keyboardShortcuts, theEvent){
	const CPPWindow_signSave_enabled = 
	eChart_CPPWindow_keyboardShortcuts.CPPWindow_shortcut_signSave_enabled;
	const CPPWindow_signSave_keybinding = 
	eChart_CPPWindow_keyboardShortcuts.CPPWindow_shortcut_signSave_keybinding;
	const CPPWindow_cancel_enabled = 
	eChart_CPPWindow_keyboardShortcuts.CPPWindow_shortcut_cancel_enabled;
	const CPPWindow_cancel_keybinding = 
	eChart_CPPWindow_keyboardShortcuts.CPPWindow_shortcut_cancel_keybinding;


	let theTarget = null;
	switch(true){
		case CPPWindow_signSave_enabled && 
			keybindingMatches(CPPWindow_signSave_keybinding, theEvent):  // Sign & Save

			theTarget = document.evaluate("id('frmIssueNotes')/span/input[contains(@src,'note-save.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
		case CPPWindow_cancel_enabled && keybindingMatches(CPPWindow_cancel_keybinding, theEvent):

			theTarget = document.evaluate("id('frmIssueNotes')/span/input[contains(@src,'system-log-out.png')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
			theTarget.click();
			break;
	}
}