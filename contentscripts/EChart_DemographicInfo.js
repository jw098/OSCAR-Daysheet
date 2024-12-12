// ==UserScript==
// @name Pagescraper V3 JY eMail, Care Connect, copyable Telephone links
// @namespace Stanscripts
// @description adds demographic details to echart with helpful links
// @include */casemgmt/forward.jsp?action=view&demographic*
// @include  *careconnect*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @version 17.2 Fixed eMAIL for FF ESR 91.3; remove Doxy, eMail, and QuickLinks
// ==/UserScript== 


async function loadDemographicInfo(demographicInfoSettings){

	//Reserve line in header
	const header = document.getElementById('encounterHeader');
	// let headerReserve = header.innerHTML;
	// header.innerHTML += '<br><br>';

	let headerLineBreakReserve = document.createElement("div");
	headerLineBreakReserve.id = "headerLineBreakReserve";
	headerLineBreakReserve.appendChild(document.createElement("br"));
	headerLineBreakReserve.appendChild(document.createElement("br"));
	header.appendChild(headerLineBreakReserve);

	// $("#encounterHeader").append('<br>');
	// $("#encounterHeader").append($("<div id='headerDemographic1'>"));


	const demographicArray = [
		'Cell Phone',
		'Email',
		'Phone(H)',
		'Address',
		'City',
		'Postal',
		'Age',
		'Health Ins',
		'Phone(W)',
		'Health Card Type'
	]

	const theURL = getMasterDemographicURL();
	const demoArrayVal = await getDemographicInfo(demographicArray, theURL);

	const cellPhoneNum = demoArrayVal[0];
	const emailValue = demoArrayVal[1];
	const homePhoneNum = demoArrayVal[2];
	const addressValue = demoArrayVal[3];
	const cityValue = demoArrayVal[4];
	const postalCodeValue = demoArrayVal[5];
	const ageValue = demoArrayVal[6];
	const hinValue = demoArrayVal[7];
	const workPhoneNum = demoArrayVal[8];
	const HCType = demoArrayVal[9];

	console.log(demoArrayVal);
	const HCN = hinValue.replace(/\s/g,'');

	/* 
	circumstances when we clear PHN info from storage
	  - when chart opened.
	  - 60s after opening the CareConnect link from eChart
	  - after pasting the PHN into the searchbar on the Careconnect site
	 */
	browser.storage.local.set({PHN: ""});	

	
	// console.log(await browser.storage.local.get({PHN: HCN}))
	// console.log(HCN)
	
	const HCN_First4Digits = HCN.slice(0, 4)
	const HCN_Next3Digits = HCN.slice(4, 7)
	const HCN_Last3Digits = HCN.slice(7)
	const HCNWithSpaces = HCN_First4Digits + " " + HCN_Next3Digits + " " + HCN_Last3Digits;

	document.getElementById("headerLineBreakReserve").remove();

	const phone_enabled = demographicInfoSettings.demographicInfo_phone_enabled;
	const leadingDigits = demographicInfoSettings.demographicInfo_leadingDigits;
	const address_enabled = demographicInfoSettings.demographicInfo_address_enabled;
	const HIN_enabled = demographicInfoSettings.demographicInfo_HIN_enabled;
	const email_enabled = demographicInfoSettings.demographicInfo_email_enabled;
	const CareConnect_enabled = demographicInfoSettings.demographicInfo_CareConnect_enabled;
	const clipboard_enabled = demographicInfoSettings.demographicInfo_clipboard_enabled;



	if(phone_enabled){
		let homePhone = document.createElement("span");
			let boldHomePhone = document.createElement("strong");
			boldHomePhone.innerText = "Home: ";
		homePhone.appendChild(boldHomePhone);
			telLink3(homePhoneNum, homePhone, leadingDigits);
			
		header.appendChild(homePhone);

		let cellPhone = document.createElement("span");
			let boldCellPhone = document.createElement("strong");
			boldCellPhone.innerText = "Cell: ";
		cellPhone.appendChild(boldCellPhone);
			telLink3(cellPhoneNum, cellPhone, leadingDigits);
		header.appendChild(cellPhone);

		let workPhone = document.createElement("span");
			let boldWorkPhone = document.createElement("strong");
			boldWorkPhone.innerText = "Work: ";
		workPhone.appendChild(boldWorkPhone);
			telLink3(workPhoneNum, workPhone, leadingDigits);
		header.appendChild(workPhone);
	}
	
	
	if(address_enabled){
		let address = document.createElement("span");
			let boldAddress = document.createElement("strong");
			boldAddress.innerText = "Address: ";
		address.appendChild(boldAddress);
			let addressText = document.createTextNode(addressValue + ', ' + cityValue + ', ' + postalCodeValue + "\u0020\u00A0\u0020");
		address.appendChild(addressText);
		header.appendChild(address);
	}


	if(HIN_enabled){
		let hcNum = document.createElement("span");
			let boldHCN = document.createElement("strong");
			boldHCN.innerText = "PHN: ";
		hcNum.appendChild(boldHCN);
			let hcnCopyable = document.createElement("span");
			hcnCopyable.className = "copyable";
			hcnCopyable.innerText = HCNWithSpaces;
			
		hcNum.appendChild(hcnCopyable);
		hcNum.appendChild(document.createTextNode("\u00A0\u00A0"));
		header.appendChild(hcNum);
	
		let hcTypeNode = document.createElement("span");
		hcTypeNode.id = "hcType";
		if (HCType == "OT" || HCType == "Other" || HCType == "US"){
			hcTypeNode.style.backgroundColor = "#da4d4d";
			 let boldHCType = document.createElement("strong");
			 boldHCType.innerText = `HC Type: ${HCType}`;
			hcTypeNode.appendChild(boldHCType);
		}
		else {
			let boldHCType = document.createElement("strong");
			boldHCType.innerText = `HC Type: `;
			let hcTypeText = document.createTextNode(HCType);
			hcTypeNode.appendChild(boldHCType);
			hcTypeNode.appendChild(hcTypeText);
		}
		header.appendChild(hcTypeNode);
	}

	if(phone_enabled || address_enabled || HIN_enabled){
		header.appendChild(document.createElement("br"));
	}
	
	if (email_enabled){
		let nbsp = document.createTextNode("\u0020\u00A0\u0020");

		let email = document.createElement("span");
			let boldEmail = document.createElement("strong");
			boldEmail.innerText = "eMail: ";
		email.appendChild(boldEmail);
			let emailCopyable = document.createElement("span");
			emailCopyable.className = "copyable";
			emailCopyable.innerText = emailValue;
		email.appendChild(emailCopyable);
			let emailLink = document.createElement("a");
			emailLink.href = "mailto:" + emailValue + '<' + emailValue + '>' + '?Subject=Confidential medical information';
			emailLink.target = "_blank";
			emailLink.innerText = "Send eMail";
		email.appendChild(nbsp);
		email.appendChild(emailLink);
		email.appendChild(document.createTextNode("\u00A0\u00A0"));
		header.appendChild(email);
	}

	if (CareConnect_enabled){
		let careConnect = document.createElement("button");
		careConnect.id = "button13";
		careConnect.innerText = "Care Connect";
		header.appendChild(careConnect);

		document.getElementById("button13").onclick = openCareConnect;
		document.getElementById("button13").setAttribute('style', 'color:green;'); //font-size:10px; 

		/* 
		- open careConnect, save PHN to storage for pasting, then clear the PHN after 60s.
		*/
		function openCareConnect() {
			// window.open("https://health.careconnect.ca?" + passPHN, "newWindow", target = "_blank")
			// window.open("https://health.careconnect.ca", "newWindow", target = "_blank");
			window.open("https://health.careconnect.ca");
			browser.storage.local.set({PHN: HCN});
			setTimeout(() => {
				browser.storage.local.set({PHN: ""});	
			}, 60000);
		}
	}


	if (clipboard_enabled){
		$(".copyable").click(function() {
			let copyableTextArea = document.getElementById("copyableTextArea");

			/* 
			- create the copyableTextarea element, if not already created.
			 */
			if(copyableTextArea == null){
				copyableTextArea = document.createElement("textarea");
				copyableTextArea.id = "copyableTextArea";
				copyableTextArea.setAttribute('style', 'width:150px; height:20px; font-size:14px;  resize:none;');
				copyableTextArea.setAttribute('title', 'Clipboard');
				copyableTextArea.style.marginLeft = "200px";

				header.appendChild(copyableTextArea);
			}

			/* 
			- set copyableTextArea value to the element just clicked.
			- set the background color to the element just clicked.
			 */
			copyableTextArea.value = this.innerHTML;
			$(this).css('background-color', '#c1a7f1');

			
			/* 
			- copy to clipboard
			 */
			copyableTextArea.select();
			navigator.clipboard.writeText(copyableTextArea.value);
			// document.execCommand('copy'); // deprecated

	
			//	textArea.remove();  // to hide text area
		})
	}

	// $('#enTemplate').width("160px"); //widens search field

}

function highlightHealthCardType(HCType){
	if (HCType == "OT" || HCType == "Other" || HCType == "US"){
		return `<span id='hcType' style='background-color: #da4d4d'><b>HC Type: ${HCType}</b></span>` ;
	}
	else {
		return `<span id='hcType'><b>HC Type: </b>${HCType}</span>`;
	}
}

function getMasterDemographicURL(){
	var elements = (window.location.pathname.split('/', 2))
	const firstElement = (elements.slice(1))
	const vPath = (location.protocol + '//' + location.host + '/' + firstElement )
	// const vPath = '../'
	var myParam = location.search.split('demographicNo=')[1]
	var res = myParam.indexOf('&')

	var pathArray = window.location.pathname.split('/');
	var demo_no = myParam.substring(0, res);
	var newURL = vPath + '/demographic/demographiccontrol.jsp?demographic_no=' + demo_no + '&displaymode=edit&dboperation=search_detail';

	console.log(newURL);
	return newURL;
}



async function getDemographicInfo(demographicArray, URL){
	const otherPageXMLText = await getXMLHTTP(URL);
	// const str = otherPageXMLText;
	const otherPageHTML = new DOMParser().parseFromString(otherPageXMLText, "text/html");

	let demoArrayValues = [];
	for (let i = 0; i < demographicArray.length; i++){
		const measureKey = demographicArray[i];
		const measureHTMLKey = otherPageHTML.evaluate(`//span[contains(.,'${measureKey}')]`,otherPageHTML,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
		
		const measureHTMLVal = measureHTMLKey.nextElementSibling;
		const measureVal = measureHTMLVal.innerText;
		demoArrayValues.push(measureVal);
	}
	
	return demoArrayValues;
}



function telLink3(phoneNumber, phoneSpan, leadingDigits){
	console.log(phoneNumber.trim());
	console.log(phoneSpan);
	if(phoneNumber.trim() == ""){
		const nbsp20 = document.createTextNode("\u00A0".repeat(20));
		phoneSpan.appendChild(nbsp20);
	}
	else {

		// Copyable Phone number
		const phoneCopyable = document.createElement("span");
		phoneCopyable.className = "copyable";
		phoneCopyable.innerText = phoneNumber;
		phoneSpan.appendChild(phoneCopyable);

		// Phone link
		const leadingDigits_enabled = leadingDigits.demographicInfo_phone_leadingDigits_enabled;
		const leadingDigits_digits = leadingDigits.demographicInfo_phone_leadingDigits_digits;

		console.log(leadingDigits_digits);
		let phoneNumberNoDashes = phoneNumber.replace(/\D/g,'');
		if(leadingDigits_enabled){
			phoneNumberNoDashes = leadingDigits_digits + phoneNumberNoDashes;
		}
		let telephoneLink = document.createElement("a");
			telephoneLink.href = "tel:" + phoneNumberNoDashes;
			telephoneLink.innerText = " \uD83E\uDC85"; //UTF-16: WIDE-HEADED NORTH EAST VERY HEAVY BARB ARROW
		phoneSpan.appendChild(telephoneLink);

		// Non-breaking space
		const nbsp = document.createTextNode("\u0020\u00A0\u0020");
		phoneSpan.appendChild(nbsp);

	}

}



