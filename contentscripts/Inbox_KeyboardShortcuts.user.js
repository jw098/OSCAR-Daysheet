// ==UserScript==
// @name           Inbox_KeyboardShortcuts
// @namespace      oscar
// @include        */lab/CA/ALL/labDisplay*
// @include        */dms/inboxManage*
// @include        */dms/showDocument*
// @include        */dms/MultiPageDocDisplay.jsp*
// @description		Within Inbox: Alt+1 to open first item. Within the Lab result: Alt+1 to Acknowledge. Alt+Q to open E-chart. Alt+W to open Tickler. 
// @grant	   none
// ==/UserScript==


function keydownEventListener_Inbox(inbox_keyboardShortcuts){
	const close_enabled = 
		inbox_keyboardShortcuts.inbox_shortcut_close_enabled;
	const close_keybinding = 
		inbox_keyboardShortcuts.inbox_shortcut_close_keybinding;
	const openResult_enabled = 
		inbox_keyboardShortcuts.inbox_shortcut_openResult_enabled;
	const openResult_keybinding = 
		inbox_keyboardShortcuts.inbox_shortcut_openResult_keybinding;

	window.addEventListener('keydown', function(theEvent) {
		// case (!!document.getElementById("docViews")):	// If in the inbox, whose XML contains id = "docViews"
		switch(true){
			case close_enabled && keybindingMatches(close_keybinding, theEvent): // Alt+z: Close inbox		
				window.close();
				break;
			case openResult_enabled && keybindingMatches(openResult_keybinding, theEvent): // Alt+1: Open first item in inbox		
				getNextTarget().click();
				break;
		}

	
	}, true);
}



function getNextTarget() {
	
	const allInTBody = document.querySelectorAll('tbody[id="summaryBody"] > tr');
	console.log(allInTBody);
	let index = 1;
	for (const element of allInTBody) {
		// console.log(index);
		const styleAttribute = element.getAttribute('style');
		if (styleAttribute != 'display: none;'){  // Lab result not hidden. i.e not recently acknowledged.
			break;
		}
    index++;
	}
	console.log(index);
	
	return document.evaluate("//tbody[@id='summaryBody']/tr[" + index + "]/td[2]/a",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
}

