function keybindingMatches(keybinding1, keybinding2){
	// if(isEmptyKeybinding(keybinding1)){
	// 	// console.log("empty1");
	// 	keybinding1 = returnEmptyKeybinding();
	// }

	// if(isEmptyKeybinding(keybinding2)){
	// 	// console.log("empty2");
	// 	keybinding2 = returnEmptyKeybinding();
	// }

	return keybinding1.ctrlKey == keybinding2.ctrlKey 
		&& keybinding1.altKey == keybinding2.altKey
		&& keybinding1.shiftKey == keybinding2.shiftKey
		&& keybinding1.key == keybinding2.key;
}

// return true if the given keybinding is empty
function isEmptyKeybinding(keybinding){
	// console.log(keybinding);
	// console.log(keybinding.ctrlKey);
	// (keybinding == "") || (keybinding == null) || (typeof keybinding == "undefined")
	console.assert((typeof keybinding.ctrlKey != "undefined"));
	return (keybinding.ctrlKey == false
		&& keybinding.altKey == false
		&& keybinding.shiftKey == false
		&& keybinding.key == "");
}

// return true if the given keybinding is empty
function isInvalidKeybinding(keybinding){
	// console.log(keybinding);
	return (keybinding == "") || (keybinding == null) || (typeof keybinding == "undefined")
	|| (keybinding.ctrlKey == false
		&& keybinding.altKey == false
		&& keybinding.shiftKey == false
		&& keybinding.key == "");
}

function returnEmptyKeybinding(){
	return {
	  ctrlKey: false,
	  shiftKey: false,
	  altKey: false,
	  key: ''
	};
  }

/*
- returns a promise that returns the xmlhttp response text
*/
function getXMLHTTP(theURL){
	let myPromise = new Promise(function (resolve, reject){
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", theURL, true);
		
		xmlhttp.onload = function(){
			if (xmlhttp.status == 200) {
				resolve(xmlhttp.responseText);
      		} 
			else {
				console.trace();
				reject(new Error(theURL + "File not Found"));
      		}
		};
		xmlhttp.onerror = function () {
			console.trace();
			reject(new Error(theURL + "File not Found"));
		};
		xmlhttp.send();
	});

	return myPromise;
}


function getURLOrigin(){
	const  urlElements = (window.location.pathname.split('/', 2));
	const firstUrlElement = (urlElements.slice(1));
	return window.location.origin + '/' + firstUrlElement + '/';
}

function getURLOriginFromString(fullURL){
	const  urlElements = (fullURL.split('/', 2));
	const urlOrigin = urlElements.slice(0);
	const firstUrlElement = (urlElements.slice(1));
	return urlOrigin + '/' + firstUrlElement + '/';
}


/* 
- returns today's date as DD-MM-YYY
 */
function todayDateDDMMMYYYY(){
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = month[today.getMonth()];
	const todayYear = today.getFullYear();

	const todayFullDate = todayDate + '-' + todayMonth + '-' + todayYear;
	return todayFullDate;
}

/* 
- returns today's date as YYYY-MM-DD
 */
function todayDateYYYYMMDD(){
	// const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	// const today = new Date();
	// const todayDate = today.getDate();
	// const todayMonth = today.getMonth()+1;
	// const todayYear = today.getFullYear();

	const todayFullDate = new Date().toLocaleDateString('en-CA');
	// console.log(todayFullDate);
	return todayFullDate;
}
	

/* 
PURPOSE
- if the given element already exists in the document, remove it and the br after it.
 */
function removeAlreadyExistingElementAndBrTag(element){
	if(!!element){
		const brTag = element.nextElementSibling;
		// console.log(brTag.tagName);
		if (brTag.tagName=="BR"){
			brTag.remove();
		}
		element.remove();
	}
}
