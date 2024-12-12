// ==UserScript==
// @name           BCBilling_CodeInput_KeyboardShortcuts
// @namespace      oscar
// @include        	*billing.do?bill*
// @include        	*oscar/CaseManagementEntry*
// @include        	*billing/CA/BC/billingBC.jsp*
// @include			*SaveBilling.do*
// @include        	*billing/CA/BC/CreateBilling*
// @description		In the BC Billing page: Alt+1 to Continue, Alt+Q to input in person visit billing code, Alt+W to input telehealth visit billing code, Alt+A to set focus to Dx code. The above keyboard shortcuts will also scroll to the bottom of the page. In Diagnostic Code search: Alt+1 to Confirm, Escape to Cancel. In Billing confirmation page: Alt+1 to Save Bill. Alt+A to scroll to bottom of page.
// @grant	   none
// ==/UserScript==

// ///////////////////////////////////////////////////////////////////////////////////////////
// // Check Enabled
// ///////////////////////////////////////////////////////////////////////////////////////////
// checkEnabled_BCBilling_CodeInput();
// async function checkEnabled_BCBilling_CodeInput(){
// 	const isEnabled = await browser.storage.local.get('enabled');
// 	console.log("Global enabled? " + isEnabled.enabled);
// 	if(!isEnabled.enabled){
// 		return;
// 	}
// 	else {
// 		scrollToPageEnd();
// 		billingCodeInputPage_KeydownListeners();
// 	}
// }

///////////////////////////////////////////////////////////////////////////////////////////
// Event listeners
///////////////////////////////////////////////////////////////////////////////////////////

function billingCodeInputPage_KeydownListeners(billingCodeInput_keyboardShortcuts){
	const continue_enabled = 
		billingCodeInput_keyboardShortcuts.billingCodeInput_shortcut_continue_enabled;
	const continue_keybinding = 
		billingCodeInput_keyboardShortcuts.billingCodeInput_shortcut_continue_keybinding;

	const setFocusDxCode_enabled = 
		billingCodeInput_keyboardShortcuts.billingCodeInput_shortcut_setFocusDxCode_enabled;
	const setFocusDxCode_keybinding = 
		billingCodeInput_keyboardShortcuts.billingCodeInput_shortcut_setFocusDxCode_keybinding;	

	window.addEventListener('keydown', function(theEvent) {
		let theTarget;
		switch(true){
			case  (continue_enabled 
				&& keybindingMatches(continue_keybinding, theEvent)):	
				theTarget = document.evaluate("id('buttonRow')/td/input[@value='Continue']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;
			case  (setFocusDxCode_enabled 
				&& keybindingMatches(setFocusDxCode_keybinding, theEvent)):
				$("input[name=billing_1_fee_dx1]").focus();
				scrollToPageEnd_BCBillingConfirm();
				break;
		}
	}, true);
}



