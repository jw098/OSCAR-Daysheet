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

checkEnabled_apptAdd();
async function checkEnabled_apptAdd(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log(await browser.storage.local.get(null));
	
	if(!isEnabled.enabled){
		return;
	}
	else {
		const apptAddObj = await browser.storage.local.get('apptAdd');
		const apptAdd = apptAddObj.apptAdd;
		const apptAdd_keyboardShortcuts = apptAdd.apptAdd_keyboardShortcuts;
		if (apptAdd_keyboardShortcuts.apptAdd_shortcuts_enabled){
			apptAdd_KeyDownListener(apptAdd_keyboardShortcuts);
		}
	}


}
///////////////////////////////////////////////////////////////////////////////////////////
// Event Listeners
///////////////////////////////////////////////////////////////////////////////////////////


function apptAdd_KeyDownListener(apptAdd_keyboardShortcuts){
	const updateAppt_enabled = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_updateAppt_enabled;
	const updateAppt_keybinding = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_updateAppt_keybinding;
	const dur10_enabled = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur10_enabled;
	const dur10_keybinding = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur10_keybinding;
	const dur15_enabled = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur15_enabled;
	const dur15_keybinding = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur15_keybinding;	
	const dur20_enabled = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur20_enabled;
	const dur20_keybinding = 
		apptAdd_keyboardShortcuts.apptAdd_shortcut_dur20_keybinding;	

	window.addEventListener('keydown', function(theEvent) {
		let theTarget;
		switch(true){
			case updateAppt_enabled && keybindingMatches(updateAppt_keybinding, theEvent):

				console.log(document.querySelector("#addButton"));
				const xpath = '//*[@id="addButton"]';
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


