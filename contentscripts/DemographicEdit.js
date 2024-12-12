// ==UserScript==
// @name           AppointmentsEdit
// @namespace      oscar
// @include        /demographic/demographiccontrol.jsp
// @description		
// @grant       none
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////

checkEnabled_demographicEdit();
async function checkEnabled_demographicEdit(){
	const isEnabled = await browser.storage.local.get('enabled');
	
	if(!isEnabled.enabled){
		return;
	}
	else {
		const demographicEditObj = await browser.storage.local.get('demographicEdit');
		const demographicEdit = demographicEditObj.demographicEdit;
		const demographicEdit_keyboardShortcuts = demographicEdit.demographicEdit_keyboardShortcuts;
		if (demographicEdit_keyboardShortcuts.demographicEdit_shortcuts_enabled){
			demographicEdit_KeyDownListener(demographicEdit_keyboardShortcuts);
		}
	}


}
///////////////////////////////////////////////////////////////////////////////////////////
// Event Listeners
///////////////////////////////////////////////////////////////////////////////////////////


function demographicEdit_KeyDownListener(demographicEdit_keyboardShortcuts){
	const updateRecord_enabled = 
		demographicEdit_keyboardShortcuts.demographicEdit_shortcut_updateRecord_enabled;
	const updateRecord_keybinding = 
		demographicEdit_keyboardShortcuts.demographicEdit_shortcut_updateRecord_keybinding;

	window.addEventListener('keydown', function(theEvent) {
		let theTarget;
		switch(true){
			case updateRecord_enabled && keybindingMatches(updateRecord_keybinding, theEvent):
				const xpath = '//*[@id="updateButton"]/input[@value="Update Record"]';
				theTarget = document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE ,null).singleNodeValue;       
				console.log(theTarget);
				theTarget.click();
				break;
		}
	}, true);
}


