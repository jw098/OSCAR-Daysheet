// ==UserScript==
// @name           AppointmentsEdit
// @namespace      oscar
// @include        *appointment/appointmentcontrol.jsp* 
// @description		
// @grant       none
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////

checkEnabled_ApptEdit();
async function checkEnabled_ApptEdit(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log(await browser.storage.local.get(null));
	
	if(!isEnabled.enabled){
		return;
	}
	else {
		const apptEditObj = await browser.storage.local.get('apptEdit');
		const apptEdit = apptEditObj.apptEdit;
		const apptEdit_keyboardShortcuts = apptEdit.apptEdit_keyboardShortcuts;
		if (apptEdit_keyboardShortcuts.apptEdit_shortcuts_enabled){
			apptEdit_KeyDownListener(apptEdit_keyboardShortcuts);
		}
	}


}
///////////////////////////////////////////////////////////////////////////////////////////
// Event Listeners
///////////////////////////////////////////////////////////////////////////////////////////


function apptEdit_KeyDownListener(apptEdit_keyboardShortcuts){
	const updateAppt_enabled = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_updateAppt_enabled;
	const updateAppt_keybinding = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_updateAppt_keybinding;
	const dur10_enabled = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur10_enabled;
	const dur10_keybinding = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur10_keybinding;
	const dur15_enabled = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur15_enabled;
	const dur15_keybinding = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur15_keybinding;	
	const dur20_enabled = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur20_enabled;
	const dur20_keybinding = 
		apptEdit_keyboardShortcuts.apptEdit_shortcut_dur20_keybinding;	

	window.addEventListener('keydown', function(theEvent) {
		let theTarget;
		switch(true){
			case updateAppt_enabled && keybindingMatches(updateAppt_keybinding, theEvent):

				const xpath = '//*[@id="updateButton"]';
				theTarget = document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE ,null).singleNodeValue;            
				theTarget.click();
				break;
			case dur10_enabled && keybindingMatches(dur10_keybinding, theEvent):
				theTarget = document.querySelector("input[name='duration']");
				theTarget.value = 10;
				break;
			case dur15_enabled && keybindingMatches(dur15_keybinding, theEvent):
				theTarget = document.querySelector("input[name='duration']");
				theTarget.value = 15;
				break;
			case dur20_enabled && keybindingMatches(dur20_keybinding, theEvent):
				theTarget = document.querySelector("input[name='duration']");
				theTarget.value = 20;
				break;									
		}
	}, true);
}


