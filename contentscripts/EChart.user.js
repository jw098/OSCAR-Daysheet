
// @name        EChart_Buttons
// @namespace   Stanscripts
// @description Various navigation buttons for e-chart screen (e.g. Lab req, Ultrasound req, X-ray req).  Set your own specific fid (form number ID) or Measurement groupName. Alt+Shift+Q,W,Z opens the eForms specified.
// @include     */casemgmt/forward.jsp?action=view&demographic*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @grant       none
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////
// Check Enabled
///////////////////////////////////////////////////////////////////////////////////////////
checkEnabled_EChart();
async function checkEnabled_EChart(){
	const isEnabled = await browser.storage.local.get('enabled');
	console.log("Global enabled? " + isEnabled.enabled);
	if(!isEnabled.enabled){
		return;
	}
	else {
		const eChartObj = await browser.storage.local.get('eChart');
		const eChart = eChartObj.eChart;
		
		const updateSidebar = eChart.updateSidebar;
		const eformSearchBar_enabled = eChart.eformSearchBar_enabled;
		const demographicInfo = eChart.demographicInfo;

		const measurementButtons_enabled = eChart.measurementButtons_enabled;
		const measurementButtons = eChart.measurementButtons;

		const eFormButtons_enabled = eChart.eFormButtons_enabled;
		const eFormButtons = eChart.eFormButtons;

		const eChart_mainWindow_keyboardShortcuts = eChart.eChart_mainWindow_keyboardShortcuts;
		const eChart_CPPWindow_keyboardShortcuts = eChart.eChart_CPPWindow_keyboardShortcuts;


		// Demographic info
		if(demographicInfo.demographicInfo_enabled){
			loadDemographicInfo(demographicInfo);
		}

		// UpdateSidebar
		if(updateSidebar){
			updateAllSidebarOnFocusChange();
		}
		

		// eFormSearch
		if(eformSearchBar_enabled){
			addSearchBar();		
		}


		// measurement Buttons
		if(measurementButtons_enabled){
			loadMeasurementButtonShortcuts(measurementButtons);
		}

		// eForm Buttons
		if(eFormButtons_enabled){
			loadEFormButtonShortcuts(eFormButtons);
		}



		// KeyboardShortcuts
		if (eChart_mainWindow_keyboardShortcuts.eChart_mainWindow_shortcuts_enabled){
			if(eChart_mainWindow_keyboardShortcuts.eformSearchBar_shortcuts_enabled){
				keydownEventListener_eformSearch(eChart_mainWindow_keyboardShortcuts);
			}

			keydownEventListener_mainWindow(eChart_mainWindow_keyboardShortcuts);
		}

		if (eChart_CPPWindow_keyboardShortcuts.eChart_CPPWindow_shortcuts_enabled){
			keydownEventListener_CPPWindow(eChart_CPPWindow_keyboardShortcuts);
		}



	}
}

