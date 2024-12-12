// ==UserScript==
// @name           Inbox_Buttons
// @namespace      oscar
// @include        */dms/inboxManage*
// @description		Within Inbox: A button that opens all reports (including acknowledged and filed reports), as well as one that open just new reports.
// @grant	   none
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_Inbox();
async function checkEnabled_Inbox(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const inboxObj = await browser.storage.local.get('inbox');
		const inbox = inboxObj.inbox;

		// Buttons
		const inbox_buttons = inbox.inbox_buttons;
		if(inbox_buttons){
			addButtonLoadNewReports();
			addButtonLoadTodayReports();
			addButtonLoadAllReports();
		}

		// Keyboard shortcuts
		const inbox_keyboardShortcuts = inbox.inbox_keyboardShortcuts;
		if (inbox_keyboardShortcuts.inbox_shortcuts_enabled){
			keydownEventListener_Inbox(inbox_keyboardShortcuts);
		}
	}
}

