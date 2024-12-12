// ==UserScript==
// @name           eForms_KeyboardShortcuts
// @namespace      oscar
// @include        */eform/efmformslistadd.jsp*
// @include        */eform/efmformadd_data.jsp*
// @include        */eform/efmshowform_data.jsp*
// @description		Within e-forms repository, Alt+A to close. Within an individual e-form: Alt+1 to Submit. Alt+2 to Print & Submit.
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant	   none
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_eFormLibrary();
async function checkEnabled_eFormLibrary(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("eForm library enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const eFormObj = await browser.storage.local.get('eFormLibrary');
		const eFormLibrary = eFormObj.eFormLibrary;
		const eFormLibrary_keyboardShortcuts = eFormLibrary.eFormLibrary_keyboardShortcuts;
		if (eFormLibrary_keyboardShortcuts.eFormLibrary_shortcuts_enabled){
			keydownEventListener_eFormLibrary(eFormLibrary_keyboardShortcuts);
		}
	}
}

function keydownEventListener_eFormLibrary(eFormLibrary_keyboardShortcuts){
	const close_enabled = 
		eFormLibrary_keyboardShortcuts.eFormLibrary_shortcut_close_enabled;
	const close_keybinding = 
		eFormLibrary_keyboardShortcuts.eFormLibrary_shortcut_close_keybinding;
	
	window.addEventListener('keydown', function(theEvent) {
		
		switch(true){
			case close_enabled && keybindingMatches(close_keybinding, theEvent):	// If on eForms page, hotkey to close window.
				window.close();
				break;
			
		}
	}, true);
	
}


