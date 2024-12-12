// ==UserScript==
// @name Billing Screen Buttons
// @namespace   PMscripts
// @description  On the BC Billing page, buttons to automatically bill age-related codes and other common codes. 
// @include     *billing.do?billRegion=BC&billForm=*
// @include     *billing.do?billRegion=BC&changeBillForm=*
// @include     *billing.do?billRegion=BC&billForm=CFP&hotclick=*
// @include     *billing/CA/BC/CreateBilling*
// @include     *SaveBilling.do*
// @include     *billing/CA/BC/billingBC.jsp*
// @include     *CaseManagementEntry.do
// @exclude    *CaseManagementEntry.do?method=issuehistory&demographicNo*
// @require   https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @grant       none
// @version 2.0 For contract FP - all docs + LTCI line
// ==/UserScript==


// ///////////////////////////////////////////////////////////////////////////////////////////
// // Check Enabled
// ///////////////////////////////////////////////////////////////////////////////////////////
// checkEnabled_BCBilling_Buttons();
// async function checkEnabled_BCBilling_Buttons(){
// 	const isEnabled = await browser.storage.local.get('enabled');
// 	console.log("Global enabled? " + isEnabled.enabled);
// 	if(!isEnabled.enabled){
// 		return;
// 	}
// 	else {
// 		addAllBillingButtons();
// 	}
// }


//////////////////////////////////////////////////////////////////
// Add Buttons
//////////////////////////////////////////////////////////////////

function addBillingButtonRow(bcBillingButtonGroup, groupNum){
	console.log(bcBillingButtonGroup);
	for (let i = 0; i < bcBillingButtonGroup.length; i++){
		const oneBCBillingButton = bcBillingButtonGroup[i];
		addBillingOneButton(oneBCBillingButton, groupNum);
	}

}

function addBillingOneButton(oneBCBillingButton, groupNum){
	// const test = Object.keys(oneBCBillingButton)[0];
	// console.log(test);

	const groupNumButtonNum = Object.keys(oneBCBillingButton)[0].split("bcBillingButton")[1].split("_enabled")[0];
	// console.log(groupNumButtonNum);

	// if not enabled, stop this function
	const enabled = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_enabled`];
	if (!enabled){
		return;
	}
	const addon = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_addon`];
	const dxCode1 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_dxCode1`];
	const dxCode2 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_dxCode2`];
	const dxCode3 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_dxCode3`];
	const name = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_name`];
	const serviceCode1 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_serviceCode1`];
	const serviceCode2 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_serviceCode2`];
	const serviceCode3 = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_serviceCode3`];
	const shortcuts = oneBCBillingButton[`bcBillingButton${groupNumButtonNum}_shortcuts`];
	const shortcuts_enabled = shortcuts[`bcBillingButton${groupNumButtonNum}_shortcuts_enabled`];
	const shortcuts_keybinding = shortcuts[`bcBillingButton${groupNumButtonNum}_shortcuts_keybinding`];



	// console.log(shortcuts_enabled);
	// console.log(shortcuts_keybinding);
	// console.log(name);


	// set the action when button is clicked.
	let clickAction;
	if(serviceCode1 == "officeVisit"){
		clickAction = inPersonVisit;
	}
	else if(serviceCode1 == "teleVisit"){
		clickAction = virtualVisit;
	}
	else if(serviceCode1 == "counselling"){
		clickAction = counsellingVisit;
	}
	else if(serviceCode1 == "consultation"){
		clickAction = consultationVisit;
	}
	else if(serviceCode1 == "completeExam"){
		clickAction = completeExamVisit;
	}
	else if(serviceCode1 == "teleCounselling"){
		clickAction = teleCounsellingVisit;
	}
	else if(serviceCode1 == "teleConsultation"){
		clickAction = teleConsultationVisit;
	}
	else {
		if (addon  ==  "addonBilling"){
			clickAction = function(){
				addServiceCode_addon(serviceCode1, dxCode1);
				$("input[name=billing_1_fee_dx1]").focus();
			}
		}
		else {
			console.assert(addon  ==  "standardBilling");
			clickAction = function(){
				//svcCode1, dxCode1, svcCode2, dxCode2, svcCode3, dxCode3
				addServiceCodeRigid(serviceCode1, dxCode1, serviceCode2, dxCode2, serviceCode3, dxCode3);
				$("input[name=billing_1_fee_dx1]").focus();
			}
		}
		
	}

	// add listener for keyboard shortcut
	if(shortcuts_enabled){
		window.addEventListener('keydown', function(theEvent) {
			if(keybindingMatches(shortcuts_keybinding, theEvent)){
				clickAction();
			}
		});
	}

	// set font color for the button
	let fontColor;
	if(groupNum == 1){
		fontColor = "9999FF";
	}
	else if(groupNum == 2){
		fontColor = "9999FF";
	}
	else { // groupNum == 3
		fontColor = "8FF";
	}

	// add the button to the DOM
	addBillingButton(name, clickAction, "", fontColor, groupNum);
}


function addSpaceForBillingButtons(billingRowNum){
	if (billingRowNum == 1){
		/* 1st row */
		tr = $('input[name=billing_1_fee]').parent().parent().parent().parent().parent().parent();
		tr.prepend("<tr><td colspan=3 id='extravvrow1'></td></tr>");
	} else if (billingRowNum == 2){
		/* 2nd row */
		tr = $('input[name=billing_1_fee]').parent().parent().parent().parent().parent().parent();
		tr.prepend("<tr><td colspan=3 id='extravvrow2'></td></tr>");
	} else if (billingRowNum == 3){
		/* 3rd row */
		tr = $('input[name=billing_1_fee]').parent().parent().parent().parent().parent().parent();
		tr.prepend("<tr><td colspan=3 id='extravvrow3'></td></tr>");
	} 
}



function addBillingButton(buttonValue, clickAction, titleText, fontColor, rowNum){
	removeAlreadyExistingElement_BCBilling(document.getElementById(buttonValue));

	var input = document.createElement('input');
	input.type = 'button';
	input.value = buttonValue;
	input.id = buttonValue;
	input.onclick = clickAction;
	input.setAttribute('style', `font-size:12px; font-weight: bold; background: #${fontColor};`);
	input.setAttribute('title', titleText);
	
	$(`#extravvrow${rowNum}`).append(input);
}

/* 
PURPOSE
- if the given element already exists in the document, remove it.
 */
function removeAlreadyExistingElement_BCBilling(element){
	if(!!element){
		element.remove();
	}
}

//////////////////////////////////////////////////////////////////
// Onclick Functions
//////////////////////////////////////////////////////////////////

//alert($('.serviceCodesTable').children().html());

const age = $("#patientIdRow").children().children().next().next().next().html();

function inPersonVisit(){
    if(age < 2){
      code="12100";
	}
    else if(age >= 2 && age < 50){
      code="00100";
    }
	else if(age >= 50 && age < 60){
      code="15300";
    }
	else if(age >= 60 && age < 70){
      code="16100";
    }
	else if(age >= 70 && age < 80){
      code="17100";
    }
	else {
      code="18100";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
	$("input[name=billing_1_fee_dx1]").focus();
  }
  
function virtualVisit(){
    if(age < 2){
      code="13237";
	}else if(age >= 2 && age < 50){
      code="13437";
    }else if(age >= 50 && age < 60){
      code="13537";
    }else if(age >= 60 && age < 70){
      code="13637";
    }else if(age >= 70 && age < 80){
      code="13737";
    }else {
      code="13837";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}

function teleCounsellingVisit(){
    if(age < 2){
      code="13238";
	}else if(age >= 2 && age < 50){
      code="13438";
    }else if(age >= 50 && age < 60){
      code="13538";
    }else if(age >= 60 && age < 70){
      code="13638";
    }else if(age >= 70 && age < 80){
      code="13738";
    }else {
      code="13838";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}  
  

function teleConsultationVisit(){
    if(age < 2){
      code="13236";
	}else if(age >= 2 && age < 50){
      code="13436";
    }else if(age >= 50 && age < 60){
      code="13536";
    }else if(age >= 60 && age < 70){
      code="13636";
    }else if(age >= 70 && age < 80){
      code="13736";
    }else {
      code="13836";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}  

function completeExamVisit(){
    if(age < 2){
      code="12101";
	}else if(age >= 2 && age < 50){
      code="00101";
    }else if(age >= 50 && age < 60){
      code="15301";
    }else if(age >= 60 && age < 70){
      code="16101";
    }else if(age >= 70 && age < 80){
      code="17101";
    }else {
      code="18101";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}  


function consultationVisit(){
    if(age < 2){
      code="12110";
	}else if(age >= 2 && age < 50){
      code="00110";
    }else if(age >= 50 && age < 60){
      code="15310";
    }else if(age >= 60 && age < 70){
      code="16110";
    }else if(age >= 70 && age < 80){
      code="17110";
    }else {
      code="18110";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}

function counsellingVisit(){
    if(age < 2){
      code="12120";
	}else if(age >= 2 && age < 50){
      code="00120";
    }else if(age >= 50 && age < 60){
      code="15320";
    }else if(age >= 60 && age < 70){
      code="16120";
    }else if(age >= 70 && age < 80){
      code="17120";
    }else {
      code="18120";
	}
    // $("input[name=billing_1_fee]").val(code);
    addServiceCodeRigid(code, "", "", "", "", "");
    $("input[name=billing_1_fee_dx1]").focus();
}

  function addServiceCodeRigid(svcCode1, dxCode1, svcCode2, dxCode2, svcCode3, dxCode3) {
    inputtedBillingCode1 = jQuery("#billing_1_fee").val();
    if(inputtedBillingCode1 == svcCode1){			// if same service code already entered, clear all fields.
		if(svcCode1 == $("input[name=billing_1_fee]").val()){
			$("input[name=billing_1_fee]").val("");
		}
		if(dxCode1 == $("input[name=billing_1_fee_dx1]").val()){
			$("input[name=billing_1_fee_dx1]").val("");
		}
		if(svcCode2 == $("input[name=billing_2_fee]").val()){
			$("input[name=billing_2_fee]").val("");
		}
		if(dxCode2 == $("input[name=billing_2_fee_dx1]").val()){
			$("input[name=billing_2_fee_dx1]").val("");
		}
		if(svcCode3 == $("input[name=billing_3_fee]").val()){ 
			$("input[name=billing_3_fee]").val("");
		}
		if(dxCode3 == $("input[name=billing_3_fee_dx1]").val()){
			$("input[name=billing_3_fee_dx1]").val("");
		}
    }
    else{
		if(svcCode1 != ""){
			$("input[name=billing_1_fee]").val(svcCode1);
		}
		if(dxCode1 != ""){
			$("input[name=billing_1_fee_dx1]").val(dxCode1);
		}
		if(svcCode2 != ""){
			$("input[name=billing_2_fee]").val(svcCode2);
		}
		if(dxCode2 != ""){
			$("input[name=billing_2_fee_dx1]").val(dxCode2);
		}
		if(svcCode3 != ""){ 
			$("input[name=billing_3_fee]").val(svcCode3);
		}
		if(dxCode3 != ""){
			$("input[name=billing_3_fee_dx1]").val(dxCode3);
		}
    }
  
  }


function virtualVisitCounselling(){
  age = $("#patientIdRow").children().children().next().next().next().html();
  if(age < 2)
    code="13238";
  else if(age >= 2 && age < 50)
    code="13438";
  else if(age >= 50 && age < 60)
    code="13538";
  else if(age >= 60 && age < 70)
    code="13638";
  else if(age >= 70 && age < 80)
    code="13738";
  else 
    code="13838";
  // $("input[name=billing_1_fee]").val(code);
  addServiceCodeRigid(code, "", "", "", "", "");
  $("input[name=billing_1_fee_dx1]").focus();
}

function AlliedPhone() {
	// code="13005";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("");
	addServiceCodeRigid("13005", "", "", "", "", "");
	$("input[name=billing_1_fee_dx1]").focus();
}

function fluVaxAlone(){
	let code;
	if(age < 19){
		code="10015";
		// $("input[name=billing_1_fee]").val(code);
	}
	else{
		code="10041";
		// $("input[name=billing_1_fee]").val(code);
	}
	addServiceCodeRigid(code, "v048", "", "", "", "");
}

function adultFluVaxWithVisit(){
	code="10040";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("v048");
	addServiceCodeRigid(code, "v048", "", "", "", "");
}

function INR() {
	// code="00043";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("286");
	addServiceCodeRigid("00043", "286", "", "", "", "");
	$("input[name=billing_1_fee_dx1]").focus();
}

function Injection() {
	// code="00010";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("");
	addServiceCodeRigid("00010", "", "", "", "", "");
	$("input[name=billing_1_fee_dx1]").focus();
}

function Allergy() {
	// code="00034";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("32A");
	addServiceCodeRigid("00034", "32A", "", "", "", "");
}

function Pap() {
	addServiceCodeRigid("14560", "V723", "00044", "", "", "");
	// $("input[name=billing_1_fee]").val("14560");
	// $("input[name=billing_1_fee_dx1]").val("V723");
	// $("input[name=billing_2_fee]").val("00044");
	// $("input[name=billing_3_fee]").val("");
}

function Urinalysis() {
	svcCode="15130";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("");
	addServiceCode_addon(svcCode,"")
	$("input[name=billing_1_fee_dx1]").focus();
}

function UrinePreg() {
	svcCode="15120";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("V22");
	addServiceCode_addon(svcCode,"")
	$("input[name=billing_1_fee_dx1]").focus();
}

function Cryo() {
	addServiceCodeRigid("00190", "", "00044", "", "", "");
	// code="00190";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("");
	// $("input[name=billing_2_fee]").val("00044");
	// $("input[name=billing_3_fee]").val("");
	$("input[name=billing_1_fee_dx1]").focus();
}

function LTCI_visit(){
	// code="00114";
	// $("input[name=billing_1_fee]").val(code);
	addServiceCodeRigid("00114", "", "", "", "", "");
}

function LTCI_visit1(){
	// code="13334";
	// $("input[name=billing_2_fee]").val(code);
	addServiceCodeRigid("13334", "", "", "", "", "");
}

function pneumoniaAlone(){
	// code="10041";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("v038");
	addServiceCodeRigid("10041", "v038", "", "", "", "");
}

function CV19_visit(){
	// code="10045";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("C19");
	addServiceCodeRigid("10045", "C19", "", "", "", "");
}

function AlliedConf(){
	// code="14077";
	// $("input[name=billing_1_fee]").val(code);
	// $("input[name=billing_1_fee_dx1]").val("");
	addServiceCodeRigid("14077", "", "", "", "", "");
}


function addServiceCode_addon(svcCode, dxCode) {
	var billingRowCount = 3;
	for (var i = 1; i <= billingRowCount; i++) {
		inputtedBillingCode = jQuery("#billing_" + i + "_fee").val();
		if (inputtedBillingCode === "") {
		  jQuery("#billing_" + i + "_fee").val(svcCode);
		  jQuery("#billing_" + i + "_fee_dx1").val(dxCode);
		  // var trayCode =  getAssocCode(svcCode,trayAssocCodes);
		  // if(trayCode!=''){
			// addSvcCode(field, trayCode, true);
		  // }
		  
		  break;
		}
		else if (inputtedBillingCode == svcCode){ // if same service code already entered, clear current field.
			jQuery("#billing_" + i + "_fee").val("");
			break;  
		}
	}
}


  
