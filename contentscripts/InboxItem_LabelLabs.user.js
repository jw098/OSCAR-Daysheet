// ==UserScript==
// @name           Inbox_LabelLabs
// @namespace      oscar
// @include        */lab/CA/ALL/labDisplay*
// @description		Within Lab result in Inbox: When opening the lab result, automatically label the labs with the actual names of each test (as opposed to cryptic labels like HAEM1, CHEM4, etc.). Also, the label of the previous version of the lab result is shown, as well any new results compared to the previous version. Keyboard shortcut Alt+Z to only label Labs without acknowleding.
// @require   https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @grant	   none
// ==/UserScript==

const labelLabsTrailingMarker = "…";

///////////////////////////////////////////////////////////////////////////////////////////
// Event Listeners
///////////////////////////////////////////////////////////////////////////////////////////

// labelLabsOnAcknowledge();

function labelLabsOnAcknowledge(){
	let currentURL = window.location.href;
	const labResultPage = /lab\/CA\/ALL\/labDisplay/
	const theTarget = document.evaluate("//input[@value='Acknowledge']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	if(theTarget != null){
		theTarget.addEventListener('click', function(theEvent) { labelCurrentLabs(); }, true);
	}
}

function labelLabsKeydownListener(){
	window.addEventListener('keydown', function(theEvent) {
		//theEvent.stopPropagation();
		//theEvent.preventDefault();
		// const theKeyCode = theEvent.charCode;// || event.which;
		// const theKey = String.fromCharCode(theKeyCode);
		const theKey = theEvent.key;
		const theAltKey = theEvent.altKey;
		const theCtrlKey = theEvent.ctrlKey;
		const theShiftKey= theEvent.shiftKey;
	  
		let currentURL = window.location.href;
		const labResultPage = /lab\/CA\/ALL\/labDisplay/
	
		switch(true){
			case (labResultPage.test(currentURL) && theAltKey && theKey == 'z'):  // Alt+Z: if in lab result page: label lab results.
				labelAllLabs();
				break;
		}
	}, true);
}



///////////////////////////////////////////////////////////////////////////////////////////
// Labels Lab results on load
///////////////////////////////////////////////////////////////////////////////////////////

/*
PURPOSE:
- adds a line break before and after the label text.
- insert another line element for the old label text.
- and another line inserted for the new labs text.
*/
async function labelAllLabs(){
	$("[id^='labelspan']").before('<br />');
	$("[id^='labelspan']").after('<br />');

	$("[id^='labelspan']").append('<br />');
	$("[id^='labelspan']").append($("<i>"));
	$("[id^='labelspan']").append('<br />');
	$("[id^='labelspan']").append($("<i>"));

	labelCurrentLabs();
	await addPrevVersionLabel();
	// add timeout to allow for the Prev label to fully load
	setTimeout(addNewLabsLabel, 300);
}


// $("[id^='labelspan'] > i:first-child").before($("<p>"));

///////////////////////////////////////////////////////////////////////////////////////////
// Shows old version of Label.
///////////////////////////////////////////////////////////////////////////////////////////


/*
PURPOSE
- get URL of the previous version of lab results.
*/
function prevVersionURL(){
	const allVersionElementOnly = document.querySelectorAll('a[href^="labDisplay.jsp?segmentID"]');
	if (allVersionElementOnly.length == 0){
		throw new Error("Previous version URL not found.");
	}
	const allVersions = allVersionElementOnly[0].parentNode.childNodes;

	let prevNode = "";
	for (let i = 0; i < allVersions.length; i++){
		currentNode = allVersions[i];
		if (currentNode.nodeType == Node.TEXT_NODE && currentNode.textContent.includes("v")){
			break;
		}
		prevNode = currentNode;
	}

	if (prevNode == ""){
		throw new Error("Previous version URL not found.");
	} else {
		// console.log(prevNode.href);
		return prevNode.href;
	}
}

/*
PURPOSE:
- inserts a line for the previous version of this lab result
NOTE
- uses XHR
- inserts the line elements and line breaks before XHR is called.
*/
async function addPrevVersionLabel() {
	try {
		const prevVersionXMLText = await getXMLHTTP(prevVersionURL());
		const prevVersionHTML = new DOMParser().parseFromString(prevVersionXMLText, "text/html");
		const oldLabelElement = prevVersionHTML.querySelectorAll("span[id^='labelspan_'] > i");
		const oldLabelText = oldLabelElement[0].textContent;
		const oldLabelResultOnly = oldLabelText.split("Label: ")[1];

		// $("[id^='labelspan']").append('<br />');
		// $("[id^='labelspan']").append($("<i>").html("Old: " + "&nbsp;&nbsp;&nbsp;" + oldLabelResultOnly));

		// assumes that the extra <i> element has already been appended previously.
		$("[id^='labelspan'] > i:nth-child(3)").html("Prev:" + "&nbsp;" + "&nbsp;" + oldLabelResultOnly);
	} catch(err){
		// console.error(err);
		console.log("Previous version URL not found.");
	}
	
}


/* 
NOTES:
- extracts the current and previous lab results. stripping away "Label:", and the trailing marker.
 */
function addNewLabsLabel(){
	
	const currentLabsResultsText = $("[id^='labelspan'] > i:nth-child(1)")[0].innerText.split("Label: ")[1].split(labelLabsTrailingMarker)[0];
	const currentLabResultsList = currentLabsResultsText.split("/");

	const nbsp = String.fromCharCode(160);
	const oldLabelInnerText = $("[id^='labelspan'] > i:nth-child(3)")[0].innerText;
	if (oldLabelInnerText == ""){
		console.log("No previous version found.");
		return;
	}
	const oldLabelResultText = oldLabelInnerText.split("Prev:" + nbsp + nbsp)[1].split(labelLabsTrailingMarker)[0];
	const oldLabelResultsList = oldLabelResultText.split("/");

	// console.log("current Labs: " + currentLabsResultsText);
	// console.log("prev Labs: " + oldLabelResultText);
	let difference = currentLabResultsList.filter(x => !oldLabelResultsList.includes(x));
	const newResultsText = difference.join("/");
	// console.log(newResultsText);	

	$("[id^='labelspan'] > i:nth-child(5)").html("New:" + "&nbsp;" + "&nbsp;" + "&nbsp;" + newResultsText);
}

///////////////////////////////////////////////////////////////////////////////////////////
// Label Labs. Automatically labels lab results.
///////////////////////////////////////////////////////////////////////////////////////////



/* 
PURPOSE:
- labels the current lab result, with labelLabsTrailingMarker appended to the end, 
so that we know which labels were done by this script vs manually done.
- do not re-label the lab if has been manually set by someone.
  - i.e. rename only if current label is "(not set)" or empty string or 
  previously labeled by labelCurrentLabs, as determined by ending in labelLabsTrailingMarker.
 */
function labelCurrentLabs(){
	console.log('label labs');
	const currentLabsResultsText = $("[id^='labelspan'] > i:nth-child(1)")[0].innerText.split("Label:")[1].trim();
	console.log("current label: " + currentLabsResultsText);
	if	(
		currentLabsResultsText == "" 
		|| currentLabsResultsText == "(not set)" 
		|| currentLabsResultsText.endsWith(labelLabsTrailingMarker)
		|| currentLabsResultsText.endsWith("...")
		)
	{
		// Gets all lab results from the XML, which are either in table/tbody/tr/td[1]/a[1] or table/tbody/tr/td[1]/span
		const allLabResults = document.querySelectorAll('table[name="tblDiscs"]>tbody>tr>td:first-child>:is(a:first-child, span)');
		let keyLabResults = extractKeyLabResults(allLabResults);
		
		/* 
		- only add the labelLabsTrailingMarker if the result is not an empty string.
		*/
		let labelResult = keyLabResults;
		if(labelResult != ""){
			labelResult = keyLabResults + labelLabsTrailingMarker;
		}
		$("input[id*=acklabel]").val(labelResult);

		const theLabelButton = document.querySelector("button[id*=createLabel]");
		console.log(theLabelButton);
		theLabelButton.click();
		
		// console.log(keyLabResults);
		
		// showKeyLabResultsTextBox(keyLabResults);
	}
	else {
		console.log('Label likely manually set.');

	}

}

// Show the key lab results in a button in the bottom right screen
function showKeyLabResultsTextBox(keyLabResults){
	let labResultsTextBox = document.createElement("input");
	labResultsTextBox.type="button";
	labResultsTextBox.value=keyLabResults;

	labResultsTextBox.setAttribute("style", "font-size:10px; position:fixed; bottom:10px; right:10px; cursor:pointer; background-color: #F2EFFB; ");
	document.body.appendChild(labResultsTextBox); 
}

/* 
- get all lab results from the page, from the given nodeList
- removes duplicates and replaces them with lab result 2.
 */
function extractKeyLabResults(allLabResults_nodeList){
	console.log(allLabResults_nodeList);
	let keyLabResultList_old = "";	
	let keyLabResultArray = [];	
	let index = 0;
	allLabResults_nodeList.forEach(	
		function(element){			
			if (!isSubResult(element)){  // add all non sub-results. i.e. add all key results.
				let labTitle = renameLabResult(element.textContent); 
				if (labTitle != ""){
					keyLabResultArray.push(labTitle);
				}


				// old code
				if(keyLabResultList_old != "" && labTitle != ""){
					labTitle = "/" + labTitle;
				}				
				keyLabResultList_old += labTitle;

				// console.log(labTitle);
// 				console.log(e.parentNode.childNodes);
	// 			console.log(e.parentNode.outerHTML);
			}
			index++
		}
	)

	const keyLabResultArray_noDupes = consolidateDuplicateLabResults(keyLabResultArray);
	const keyLabResultList = keyLabResultArray_noDupes.join("/");
	console.log(keyLabResultList);
	console.log(keyLabResultList_old);

	return keyLabResultList;
}

/* 
- removes duplicate lab results, and replaces it with labResult2
- e.g. Protein Electrophoresis, Protein Electrophoresis becomes Protein Electrophoresis 2
 */
function consolidateDuplicateLabResults(keyLabResultArray){
	let uniqueLabs = [];
	for (let i = 0; i < keyLabResultArray.length; i++){
		const labResult = keyLabResultArray[i];
		const indexInUniqueArray = uniqueLabs.indexOf(labResult);

		if (indexInUniqueArray === -1) {  // doesn't already exist in unique array
            uniqueLabs.push(labResult);
        }
		else {
			uniqueLabs[indexInUniqueArray] = uniqueLabs[indexInUniqueArray].concat(" 2");
		}
	}

	return uniqueLabs;

}

// Purpose: checks if the Lab result is a sub-result. e.g. WBC, RBC are sub results to Hematology Panel (CBC).
// Implementation: Sub-results in OSCAR are indented with three non-breaking spaces.
// The whitespace is located just prior to the element of interest. So, we get the parentNode, and the first childNode contains the whitespace.
function isSubResult(element){
	// const threeNonBreakingSpaces = "\xA0" + " " + "\xA0"+ " " + "\xA0";
	// console.log(element);
	const nodeWhiteSpace = element.parentNode.childNodes[0].nodeValue; 
	return hasThreeNonBreakingSpaces(nodeWhiteSpace);

	// return nodeWhiteSpace == threeNonBreakingSpaces;	
}

function hasThreeNonBreakingSpaces(nodeWhiteSpace){
	if(nodeWhiteSpace == null){
		return false;
	} 
	else {
		let countNBSP = nodeWhiteSpace.match(/\u00A0/g).length;
		// console.log(countNBSP);
		
		return countNBSP == 3;
	}
}

function getWhiteSpaceBeforeElement(element){
	const nodeWhiteSpace = element.parentNode.childNodes[0].nodeValue;
	let whiteSpaceWithoutLinebreak;
	if(nodeWhiteSpace != null){
		whiteSpaceWithoutLinebreak = nodeWhiteSpace.split("\n")[0];
	}
	return whiteSpaceWithoutLinebreak;
}


function renameLabResult(strOldName){
	let strNewName = strOldName;
	// console.log(strOldName);
	switch(strOldName)
	{
		case 'Hematology Panel':
			strNewName='CBC';
			break;
		case 'Vitamin B12':
			strNewName='B12';
			break;
		case 'Ferritin':
			strNewName='Fe';
			break;			
		case 'Hemoglobin A1c':
			strNewName='A1c';
			break;	
		case 'Creatinine/eGFR':
			strNewName='Cr';
			break;	
		case 'Alanine Aminotransferase':
			strNewName='ALT';
			break;	
		case 'Lipids':
			strNewName='Lipids';
			break;	
		case 'Urine Creatinine Random':
			strNewName='';
			break;	
		case 'Urine Albumin Random':
			strNewName='ACR';
			break;	
		case 'TSH':
			strNewName='TSH';
			break;	
		case 'Iron / TIBC':
			strNewName='Iron';
			break;	
		case 'Total Protein':
			strNewName='Protein';
			break;	
		case 'Total Bilirubin':
			strNewName='Bili';
			break;	
		case 'Alkaline Phosphatase':
			strNewName='ALP';
			break;
		case 'Gamma GT':
			strNewName='GGT';
			break;
		case 'Estradiol':
			strNewName='Estr';
			break;
		case 'C Reactive Protein':
			strNewName='CRP';
			break;
		case '25-Hydroxyvitamin D':
			strNewName='VitD';
			break;
		case 'Electrolytes':
			strNewName='lytes';
			break;
		case 'Albumin':
			strNewName='Alb';
			break;
		case 'T4 Free':
			strNewName='fT4';
			break;
		case 'T3 Free':
			strNewName='fT3';
			break;
		case 'Urine Culture':
			strNewName='UrineCultr';
			break;
		case 'Genital Culture':
			strNewName='GenitalCultr';
			break;
		case 'Throat Culture':
			strNewName='ThroatCultr';
			break;
		case 'Stool Culture':
			strNewName='StoolCultr';
			break;	
		case 'Hepatitis A':
			strNewName='HepA';
			break;			
		case 'Hepatitis B':
			strNewName='HepB';
			break;
		case 'Hepatitis C':
			strNewName='HepC';
			break;
		case 'Urine Chemistry/Micro':
			strNewName='UA';
			break;
		case 'Calcium':
			strNewName='Ca';
			break;
		case 'Phosphate':
			strNewName='Phos';
			break;			
		case 'Magnesium':
			strNewName='Mg';
			break;
		case 'Nuclear Ab Titre':
			strNewName='ANA';
			break;	
		case 'Rheumatoid Factor':
			strNewName='RF';
			break;
		case 'HCG Serum':
			strNewName='bHCG';
			break;	
		case 'Interpretation Hematology':
			strNewName='HemePath Comment';
			break;
		case 'Occult Blood Fecal':
			strNewName='FIT';
			break;	
		case 'B Natriuretic Peptide':
			strNewName='BNP';
			break;
		case 'Troponin':
			strNewName='Trop';
			break;	
		case 'General Information':
			strNewName='Gen Info';
			break;
		case 'MRI':
		case 'CT Scan':
		case 'Ultrasound':
		case 'Interventional Radiology':
		case 'X-Ray':
		case 'Imaging Procedure':
			strNewName=getStringDiagnosticResult(strOldName);
			break;
		case '':
			strNewName='';
			break;														
		default:
			return renameLabResultInexactMatch(strOldName);
			break;
	}
	return strNewName;
}

/* 
Note: for diagnostic results, search for the string 'Procedure'.
*/
function getStringDiagnosticResult(strOldName){


	let diagResultText;
	diagResultText = getStringDiagnosticResult_fromProcedure();
	if (diagResultText != null){
		return diagResultText;
	}

	diagResultText = getStringDiagnosticResult_fromExamType();
	if (diagResultText != null){
		return diagResultText;
	}

	return strOldName;
}

function getStringDiagnosticResult_fromProcedure(){
	try {
		let diagResultText = null;
		const xpath = "//span[contains(text(), 'Procedure:')]";
		const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
		diagResultText = matchingElement.innerText.split('Procedure: ')[1];
		console.log(diagResultText);
		if (diagResultText === undefined){
			diagResultText = null;
		}
		return diagResultText;
	} catch(err){
		// console.error(err);
		console.log("'Procedure:' not found.");
		return null;
	}
}

function getStringDiagnosticResult_fromExamType(){
	try {
		let diagResultText = null;
		const xpath_examType = "//span[contains(text(), 'EXAM TYPE:')]";
		const matchingElement_examType = document.evaluate(xpath_examType, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
		const matchingElement_examType_grandparent = matchingElement_examType.parentElement.parentElement;
		const matchingElement_examTypeResult_grandparent = matchingElement_examType_grandparent.nextSibling;
		const matchingElement_examTypeResult = 	matchingElement_examTypeResult_grandparent.children[1].children[0];

		diagResultText = matchingElement_examTypeResult.innerText;
	
		console.log(diagResultText);
		return diagResultText;
	} catch(err) {
		// console.error(err);
		console.log("'EXAM TYPE:' not found.");
		return null;
	}
	
}

function renameLabResultInexactMatch(strOldName){
	let strNewName = strOldName;
	// let strOldName = strOldName.toLowerCase();
	// console.log(strOldName);
	switch(true)
	{
		case strOldName.includes('Helicobacter'):
			strNewName='H.Pylori';
			break;
		case strOldName.includes('Follicle Stimulating Hormone'):
			strNewName='FSH';
			break;
		case strOldName.includes('Luteinizing Hormone'):
			strNewName='LH';
			break;
		case strOldName.includes('Vagina'):
			strNewName='VagSwab';
			break;
		case strOldName.includes('difficile') || strOldName.includes('Difficile'):
			strNewName='C.Diff';
			break;		
		case strOldName.includes('Ova and Parasite'):
			strNewName='O&P';
			break;	
		case strOldName.includes('Chlamydia'):
			strNewName='CT&GC';
			break;				
		case strOldName.includes('HIV'):
			strNewName='HIV';
			break;					
		case strOldName.includes('Syphilis'):
			strNewName='Syphilis';
			break;	
		case strOldName.includes('Hepatitis C'):
			strNewName='HepC';
			break;	
		case strOldName.includes('Varicella'):
			strNewName='Varicella';
			break;			
		case strOldName.includes('Rubella'):
			strNewName='Rubella';
			break;	
		case strOldName.includes('Glucose'):
			strNewName='Gluc';
			break;		
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;	
		case strOldName.includes('Transglutaminase'):
			strNewName='anti-TTG';
			break;	
		case strOldName.includes('Herpes'):
			strNewName='HSV';
			break;	
		case strOldName.includes('genitalium'):
			strNewName='M.Genitalium';
			break;	
		case strOldName.includes('Parathyroid'):
			strNewName='PTH';
			break;
		case strOldName.includes('Troponin'):
			strNewName='Trop';
			break;
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;
		case strOldName.includes('Trichomonas'):
			strNewName='Trich';
			break;			
		default:
			break;
	}
	return strNewName;
}

/*
CBC 			/html/body/div/form[3]/table/tbody/tr/td/table[6]/tbody/tr[2]/td[1]/span
b12				/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[2]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[4]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[10]/tbody/tr[4]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[10]/tbody/tr[8]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[10]/tbody/tr[9]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[12]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[14]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[16]/tbody/tr[2]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[18]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[20]/tbody/tr[2]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[2]/td[1]/a
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[6]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[6]/tbody/tr[2]/td[1]/a
				/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[2]/td[1]/a[1]
				/html/body/div/form[3]/table/tbody/tr/td/table[4]/tbody/tr[3]/td[1]/a
				/html/body/div/form[3]/table/tbody/tr/td/table[6]/tbody/tr[2]/td[1]/span
				/html/body/div/form[3]/table/tbody/tr/td/table[18]/tbody/tr[2]/td[1]/a
hiv pending		/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[2]/td[1]
tet pending		/html/body/div/form[3]/table/tbody/tr/td/table[6]/tbody/tr[2]/td[1]
a1c:			/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[2]/td[1]/a[1]
cr: 			/html/body/div/form[3]/table/tbody/tr/td/table[8]/tbody/tr[4]/td[1]/span
lipid:			/html/body/div/form[3]/table/tbody/tr/td/table[10]/tbody/tr[2]/td[1]/span
ACR:			/html/body/div/form[3]/table/tbody/tr/td/table[12]/tbody/tr[5]/td[1]/span
*/