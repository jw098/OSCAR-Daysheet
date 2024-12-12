
const defaultSettings = {
  enabled: true, // default enabled
  allergyQuickAdd: true,

  billingCodeInput:{
    
    billingCodeInput_PageEnd: false,
    billingCodeInput_checkTimeCode: true,

    bcBillingButtonGroup1_enable: true,
    bcBillingButtonGroup1:[
      {
        bcBillingButton1_1_enabled: true,
        bcBillingButton1_1_name: "Clinic visit",
        bcBillingButton1_1_serviceCode1: "98031",
        bcBillingButton1_1_serviceCode2: "",
        bcBillingButton1_1_serviceCode3: "",
        bcBillingButton1_1_dxCode1: "",
        bcBillingButton1_1_dxCode2: "",
        bcBillingButton1_1_dxCode3: "",

        bcBillingButton1_1_addon: "standardBilling",
        bcBillingButton1_1_shortcuts:{
          bcBillingButton1_1_shortcuts_enabled: false,
          bcBillingButton1_1_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'q'
          },
        }
      },
      {
        bcBillingButton1_2_enabled: true,
        bcBillingButton1_2_name: "TH visit",
        bcBillingButton1_2_serviceCode1: "98032",
        bcBillingButton1_2_serviceCode2: "",
        bcBillingButton1_2_serviceCode3: "",
        bcBillingButton1_2_dxCode1: "",
        bcBillingButton1_2_dxCode2: "",
        bcBillingButton1_2_dxCode3: "",

        bcBillingButton1_2_addon: "standardBilling",
        bcBillingButton1_2_shortcuts:{
          bcBillingButton1_2_shortcuts_enabled: false,
          bcBillingButton1_2_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'w'
          },
        }
      },
      {
        bcBillingButton1_3_enabled: true,
        bcBillingButton1_3_name: "Stand Proced",
        bcBillingButton1_3_serviceCode1: "98021",
        bcBillingButton1_3_serviceCode2: "",
        bcBillingButton1_3_serviceCode3: "",
        bcBillingButton1_3_dxCode1: "",
        bcBillingButton1_3_dxCode2: "",
        bcBillingButton1_3_dxCode3: "",

        bcBillingButton1_3_addon: "standardBilling",
        bcBillingButton1_3_shortcuts:{
          bcBillingButton1_3_shortcuts_enabled: false,
          bcBillingButton1_3_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton1_4_enabled: true,
        bcBillingButton1_4_name: "Adv Proced",
        bcBillingButton1_4_serviceCode1: "98020",
        bcBillingButton1_4_serviceCode2: "",
        bcBillingButton1_4_serviceCode3: "",
        bcBillingButton1_4_dxCode1: "",
        bcBillingButton1_4_dxCode2: "",
        bcBillingButton1_4_dxCode3: "",

        bcBillingButton1_4_addon: "standardBilling",
        bcBillingButton1_4_shortcuts:{
          bcBillingButton1_4_shortcuts_enabled: false,
          bcBillingButton1_4_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      
    ],

    bcBillingButtonGroup2_enable: true,
    bcBillingButtonGroup2:[
      {
        bcBillingButton2_1_enabled: true,
        bcBillingButton2_1_name: "Min Proced, Dx test",
        bcBillingButton2_1_serviceCode1: "98022",
        bcBillingButton2_1_serviceCode2: "",
        bcBillingButton2_1_serviceCode3: "",
        bcBillingButton2_1_dxCode1: "",
        bcBillingButton2_1_dxCode2: "",
        bcBillingButton2_1_dxCode3: "",

        bcBillingButton2_1_addon: "addonBilling",
        bcBillingButton2_1_shortcuts:{
          bcBillingButton2_1_shortcuts_enabled: false,
          bcBillingButton2_1_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'a'
          },
        }
      },
      {
        bcBillingButton2_2_enabled: true,
        bcBillingButton2_2_name: "Direct time",
        bcBillingButton2_2_serviceCode1: "98010",
        bcBillingButton2_2_serviceCode2: "",
        bcBillingButton2_2_serviceCode3: "",
        bcBillingButton2_2_dxCode1: "L23",
        bcBillingButton2_2_dxCode2: "",
        bcBillingButton2_2_dxCode3: "",

        bcBillingButton2_2_addon: "standardBilling",
        bcBillingButton2_2_shortcuts:{
          bcBillingButton2_2_shortcuts_enabled: false,
          bcBillingButton2_2_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'z'
          },
        }
      },
      {
        bcBillingButton2_3_enabled: true,
        bcBillingButton2_3_name: "Indirect time",
        bcBillingButton2_3_serviceCode1: "98011",
        bcBillingButton2_3_serviceCode2: "",
        bcBillingButton2_3_serviceCode3: "",
        bcBillingButton2_3_dxCode1: "L23",
        bcBillingButton2_3_dxCode2: "",
        bcBillingButton2_3_dxCode3: "",

        bcBillingButton2_3_addon: "standardBilling",
        bcBillingButton2_3_shortcuts:{
          bcBillingButton2_3_shortcuts_enabled: false,
          bcBillingButton2_3_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'x'
          },
        }
      },
      {
        bcBillingButton2_4_enabled: true,
        bcBillingButton2_4_name: "Clinical Admin time",
        bcBillingButton2_4_serviceCode1: "98012",
        bcBillingButton2_4_serviceCode2: "",
        bcBillingButton2_4_serviceCode3: "",
        bcBillingButton2_4_dxCode1: "L23",
        bcBillingButton2_4_dxCode2: "",
        bcBillingButton2_4_dxCode3: "",

        bcBillingButton2_4_addon: "standardBilling",
        bcBillingButton2_4_shortcuts:{
          bcBillingButton2_4_shortcuts_enabled: false,
          bcBillingButton2_4_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
    ],

    bcBillingButtonGroup3_enable: true,
    bcBillingButtonGroup3:[
      {
        bcBillingButton3_1_enabled: true,
        bcBillingButton3_1_name: "FFS:Clinic visit",
        bcBillingButton3_1_serviceCode1: "officeVisit",
        bcBillingButton3_1_serviceCode2: "",
        bcBillingButton3_1_serviceCode3: "",
        bcBillingButton3_1_dxCode1: "",
        bcBillingButton3_1_dxCode2: "",
        bcBillingButton3_1_dxCode3: "",

        bcBillingButton3_1_addon: "standardBilling",
        bcBillingButton3_1_shortcuts:{
          bcBillingButton3_1_shortcuts_enabled: false,
          bcBillingButton3_1_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_2_enabled: true,
        bcBillingButton3_2_name: "FFS:TH visit",
        bcBillingButton3_2_serviceCode1: "teleVisit",
        bcBillingButton3_2_serviceCode2: "",
        bcBillingButton3_2_serviceCode3: "",
        bcBillingButton3_2_dxCode1: "",
        bcBillingButton3_2_dxCode2: "",
        bcBillingButton3_2_dxCode3: "",

        bcBillingButton3_2_addon: "standardBilling",
        bcBillingButton3_2_shortcuts:{
          bcBillingButton3_2_shortcuts_enabled: false,
          bcBillingButton3_2_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_3_enabled: true,
        bcBillingButton3_3_name: "IM inj",
        bcBillingButton3_3_serviceCode1: "00010",
        bcBillingButton3_3_serviceCode2: "",
        bcBillingButton3_3_serviceCode3: "",
        bcBillingButton3_3_dxCode1: "33a",
        bcBillingButton3_3_dxCode2: "",
        bcBillingButton3_3_dxCode3: "",

        bcBillingButton3_3_addon: "standardBilling",
        bcBillingButton3_3_shortcuts:{
          bcBillingButton3_3_shortcuts_enabled: false,
          bcBillingButton3_3_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_4_enabled: true,
        bcBillingButton3_4_name: "Allergy",
        bcBillingButton3_4_serviceCode1: "00034",
        bcBillingButton3_4_serviceCode2: "",
        bcBillingButton3_4_serviceCode3: "",
        bcBillingButton3_4_dxCode1: "32A",
        bcBillingButton3_4_dxCode2: "",
        bcBillingButton3_4_dxCode3: "",

        bcBillingButton3_4_addon: "standardBilling",
        bcBillingButton3_4_shortcuts:{
          bcBillingButton3_4_shortcuts_enabled: false,
          bcBillingButton3_4_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_5_enabled: true,
        bcBillingButton3_5_name: "Pap",
        bcBillingButton3_5_serviceCode1: "14560",
        bcBillingButton3_5_serviceCode2: "00044",
        bcBillingButton3_5_serviceCode3: "",
        bcBillingButton3_5_dxCode1: "V723",
        bcBillingButton3_5_dxCode2: "",
        bcBillingButton3_5_dxCode3: "",

        bcBillingButton3_5_addon: "standardBilling",
        bcBillingButton3_5_shortcuts:{
          bcBillingButton3_5_shortcuts_enabled: false,
          bcBillingButton3_5_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_6_enabled: true,
        bcBillingButton3_6_name: "UA",
        bcBillingButton3_6_serviceCode1: "15130",
        bcBillingButton3_6_serviceCode2: "",
        bcBillingButton3_6_serviceCode3: "",
        bcBillingButton3_6_dxCode1: "",
        bcBillingButton3_6_dxCode2: "",
        bcBillingButton3_6_dxCode3: "",

        bcBillingButton3_6_addon: "addonBilling",
        bcBillingButton3_6_shortcuts:{
          bcBillingButton3_6_shortcuts_enabled: false,
          bcBillingButton3_6_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_7_enabled: true,
        bcBillingButton3_7_name: "Preg Dip",
        bcBillingButton3_7_serviceCode1: "15120",
        bcBillingButton3_7_serviceCode2: "",
        bcBillingButton3_7_serviceCode3: "",
        bcBillingButton3_7_dxCode1: "",
        bcBillingButton3_7_dxCode2: "",
        bcBillingButton3_7_dxCode3: "",

        bcBillingButton3_7_addon: "addonBilling",
        bcBillingButton3_7_shortcuts:{
          bcBillingButton3_7_shortcuts_enabled: false,
          bcBillingButton3_7_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      {
        bcBillingButton3_8_enabled: true,
        bcBillingButton3_8_name: "Cryo",
        bcBillingButton3_8_serviceCode1: "00190",
        bcBillingButton3_8_serviceCode2: "00044",
        bcBillingButton3_8_serviceCode3: "",
        bcBillingButton3_8_dxCode1: "",
        bcBillingButton3_8_dxCode2: "",
        bcBillingButton3_8_dxCode3: "",

        bcBillingButton3_8_addon: "standardBilling",
        bcBillingButton3_8_shortcuts:{
          bcBillingButton3_8_shortcuts_enabled: false,
          bcBillingButton3_8_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            key: ''
          },
        }
      },
      
    ],

    billingCodeInput_keyboardShortcuts:{
      billingCodeInput_shortcuts_enabled: false,

      billingCodeInput_shortcut_continue_enabled: true,
      billingCodeInput_shortcut_continue_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      // billingCodeInput_shortcut_officeVisitInputCode_enabled: true,
      // billingCodeInput_shortcut_officeVisitInputCode_keybinding:{
      //   ctrlKey: false,
      //   shiftKey: false,
      //   altKey: true,
      //   key: 'q'
      // },
      // billingCodeInput_shortcut_teleVisitInputCode_enabled: true,
      // billingCodeInput_shortcut_teleVisitInputCode_keybinding:{
      //   ctrlKey: false,
      //   shiftKey: false,
      //   altKey: true,
      //   key: 'w'
      // },
      billingCodeInput_shortcut_setFocusDxCode_enabled: false,
      billingCodeInput_shortcut_setFocusDxCode_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        key: ''
      }

    }
  },
  
  billingDxCodeSearch:{
    billingDxCodeSearch_keyboardShortcuts: {
      billingDxCodeSearch_shortcuts_enabled: false,

      billingDxCodeSearch_shortcuts_confirm_enabled: true,
      billingDxCodeSearch_shortcuts_confirm_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      billingDxCodeSearch_shortcuts_cancel_enabled: true,
      billingDxCodeSearch_shortcuts_cancel_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        key: 'Escape'
      },
    }
  },

  billingServiceCodeSearch:{
    billingServiceCodeSearch_keyboardShortcuts: {
      billingServiceCodeSearch_shortcuts_enabled: false,

      billingServiceCodeSearch_shortcuts_confirm_enabled: true,
      billingServiceCodeSearch_shortcuts_confirm_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      billingServiceCodeSearch_shortcuts_cancel_enabled: true,
      billingServiceCodeSearch_shortcuts_cancel_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        key: 'Escape'
      },
    }
  },

  billingConfirm:{
    billingConfirm_PageEnd: false,
    billingConfirm_keyboardShortcuts: {
      billingConfirm_shortcuts_enabled: false,

      billingConfirm_shortcuts_saveBill_enabled: true,
      billingConfirm_shortcuts_saveBill_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      billingConfirm_shortcuts_pageEnd_enabled: true,
      billingConfirm_shortcuts_pageEnd_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
    }
  },

  consultations:{
    postPatientAgeGender: true,
    postAllHistory:true,
    consultations_keyboardShortcuts: {
      consultations_shortcuts_enabled: false,

      consultations_shortcuts_close_enabled: true,
      consultations_shortcuts_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      consultations_shortcuts_submit_enabled: true,
      consultations_shortcuts_submit_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      }
    },
    consultationsUpdate_keyboardShortcuts: {
      consultationsUpdate_shortcuts_enabled: false,

      consultationsUpdate_shortcuts_close_enabled: true,
      consultationsUpdate_shortcuts_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      consultationsUpdate_shortcuts_update_enabled: true,
      consultationsUpdate_shortcuts_update_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
    }

  },

  eChart:{
    updateSidebar: true,
    eformSearchBar_enabled: true,

    demographicInfo:{
      demographicInfo_enabled: true,

      demographicInfo_phone_enabled: true,
      demographicInfo_leadingDigits:{
        demographicInfo_phone_leadingDigits_enabled: false,
        demographicInfo_phone_leadingDigits_digits: "",
      },
      
      demographicInfo_address_enabled: true,
      demographicInfo_HIN_enabled: true,
      demographicInfo_email_enabled: true,
      demographicInfo_CareConnect_enabled: true,
      demographicInfo_clipboard_enabled: true,
    },

    measurementButtons_enabled: true,
    measurementButtons:[
      {
        measurementButton_1_enabled: true,
        measurementButton_1_name: "Vitals",
        measurementButton_1_groupName: "Vitals",

        measurementButton_1_button_enabled: true,
        measurementButton_1_shortcuts:{
          measurementButton_1_shortcuts_enabled: true,
          measurementButton_1_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            key: 'x'
          },
        }
      },

    ],

    eFormButtons_enabled: true,
    eFormButtons:[
      {
        eFormButton_1_enabled: true,
        eFormButton_1_name: "Lab Req",
        eFormButton_1_fid: "",

        eFormButton_1_button_enabled: true,
        eFormButton_1_shortcuts:{
          eFormButton_1_shortcuts_enabled: true,
          eFormButton_1_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: true,
            altKey: true,
            key: 'Q'
          }
        }
      },
      {
        eFormButton_2_enabled: true,
        eFormButton_2_name: "X-ray",
        eFormButton_2_fid: "",

        eFormButton_2_button_enabled: true,
        eFormButton_2_shortcuts:{
          eFormButton_2_shortcuts_enabled: true,
          eFormButton_2_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: true,
            altKey: true,
            key: 'W'
          }
        }
        
      },
      {
        eFormButton_3_enabled: true,
        eFormButton_3_name: "U/S",
        eFormButton_3_fid: "",

        eFormButton_3_button_enabled: true,
        eFormButton_3_shortcuts:{
          eFormButton_3_shortcuts_enabled: true,
          eFormButton_3_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: true,
            altKey: true,
            key: 'Z'
          }
        }
        
      },
      {
        eFormButton_4_enabled: true,
        eFormButton_4_name: "Doctors Note",
        eFormButton_4_fid: "",

        eFormButton_4_button_enabled: true,
        eFormButton_4_shortcuts:{
          eFormButton_4_shortcuts_enabled: true,
          eFormButton_4_shortcuts_keybinding: {
            ctrlKey: false,
            shiftKey: true,
            altKey: true,
            key: 'X'
          }
        }
        
      },
    ],
    
    eChart_mainWindow_keyboardShortcuts:{
      eChart_mainWindow_shortcuts_enabled: false,

      eformSearchBar_shortcuts_enabled: true,
      eformSearchBar_shortcuts_keybinding: {
        ctrlKey: false,
        shiftKey: true,
        altKey: true,
        key: 'A'
      },
      eChart_shortcut_meds_enabled: true,
      eChart_shortcut_meds_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'q'
      },
      eChart_shortcut_eforms_enabled: true,
      eChart_shortcut_eforms_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
      eChart_shortcut_consults_enabled: true,
      eChart_shortcut_consults_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      eChart_shortcut_tickler_enabled: true,
      eChart_shortcut_tickler_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'z'
      },
      eChart_shortcut_SignSaveBill_enabled: true,
      eChart_shortcut_SignSaveBill_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      eChart_shortcut_save_enabled: true,
      eChart_shortcut_save_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '2'
      },
      eChart_shortcut_signSave_enabled: true,
      eChart_shortcut_signSave_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '3'
      },
      eChart_shortcut_exit_enabled: true,
      eChart_shortcut_exit_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '4'
      }
    },
    eChart_CPPWindow_keyboardShortcuts:{
      eChart_CPPWindow_shortcuts_enabled: false,

      CPPWindow_shortcut_signSave_enabled: true,
      CPPWindow_shortcut_signSave_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      CPPWindow_shortcut_cancel_enabled: true,
      CPPWindow_shortcut_cancel_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        key: 'Escape'
      }
    }
    

  },

  schedule: {
    schedule_keyboardShortcuts: {
      schedule_shortcuts_enabled: false,

      schedule_shortcut_openEChart_enabled: true,
      schedule_shortcut_openEChart_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      schedule_shortcut_openInbox_enabled: true,
      schedule_shortcut_openInbox_keybinding:{
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'z'
      }
    }
  },

  apptAdd:{
    apptAdd_keyboardShortcuts: {
      apptAdd_shortcuts_enabled: false,

      apptAdd_shortcut_updateAppt_enabled: true,
      apptAdd_shortcut_updateAppt_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      apptAdd_shortcut_dur10_enabled: true,
      apptAdd_shortcut_dur10_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'q'
      },
      apptAdd_shortcut_dur15_enabled: true,
      apptAdd_shortcut_dur15_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      apptAdd_shortcut_dur20_enabled: true,
      apptAdd_shortcut_dur20_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
    }

  },

  apptEdit:{
    apptEdit_keyboardShortcuts: {
      apptEdit_shortcuts_enabled: false,

      apptEdit_shortcut_updateAppt_enabled: true,
      apptEdit_shortcut_updateAppt_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      apptEdit_shortcut_dur10_enabled: true,
      apptEdit_shortcut_dur10_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'q'
      },
      apptEdit_shortcut_dur15_enabled: true,
      apptEdit_shortcut_dur15_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      apptEdit_shortcut_dur20_enabled: true,
      apptEdit_shortcut_dur20_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
    }

  },

  demographicEdit:{
    demographicEdit_keyboardShortcuts: {
      demographicEdit_shortcuts_enabled: false,

      demographicEdit_shortcut_updateRecord_enabled: true,
      demographicEdit_shortcut_updateRecord_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
    }
  },


  eFormIndividual:{
    eFormIndividual_keyboardShortcuts: {
      eFormIndividual_shortcuts_enabled: false,

      eFormIndividual_shortcut_submit_enabled: true,
      eFormIndividual_shortcut_submit_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      eFormIndividual_shortcut_printSubmit_enabled: true,
      eFormIndividual_shortcut_printSubmit_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '2'
      },
    }
  },

  
  eFormLibrary:{
    eFormLibrary_keyboardShortcuts: {
      eFormLibrary_shortcuts_enabled: false,

      eFormLibrary_shortcut_close_enabled: true,
      eFormLibrary_shortcut_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
    }
  },

  inbox:{
    inbox_buttons: true,
    
    inbox_keyboardShortcuts: {
      inbox_shortcuts_enabled: false,

      inbox_shortcut_close_enabled: true,
      inbox_shortcut_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'z'
      },
      inbox_shortcut_openResult_enabled: true,
      inbox_shortcut_openResult_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
    }
  },

  inboxItem:{
    inboxItem_labelLabs: true,
    inboxItem_styleChange: false,

    inboxItem_keyboardShortcuts: {
      inboxItem_shortcuts_enabled: false,

      inboxItem_shortcut_acknowledge_enabled: true,
      inboxItem_shortcut_acknowledge_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      inboxItem_shortcut_openEChart_enabled: true,
      inboxItem_shortcut_openEChart_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'q'
      },
      inboxItem_shortcut_openTickler_enabled: true,
      inboxItem_shortcut_openTickler_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },

    }
  },

  medications:{
    meds_confirmClose: true,
    
    meds_mainWindowKeyboardShortcuts: {
      meds_mainWindowShortcuts_enabled: false,

      meds_mainWindowShortcut_savePrint_enabled: true,
      meds_mainWindowShortcut_savePrint_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      meds_mainWindowShortcut_setFocusDrugSearchbox_enabled: true,
      meds_mainWindowShortcut_setFocusDrugSearchbox_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
      meds_mainWindowShortcut_close_enabled: true,
      meds_mainWindowShortcut_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'q'
      },
    },

    meds_lightWindowKeyboardShortcuts: {
      meds_lightWindowShortcuts_enabled: false,

      meds_lightWindowShortcut_print_enabled: true,
      meds_lightWindowShortcut_print_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      meds_lightWindowShortcut_fax_enabled: true,
      meds_lightWindowShortcut_fax_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '2'
      },
      meds_lightWindowShortcut_close_enabled: true,
      meds_lightWindowShortcut_close_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        key: 'Escape'
      },
    }
  },

  tickler:{
    tickler_setFocusTextArea: true,
    tickler_prefixWriteEncounter_submitExit: false,
    tickler_prefixWriteEncounter_submitWrite: false,

    tickler_keyboardShortcuts: {
      tickler_shortcuts_enabled: false,

      tickler_shortcut_close1_enabled: true,
      tickler_shortcut_close1_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'z'
      },
      tickler_shortcut_close2_enabled: true,
      tickler_shortcut_close2_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'w'
      },
      tickler_shortcut_submit_enabled: true,
      tickler_shortcut_submit_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '1'
      },
      tickler_shortcut_submitWrite_enabled: true,
      tickler_shortcut_submitWrite_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: '2'
      },
      tickler_shortcut_setFocusTextArea_enabled: true,
      tickler_shortcut_setFocusTextArea_keybinding: {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        key: 'a'
      },
    }
  },


};



/* 
- rebuild the settings object according to the structure of settingsTemplate 
(derived from defaultSettings), 
- if structure is the same (i.e. the values have the same data types), 
retain the value of storedSettings. if different, take on the value of defaultSettings
NOTE:
- if the key doesn't exist in storedSettings, the storedValue will be null, and so the rebuiltSettings 
will default to the value in default settings.

*/
function rebuildSettingsStructure(settingsTemplate, storedSettings){
  let rebuiltSettings = {};
  // console.log(storedSettings);
  for (const [key, value] of Object.entries(settingsTemplate)){
    
    const storedValue = storedSettings[key];
    // console.log(key);
    // console.log(value);
    // console.log(storedValue);

    /* 
    - if the key doesn't exist in storedSettings, the storedValue will be null, 
    and so will not match the value from the default settings template. 
    Therefore, the rebuiltSettings will default to the value in the default settings template.
    */
    if (typeof value != typeof storedValue){
      rebuiltSettings[key] = value;
    } 
    else { // value types match
      if (typeof value == "boolean" || typeof value == "string" || typeof value == "number"){
        rebuiltSettings[key] = storedValue;
      }
      else if (Array.isArray(value)){
        const settingsTemplate_firstIndex = value[0]
        rebuiltSettings[key] = rebuildSettingsStructure_Array(settingsTemplate_firstIndex, storedValue);
      }
      else if (typeof value == "object" //&& typeof storedValue == "object" 
          && !Array.isArray(value) 
          && value !== null
      ){
        // console.log("hi2");
        rebuiltSettings[key] = rebuildSettingsStructure(value, storedValue);
      } 
      else { 
        // value types match, but is not boolean, string, number, or object. 
        // may be bigint, undefined, symbol, null
        console.log("UNEXPECTED:" + key + value);
        rebuiltSettings[key] = storedValue;
      }
    }
  }

  return rebuiltSettings;
}

/* 
NOTE:
- settingsTemplate_firstIndex is just the first item in the array. this is used as the template
for creating settingsTemplate_correctIndexNum, which is the same template with the correct index number.
This template is then used for rebuilding the rest of the items in the array.
- we can't just use the array itself from default Settings, in case storedSettingsArray is longer
than default Settings Array
- if storedSettingsArray isn't an array, just return an empty array.
*/
function rebuildSettingsStructure_Array(settingsTemplate_firstIndex, storedSettingsArray){
  console.log(storedSettingsArray);
  console.log(storedSettingsArray.length);
  if (!Array.isArray(storedSettingsArray)){
    return [];
  }

  let rebuiltSettingsArray = [];
  for (let i = 0; i < storedSettingsArray.length; i++){
    const buttonNum = i+1;
    const settingsTemplate_correctIndexNum = 
      getSettingsTemplateWithCorrectIndexNum(settingsTemplate_firstIndex, buttonNum);

    storedSettingsOneItem = storedSettingsArray[i];

    rebuiltSettingsArray.push(
      rebuildSettingsStructure(settingsTemplate_correctIndexNum, storedSettingsOneItem));

  }
  console.log(rebuiltSettingsArray);
  return rebuiltSettingsArray;
}

/* 
- from settingsTemplate_firstIndex, returns a settingsTemplate object with the
 correct structure and index number
ASSUMES:
- the index number is in the format _X_, and so can be easily searched for and replaced.
  - e.g. bcBillingButton2_3_enabled. where _3_ denotes that it's the 3rd element in the array.
NOTES
- assumes the settingsTemplate_firstIndex is the first element in its respective array.
- we don't care about the actual value stored in the settings, as this is just the settingsTemplate.
 this is why we store an empty keybinding
*/
function getSettingsTemplateWithCorrectIndexNum(settingsTemplate_firstIndex, buttonNum){
  let rebuiltSettings = {};
  for (const [key, value] of Object.entries(settingsTemplate_firstIndex)){
    const keySplitWithoutGroupButtonNum = key.split(/\_\d+\_/); // e.g. "bcBillingButton1", "_1_", "enabled"
    const keyWithCorrectGroupButtonNum = 
      keySplitWithoutGroupButtonNum[0] + "_" + buttonNum + "_" + keySplitWithoutGroupButtonNum[1];
    if (typeof value == "boolean" || typeof value == "string" || typeof value == "number"){
      // console.log(key);
      rebuiltSettings[keyWithCorrectGroupButtonNum] = value;
      // console.log(document.getElementById(key).checked);
    } 
    else if (key.includes("_keybinding")){
      rebuiltSettings[keyWithCorrectGroupButtonNum] = returnEmptyKeybinding();
    }
    else{
      console.assert(typeof value == "object");
      rebuiltSettings[keyWithCorrectGroupButtonNum] =  
        getSettingsTemplateWithCorrectIndexNum(value, buttonNum);
    }
  }
  
  return rebuiltSettings;
}

/* 
- ensure stored settings matches the default settings object in structure (although the values may be different). 
if doesn't match, then fixes it.
- also clears the storage
NOTE
- this rebuilds the settings according to the structure of settingsStructure and stores it in storage.
HOW TO TEST THIS:
- uncomment setTestSettings in options.js, reload the program, and open the GUI settings page. 
It loads in settings that are invalid/out of date and there should be an error when 
you open the GUI settings page.
- re-comment out setTestSettings and reload the program. This function should run
and fix the error. Inspect to verify.
 */
async function checkStoredSettingsStructure(){
  const storedSettings = await browser.storage.local.get(defaultSettings);
  const rebuiltSettings = rebuildSettingsStructure(defaultSettings, storedSettings);
  console.log(rebuiltSettings);
  console.log(storedSettings);
  await browser.storage.local.clear();
  await browser.storage.local.set(rebuiltSettings);
  console.log(await browser.storage.local.get());
}


