// ==UserScript==
// @name           KeyboardShortcuts_BCBilling
// @namespace      oscar
// @include        	*billing/CA/BC/CreateBilling*
// @description		In the BC Billing page: Alt+1 to Continue, Alt+Q to input in person visit billing code, Alt+W to input telehealth visit billing code, Alt+A to set focus to Dx code. The above keyboard shortcuts will also scroll to the bottom of the page. In Diagnostic Code search: Alt+1 to Confirm, Escape to Cancel. In Billing confirmation page: Alt+1 to Save Bill. Alt+A to scroll to bottom of page.
// @grant	   none
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_BCBilling_Confirm();
async function checkEnabled_BCBilling_Confirm(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const billingConfirmObj = await browser.storage.local.get('billingConfirm');
		const billingConfirm = billingConfirmObj.billingConfirm;
		const billingConfirm_keyboardShortcuts = billingConfirm.billingConfirm_keyboardShortcuts;
		if (billingConfirm_keyboardShortcuts.billingConfirm_shortcuts_enabled){
			billingConfirmPage_KeydownListeners(billingConfirm_keyboardShortcuts);
		}
		if (billingConfirm.billingConfirm_PageEnd){
			window.scrollTo(0, document.body.scrollHeight);
		}
	}
}



///////////////////////////////////////////////////////////////////////////////////////////
// Event listeners
///////////////////////////////////////////////////////////////////////////////////////////

function billingConfirmPage_KeydownListeners(billingConfirm_keyboardShortcuts){
	const saveBill_enabled = 
	billingConfirm_keyboardShortcuts.billingConfirm_shortcuts_saveBill_enabled;
	const saveBill_keybinding = 
	billingConfirm_keyboardShortcuts.billingConfirm_shortcuts_saveBill_keybinding;
	const pageEnd_enabled = 
	billingConfirm_keyboardShortcuts.billingConfirm_shortcuts_pageEnd_enabled;
	const pageEnd_keybinding = 
	billingConfirm_keyboardShortcuts.billingConfirm_shortcuts_pageEnd_keybinding;


	window.addEventListener('keydown', function(theEvent) {

		let theTarget;		
		switch(true){
			case saveBill_enabled && keybindingMatches(saveBill_keybinding, theEvent):
				theTarget = document.evaluate("//input[@value='Save Bill']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
			case pageEnd_enabled && keybindingMatches(pageEnd_keybinding, theEvent):
				window.scrollTo(0, document.body.scrollHeight);
				break;	
		}
	}, true);
}


