// ==UserScript==
// @name           Inbox_KeyboardShortcuts
// @namespace      oscar
// @include        */lab/CA/ALL/labDisplay*
// @include        */dms/showDocument*
// @include        */dms/MultiPageDocDisplay.jsp*
// @description		Within Inbox: Alt+1 to open first item. Within the Lab result: Alt+1 to Acknowledge. Alt+Q to open E-chart. Alt+W to open Tickler. 
// @grant	   none
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_InboxItem();
async function checkEnabled_InboxItem(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const inboxItemObj = await browser.storage.local.get('inboxItem');
		const inboxItem = inboxItemObj.inboxItem;
		// Label Labs
		if(inboxItem.inboxItem_labelLabs){
			// labelCurrentLabs();
			labelAllLabs();
		}

		// labelLabsKeydownListener();

		// Keyboard shortcuts
		const inboxItem_keyboardShortcuts = inboxItem.inboxItem_keyboardShortcuts;
		if (inboxItem_keyboardShortcuts.inboxItem_shortcuts_enabled){
			keydownEventListener_InboxItem(inboxItem_keyboardShortcuts);
		}
	}
}