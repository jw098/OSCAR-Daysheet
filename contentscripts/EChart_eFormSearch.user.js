// ==UserScript==
// @name        EChart_eFormSearch
// @namespace   Stanscript
// @include     */casemgmt/forward.jsp?action=view&demographic*
// @description In the E-chart, a search box to search e-forms by title. Alt+Shift+A toggles focus between e-forms search box and the note text area.
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js
// @version     15.0
// @grant       none
// ==/UserScript==


// ///////////////////////////////////////////////////////////////////////////////////////////
// // Check Enabled
// ///////////////////////////////////////////////////////////////////////////////////////////
// checkEnabled_EChart();
// async function checkEnabled_EChart(){
// 	const isEnabled = await browser.storage.local.get('enabled');
// 	console.log("Global enabled? " + isEnabled.enabled);
// 	if(!isEnabled.enabled){
// 		return;
// 	}
// 	else {
        
// 		keydownEventListener_eformSearch();
//         addSearchBar();
//         getMeasures();
// 	}
// }

/////////////////////////////////////////////////////////////
// Eventlistener
/////////////////////////////////////////////////////////////
function keydownEventListener_eformSearch(eChart_mainWindow_keyboardShortcuts){
    const eformSearchBar_enabled = 
    eChart_mainWindow_keyboardShortcuts.eformSearchBar_shortcuts_enabled;
    const eformSearchBar_keybinding = 
    eChart_mainWindow_keyboardShortcuts.eformSearchBar_shortcuts_keybinding;

    window.addEventListener("keydown", function(theEvent){
        switch(true){
            case eformSearchBar_enabled && keybindingMatches(eformSearchBar_keybinding, theEvent):
                const textAreaNode = document.querySelector("textarea[id^='caseNote']");
                if(document.activeElement == textAreaNode){
                    document.getElementById("referral_name").focus();
                }
                else{
                    textAreaNode.focus();
                }
                break;
            }
    }, true);
}



/////////////////////////////////////////////////////////////
// Get URL Parameters
/////////////////////////////////////////////////////////////

function getEFormLibraryURL(){
    var params = {}; //Get Params
    if (location.search) {
        var parts = location.search.substring(1).split('&');
        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;``
            params[nv[0]] = nv[1] || true;
        }
    }
    // console.log(params.demographicNo);
    
    var elements = (window.location.pathname.split('/', 2))
    const firstElement = (elements.slice(1))
    const vPath = (location.protocol + '//' + location.host + '/' + firstElement + '/')
    var newURL = vPath + "/eform/efmformslistadd.jsp?group_view=&demographic_no=" + params.demographicNo + "&parentAjaxId=eforms";

    return newURL;
    //alert(newURL)	
    //window.open(newURL)
}


/////////////////////////////////////////////////////////////
// Searchbar
/////////////////////////////////////////////////////////////


function addSearchBar(){
    //$('#enTemplate').width("250px"); //widens search field
    var searchbar = "<input id='referral_name' style ='background-color: white; color:green;' list='CP' name='referral_name' placeholder='eForm name (or partial name)' type='text'><datalist id='CP'></datalist>"

    if(!!document.getElementById("referral_name")){
        return;
    }
    $('#cppBoxes').append(searchbar) //append to top row
    //$('#toolbar').prepend(searchbar) //append to bottom row

    $('#referral_name').width("202px")

    $("#referral_name").change(function() {
    //         alert(this.text)
    });

    const vPath = "../"
    // https://stackoverflow.com/a/64392933
    document.getElementById("referral_name").addEventListener("input", function(event){
        if(event.inputType == "insertReplacementText" || event.inputType == null) {
            window.open(vPath + "eform/" + $(this).val())
            $(this).val("")
            this.focus()
        }
    })

    getAllEFormLinks();
}


//     $("#referral_name").select(function() {
//         $('#cppBoxes').focus()
//         //alert($(this).val())
//         window.open(vPath + "eform/" + $(this).val())
//         /*  
//         var parser = new DOMParser();
//         var htmlDoc = parser.parseFromString($(this).val(), 'text/html');  //get the text
//         //alert($(htmlDoc).text())  
//         $(this).val($(htmlDoc).text().trim())
//         */
//         $(this).val("")
//         this.focus()
//     });



/////////////////////////////////////////////////////////////
// Get eForm names from eForms Library
/////////////////////////////////////////////////////////////


function getAllEFormLinks(measure) {
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // gets all the text on the page specificed by newURL below (e.g. the eForm library page)
            var str = xmlhttp.responseText;   
            if (!str) { 
                return;
            }

            // regular expression to get the elements that surround each eForm name in the eForm library.
            var myRe = /<td width="30%" style="padding-left: 7px">\n\s*<.*\n\s*.*\n\s*.*/g;

            // regular expression to extract the URL for each eForm in the library.
            var myRe2 = /efmformadd.*&appointment/g; //for onclickvalue
            var myArray;
            var myArray2
            var i = 0;

            //regex gets the next eForm name on the library page.
            while ((myArray = myRe.exec(str)) !== null) {                    
                // regex gets the next eForm URL on the library page.
                myArray2 = myRe2.exec(str);

                /*
                - myArray.toString() is HTML text that surrounds the form name.
                - $() converts it into an HTML element. 
                - .text() gets its inner text, which is the eForm name.
                */
                y = $(myArray.toString()).text();

                // the eForm URL.
                z = myArray2.toString()+ "=&parentAjaxId=eforms";

                var cpvalue = y;
                var cptext = z;

                // adds the eForm name and URL to the CPP element in the HTML.
                $('#CP').append($("<option>").attr('value', cptext).text(cpvalue));
                i = i + 1;
            }
        }
    }
    xmlhttp.open("GET", getEFormLibraryURL(), false);  // newURL is the URL for the eForm library page.
    xmlhttp.send();
}

