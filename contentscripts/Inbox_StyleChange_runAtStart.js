// ==UserScript==
// @name Inbox_StyleChange
// @namespace   PMscripts
// @description  Changes the fonts and colors in the inbox.
// @include     *oscar/lab/CA/ALL/labDisplay.jsp*
// @include     *oscar/dms/inboxManage.do*
// @include     *kaiemr/#/inbox*
// @require   https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @grant       none
// @version 15.2
// ==/UserScript==


checkEnabled_InboxStyleChange_runAtStart();
async function checkEnabled_InboxStyleChange_runAtStart(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log(await browser.storage.local.get(null));
	
	console.log("enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const inboxItemObj = await browser.storage.local.get('inboxItem');
		const inboxItem = inboxItemObj.inboxItem;
		const inboxItem_styleChange = inboxItem.inboxItem_styleChange;
        if (inboxItem_styleChange){
            modifyStyles_runAtStart("Inbox_StyleChange");
        }

	}
}

function modifyStyles_runAtStart(file){
    var link = document.createElement("link");
    link.href = browser.runtime.getURL('contentscripts/' + file + '.css'+ '?id=' + new Date().getTime());
    // + '?id=' + new Date().getTime()
    // link.href = browser.runtime.getURL("contentscripts/Inbox_StyleChange.css");
    console.log(link.href);
    // console.log(browser.runtime.getURL("emptyFID.html"));
    // console.log(browser.runtime.getURL("emptyFID.css"));
    // window.open(browser.runtime.getURL("contentscript/Inbox_StyleChange.css"));
    link.id = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    console.log(link);
    document.getElementsByTagName("html")[0].appendChild(link);
}

