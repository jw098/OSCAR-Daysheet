# OSCAR-Daysheet

Automatically save the daysheet in OSCAR EMR.

# Disclaimer:

This extension has only been tested on the WELL Health implementation of OSCAR EMR, in BC, in Classic view. Due to the nature of a browser extension, I am unable to guarantee it will work with every EMR update, and you use it at your own risk. Using this web extension may result in errant behavior in the EMR.

Feel free to contact me if you notice any bugs. Please also reach out if you have a different version of OSCAR and are interested in getting this extension to work in your OSCAR version.

# User Guide

## Adjust the Settings
- Click the extension’s icon in the toolbar -> Settings.
- Ensure the "Enabled" checkbox is checked
- Dates: Set the number of days to look in advance. The daysheets will be saved for all these days.
- Check Frequency: Number of hours to wait before fetching the daysheet from OSCAR.
  - NOTE: This setting only limits the check frequency. To trigger fetching of daysheet data from OSCAR, you need to load/refresh the OSCAR schedule page.
- Provider number: Input the provider number(s) for all desired providers. These providers will have their daysheets saved. To find the provider number, open that user’s Daysheet (click the DS button on the schedule). Within the URL, you will see "provider_no=X", where X is the provider number.
- 	Click "Save" at the top to save these settings.

## Fetch Daysheet data
- Load/refresh the OSCAR schedule page. This triggers the fetching of daysheet data from OSCAR.
- To view the Daysheet. Click the extension’s icon in the toolbar -> View Daysheet.
- If you input several provider numbers in the settings, it can take a few minutes to fetch all the Daysheet data. Try refreshing the “View Daysheet” page after a few minutes.

