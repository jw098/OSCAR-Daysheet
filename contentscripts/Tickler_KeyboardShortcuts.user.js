// ==UserScript==
// @name           Tickler_KeyboardShortcuts
// @namespace      oscar
// @include        */tickler/ticklerAdd.jsp*
// @include        */tickler/ForwardDemographicTickler*
// @description		Within Ticklers, Alt+1 to 'Submit and EXIT', Alt+2 to 'Submit & Write to Encounter', Alt+A to set focus to text box. When the Tickler page loads, it also automatically sets focus to the text box. Note: if not already done, you should consider setting a 'Default Tickler Recipient' under OSCAR Preferences.
// @grant	   none
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////

checkEnabled_Tickler();
async function checkEnabled_Tickler(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Tickler_KeyboardShortcuts enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const ticklerObj = await browser.storage.local.get('tickler');
		const tickler = ticklerObj.tickler;

		// keydown event listener
		const tickler_keyboardShortcuts = tickler.tickler_keyboardShortcuts;
		if (tickler_keyboardShortcuts.tickler_shortcuts_enabled){
			keyDownListener_Tickler(tickler_keyboardShortcuts);
		}

		// set focus to text area
		if(tickler.tickler_setFocusTextArea){
			setFocusToTicklerTextArea();
		}
		
	}
}

///////////////////////////////////////////////////////////////////////////////////////////
// Keydown Event Listeners
///////////////////////////////////////////////////////////////////////////////////////////


function keyDownListener_Tickler(tickler_keyboardShortcuts){
	const close1_enabled = 
		tickler_keyboardShortcuts.tickler_shortcut_close1_enabled;
	const close1_keybinding = 
		tickler_keyboardShortcuts.tickler_shortcut_close1_keybinding;
	const close2_enabled = 
		tickler_keyboardShortcuts.tickler_shortcut_close2_enabled;
	const close2_keybinding = 
		tickler_keyboardShortcuts.tickler_shortcut_close2_keybinding;
	const submit_enabled = 
		tickler_keyboardShortcuts.tickler_shortcut_submit_enabled;
	const submit_keybinding = 
		tickler_keyboardShortcuts.tickler_shortcut_submit_keybinding;
	const submitWrite_enabled = 
		tickler_keyboardShortcuts.tickler_shortcut_submitWrite_enabled;
	const submitWrite_keybinding = 
		tickler_keyboardShortcuts.tickler_shortcut_submitWrite_keybinding;
	const setFocusTextArea_enabled = 
		tickler_keyboardShortcuts.tickler_shortcut_setFocusTextArea_enabled;
	const setFocusTextArea_keybinding = 
		tickler_keyboardShortcuts.tickler_shortcut_setFocusTextArea_keybinding;

	window.addEventListener('keydown', function(theEvent) {
		switch(true){
			case close1_enabled && keybindingMatches(close1_keybinding, theEvent):
			// hotkeys to close window.
				window.close();
				break;
			case close2_enabled && keybindingMatches(close2_keybinding, theEvent):
			// hotkeys to close window.
				window.close();
				break;
			case submit_enabled && keybindingMatches(submit_keybinding, theEvent):
				var theTarget = document.evaluate("//input[@value='Submit and EXIT']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
			case submitWrite_enabled && keybindingMatches(submitWrite_keybinding, theEvent):
				var theTarget = document.evaluate("//input[@value='Submit & Write to Encounter']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
			case setFocusTextArea_enabled 
				&& keybindingMatches(setFocusTextArea_keybinding, theEvent):
				
				var theTarget = document.evaluate("//textarea",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.focus();
				break;				
		}  
				
	}, true);

}

///////////////////////////////////////////////////////////////////////////////////////////
// Set focus
///////////////////////////////////////////////////////////////////////////////////////////

function setFocusToTicklerTextArea(){
	const theTarget = document.evaluate("//textarea",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	
	setTimeout(function(){
		theTarget.focus();
	}, 200);
	
}


