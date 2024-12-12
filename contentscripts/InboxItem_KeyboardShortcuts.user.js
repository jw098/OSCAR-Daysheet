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
// Keydown Event Listener
///////////////////////////////////////////////////////////////////////////////////////////

function keydownEventListener_InboxItem(inboxItem_keyboardShortcuts){
	const acknowledge_enabled = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_acknowledge_enabled;
	const acknowledge_keybinding = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_acknowledge_keybinding;
	const openEChart_enabled = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_openEChart_enabled;
	const openEChart_keybinding = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_openEChart_keybinding;
	const openTickler_enabled = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_openTickler_enabled;
	const openTickler_keybinding = 
		inboxItem_keyboardShortcuts.inboxItem_shortcut_openTickler_keybinding;

	window.addEventListener('keydown', function(theEvent) {

		switch(true){
			case acknowledge_enabled && keybindingMatches(acknowledge_keybinding, theEvent):
				var theTarget = document.evaluate("//input[@value='Acknowledge']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();					
				break;		
			case openEChart_enabled && keybindingMatches(openEChart_keybinding, theEvent):
				var theTarget = document.evaluate("//input[contains(@value, 'E-Chart') or contains(@value, 'eChart')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
			case openTickler_enabled && keybindingMatches(openTickler_keybinding, theEvent):
				var theTarget = document.evaluate("//input[@value='Tickler']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
		}

	
	}, true);
}


