// ==UserScript==
// @name           KeyboardShortcuts_BCBilling
// @namespace      oscar
// @include        	*billing/CA/BC/billingDigNewSearch.jsp?*
// @description		In the BC Billing page: Alt+1 to Continue, Alt+Q to input in person visit billing code, Alt+W to input telehealth visit billing code, Alt+A to set focus to Dx code. The above keyboard shortcuts will also scroll to the bottom of the page. In Diagnostic Code search: Alt+1 to Confirm, Escape to Cancel. In Billing confirmation page: Alt+1 to Save Bill. Alt+A to scroll to bottom of page.
// @grant	   none
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_BCBilling_DxCodeSearch();
async function checkEnabled_BCBilling_DxCodeSearch(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const billingDxCodeSearchObj = await browser.storage.local.get('billingDxCodeSearch');
		const billingDxCodeSearch = billingDxCodeSearchObj.billingDxCodeSearch;
		const billingDxCodeSearch_keyboardShortcuts = 
			billingDxCodeSearch.billingDxCodeSearch_keyboardShortcuts
		if (billingDxCodeSearch_keyboardShortcuts.billingDxCodeSearch_shortcuts_enabled){
			dxCodeSearchPage_KeydownListeners(billingDxCodeSearch_keyboardShortcuts);
		}
		
	}
}


///////////////////////////////////////////////////////////////////////////////////////////
// Event listeners
///////////////////////////////////////////////////////////////////////////////////////////


function dxCodeSearchPage_KeydownListeners(billingDxCodeSearch_keyboardShortcuts){
	const confirm_enabled = 
	billingDxCodeSearch_keyboardShortcuts.billingDxCodeSearch_shortcuts_confirm_enabled;
	const confirm_keybinding = 
	billingDxCodeSearch_keyboardShortcuts.billingDxCodeSearch_shortcuts_confirm_keybinding;
	const cancel_enabled = 
	billingDxCodeSearch_keyboardShortcuts.billingDxCodeSearch_shortcuts_cancel_enabled;
	const cancel_keybinding = 
	billingDxCodeSearch_keyboardShortcuts.billingDxCodeSearch_shortcuts_cancel_keybinding;

	window.addEventListener('keydown', function(theEvent) {
		let theTarget;		
		switch(true){				
			case confirm_enabled && keybindingMatches(confirm_keybinding, theEvent):
				theTarget = document.evaluate("id('servicecode')/input[@value='Confirm']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;	
			case cancel_enabled && keybindingMatches(cancel_keybinding, theEvent):
				// alert("dxCodeSearch");
				theTarget = document.evaluate("id('servicecode')/input[@value='Cancel']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
				theTarget.click();
				break;	
		}
	}, true);
}

