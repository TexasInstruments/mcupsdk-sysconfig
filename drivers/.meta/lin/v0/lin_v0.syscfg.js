
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/lin/soc/lin_${common.getSocName()}`);
let hwi = system.getScript("/kernel/dpl/hwi.js");

let LIN_InterruptFlags = [
    {name: " LIN_INT_WAKEUP", displayName : " Wakeup "},
    {name: " LIN_INT_TO", displayName : " Time out "},
    {name: " LIN_INT_TOAWUS", displayName : " Time out after wakeup signal "},
    {name: " LIN_INT_TOA3WUS", displayName : " Time out after 3 wakeup signals "},
    {name: " LIN_INT_TX", displayName : " Transmit buffer ready "},
    {name: " LIN_INT_RX", displayName : " Receive buffer ready "},
    {name: " LIN_INT_ID", displayName : " Received matching identifier "},
    {name: " LIN_INT_PE", displayName : " Parity error "},
    {name: " LIN_INT_OE", displayName : " Overrun error "},
    {name: " LIN_INT_FE", displayName : " Framing error "},
    {name: " LIN_INT_NRE", displayName : " No response error "},
    {name: " LIN_INT_ISFE", displayName : " Inconsistent sync field error "},
    {name: " LIN_INT_CE", displayName : " Checksum error "},
    {name: " LIN_INT_PBE", displayName : " Physical bus error "},
    {name: " LIN_INT_BE", displayName : " Bit error "},
    {name: " LIN_INT_ALL", displayName : " All interrupts "},
];

function getConfigArr() {
    return system.getScript(`/drivers/lin/soc/lin_${common.getSocName()}`).getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === solution.peripheralName);

    config.clockFrequencies[0].clkRate = moduleInstance.inputClkFreqHLD;
    config.clockFrequencies[0].clkId = moduleInstance.clockSourceHLD;

    return {
        ...config,
        ...moduleInstance
    }
}

function getPeripheralPinNames(inst) {
    return [ "RXD", "TXD" ];
}

function pinmuxRequirements(inst) {
   let interfaceName = getInterfaceName(inst);

    let resources = [];
    let pinResource = {};

    pinResource = pinmux.getPinRequirements(interfaceName, "RXD", "LIN RX Pin");
    pinmux.setConfigurableDefault( pinResource, "rx", true );
    resources.push( pinResource);
    pinResource = pinmux.getPinRequirements(interfaceName, "TXD", "LIN TX Pin");
    pinmux.setConfigurableDefault( pinResource, "rx", false );
    resources.push( pinResource);

    let peripheral = {
        name: interfaceName,
        displayName: "LIN Instance",
        interfaceName: interfaceName,
        resources: resources,
        signalTypes: {
            RXD: "RXD",
            TXD: "TXD"
        }
    };

    return [peripheral];
}

function getInterfaceName(instance) {
    return soc.getInterfaceName(instance);
}

function getClockEnableIds(instance) {
    let instConfig = getInstanceConfig(instance);
    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}

function EnableInterruptChanged(inst, ui) {
    if(inst.enableInterrupt == false){
        ui.interruptFlags.hidden = true
        ui.interruptLine.hidden = true
        ui.interruptPriorityLine0.hidden = true
        ui.interruptPriorityLine1.hidden = true
    }
    else{
        ui.interruptFlags.hidden = false
        ui.interruptLine.hidden = false
        ui.interruptPriorityLine0.hidden = false
        ui.interruptPriorityLine1.hidden = false
    }
}

function LoopBackTypeChanged(inst, ui) {
    if (inst.loopbackType == "LIN_LOOPBACK_DIGITAL"){
        ui.loopbackPath.hidden = true
    }
    else{
        ui.loopbackPath.hidden = false
    }
}

function LoopBackModeChanged(inst, ui) {
    if (inst.loopbackMode == "LIN_TEST_INTERNAL"){
        ui.loopbackType.hidden = true
        ui.loopbackPath.hidden = true
        inst.loopbackType = "LIN_LOOPBACK_DIGITAL"
    }
    else{
        ui.loopbackType.hidden = false
    }
}

function OverrideEnableLoopback(inst, ui) {
    if (inst.enableLoopback == false){
        ui.loopbackMode.hidden = true
        ui.loopbackType.hidden = true
        ui.loopbackPath.hidden = true
        inst.loopbackMode = "LIN_TEST_INTERNAL"
        inst.loopbackType = "LIN_LOOPBACK_DIGITAL"
    }
    else{
        ui.loopbackMode.hidden = false
    }
}

function OverrideDefaultConfiguration(inst, ui) {
    if (inst.useDefault == false){
        ui.linMode.hidden = false
        ui.linCommMode.hidden = false
        ui.linDebugMode.hidden = false
        ui.linChecksum.hidden = false
        ui.linMsgFilter.hidden = false
        ui.enableParityCheck.hidden = false
    } else {
        ui.linMode.hidden = true
        ui.linCommMode.hidden = true
        ui.linDebugMode.hidden = true
        ui.linChecksum.hidden = true
        ui.linMsgFilter.hidden = true
        ui.enableParityCheck.hidden = true
    }
}

let configLLD = [
    {
        name        : "enableLoopback",
        displayName : "Enable Loopback",
        onChange    : OverrideEnableLoopback,
        description : 'Whether to Enable the Loopback or not',
        hidden      : false,
        default     : false
    },
    {
        name        : "loopbackMode",
        displayName : "Loopback Mode",
        onChange    : LoopBackModeChanged,
        description : 'Whether Loopback is internal or external',
        hidden      : true,
        default     : "LIN_TEST_INTERNAL",
        options     :
        [
            {name: "LIN_TEST_INTERNAL", displayName : "Internal Loopback Mode"},
            {name: "LIN_TEST_EXTERNAL", displayName : "External Loopback Mode"},
        ]
    },
    {
        name        : "loopbackType",
        displayName : "Type of Loopback",
        onChange    : LoopBackTypeChanged,
        description : 'Whether Loopback is analog or digital',
        hidden      : true,
        default     : "LIN_LOOPBACK_DIGITAL",
        options     :
        [
            { name: "LIN_LOOPBACK_DIGITAL", displayName: "Digital Loopback Mode" },
            { name: "LIN_LOOPBACK_ANALOG", displayName: "Analog Loopback Mode" },
        ]
    },
    {
        name        : "loopbackPath",
        displayName : "Loopback Path In Analog Loopback",
        onChange    : LoopBackTypeChanged,
        description : 'Loopback path in Analog loopback',
        hidden      : true,
        default     : "LIN_ANALOG_LOOP_NONE",
        options     :
        [
            { name: "LIN_ANALOG_LOOP_NONE", displayName: "Default path for digital loopback mode" },
            { name: "LIN_ANALOG_LOOP_TX", displayName: "Analog loopback through transmit pin" },
            { name: "LIN_ANALOG_LOOP_RX", displayName: "Analog loopback through receive pin" },
        ]
    },
    {
        name        : "enableInterrupt",
        displayName : "Enable Interrupt",
        onChange    : EnableInterruptChanged,
        description : 'Enable Interrupt',
        hidden      : false,
        default     : false
    },
    {
        name        : "interruptFlags",
        displayName : "Interrupt Flags",
        description : 'Which Interrupts to enable',
        hidden      : true,
        minSelections : 0,
        default     : [],
        options     : LIN_InterruptFlags,

    },
    {
        name        : "interruptLine",
        displayName : "Interrupt Line",
        description : 'Which Interrupt Lines to enable',
        hidden      : true,
        minSelections : 0,
        default     : [],
        options     :
        [
            { name: "LIN_INTERRUPT_LINE0", displayName: "Interrupt line 0" },
            { name: "LIN_INTERRUPT_LINE1", displayName: "Interrupt line 1" },
        ]
    },
    {
        name        : "interruptPriorityLine0",
        displayName : "Interrupt Line 0 Triggers",
        description : 'Interrupt Line 0 triggers',
        hidden      : true,
        minSelections : 0,
        default     : [],
        options     : LIN_InterruptFlags,
    },
    {
        name        : "interruptPriorityLine1",
        displayName : "Interrupt Line 1 Triggers",
        description : 'Interrupt Line 1 triggers',
        hidden      : true,
        minSelections : 0,
        default     : [],
        options     : LIN_InterruptFlags,
    },
    {
        name        : "useDefault",
        displayName : "Use Default Configuration",
        onChange    : OverrideDefaultConfiguration,
        description : 'Whether to use default initialization or custom',
        hidden      : false,
        default     : true
    },
    {
        name        : "linMode",
        displayName : "LIN Mode",
        description : 'Whether to use LIN as a Commander or a Responder',
        hidden      : true,
        default     : "LIN_MODE_LIN_COMMANDER",
        options     :
        [
            { name: "LIN_MODE_LIN_COMMANDER", displayName: "The node is in commander mode" },
            { name: "LIN_MODE_LIN_RESPONDER", displayName: "The node is in responder mode" },
        ]
    },
    {
        name        : "linCommMode",
        displayName : "LIN Communication Mode",
        description : 'Length to be used from SCIFORMAT or ID4 and ID5 bit fields',
        hidden      : true,
        default     : "LIN_COMM_LIN_USELENGTHVAL",
        options     :
        [
            { name: "LIN_COMM_LIN_USELENGTHVAL", displayName: "Use the length indicated in the LENGTH field of the SCIFORMAT register" },
            { name: "LIN_COMM_LIN_ID4ID5LENCTL", displayName: "Use ID4 and ID5 to convey the length" },
        ]
    },
    {
        name        : "linDebugMode",
        displayName : "LIN Debug Mode",
        description : 'To determine how to freeze the Debug mode',
        hidden      : true,
        default     : "LIN_DEBUG_FROZEN",
        options     :
        [
            { name: "LIN_DEBUG_FROZEN", displayName: "Freeze module during debug" },
            { name: "LIN_DEBUG_COMPLETE", displayName: "Complete Tx/Rx before Freezing" },
        ]
    },
    {
        name        : "linChecksum",
        displayName : "LIN Checksum Type",
        description : 'To determine what type of checksum to be used',
        hidden      : true,
        default     : "LIN_CHECKSUM_CLASSIC",
        options     :
        [
            { name: "LIN_CHECKSUM_CLASSIC", displayName: "Checksum Classic" },
            { name: "LIN_CHECKSUM_ENHANCED", displayName: "Checksum Enhanced" },
        ]
    },
    {
        name        : "linMsgFilter",
        displayName : "LIN Message Filter",
        description : 'To determine what type of message filter to be used',
        hidden      : true,
        default     : "LIN_MSG_FILTER_IDRESPONDER",
        options     :
        [
            { name: "LIN_MSG_FILTER_IDBYTE", displayName: "LIN Message ID Byte Filtering" },
            { name: "LIN_MSG_FILTER_IDRESPONDER", displayName: "Responder Task ID Byte Filtering" },
        ]
    },
    {
        name        : "enableParityCheck",
        displayName : "Enable Parity Check",
        description : 'Enable Parity Check on the Messages',
        hidden      : true,
        default     : true
    },
];

let configHLD = [

    {
        name        : "moduleModeHLD",
        displayName : "Module Operational Mode",
        description : "Determines whether the Module operates in LIN mode or SCI Mode",
        hidden      : true,
        default     : "LIN_MODULE_OP_MODE_LIN",
        options     :
        [
            { name: "LIN_MODULE_OP_MODE_LIN", displayName: "LIN" },
            // { name: "LIN_MODULE_OP_MODE_SCI", displayName: "SCI" },
        ],
        onChange: function (inst, ui) {
            if(inst.moduleModeHLD == "LIN_MODULE_OP_MODE_LIN") {
                /* LIN Mode Configurable */
                ui.linModeHLD.hidden = false;
                ui.commModeLinHLD.hidden = false;
                ui.maskFilteringTypeHLD.hidden = false;
                ui.linTxMaskHLD.hidden = false;
                ui.linRxMaskHLD.hidden = false;
                ui.checksumTypeHLD.hidden = false;
                ui.adaptModeEnableHLD.hidden = false;

                if (inst.adaptModeEnableHLD == true) {
                    ui.maxBaudRateHLD.hidden = false;
                } else {
                    ui.maxBaudRateHLD.hidden = true;
                }

                ui.syncDelimiterHLD.hidden = false;
                ui.syncBreakHLD.hidden = false;

                /* SCI Mode Configurable */
                ui.commModeSciHLD.hidden = true;
                ui.parityTypeHLD.hidden = true;
                ui.stopBitsHLD.hidden = true;
                ui.dataBitsHLD.hidden = true;
            }
            else {
                /* LIN Mode Configurable */
                ui.linModeHLD.hidden = true;
                ui.commModeLinHLD.hidden = true;
                ui.maskFilteringTypeHLD.hidden = true;
                ui.linTxMaskHLD.hidden = true;
                ui.linRxMaskHLD.hidden = true;
                ui.checksumTypeHLD.hidden = true;
                ui.adaptModeEnableHLD.hidden = true;
                ui.maxBaudRateHLD.hidden = true;

                ui.syncDelimiterHLD.hidden = true;
                ui.syncBreakHLD.hidden = true;

                /* SCI Mode Configurable */
                ui.commModeSciHLD.hidden = false;

                if(inst.enableParityHLD == true) {
                    ui.parityTypeHLD.hidden = false;
                } else {
                    ui.parityTypeHLD.hidden = true;
                }

                ui.stopBitsHLD.hidden = false;
                ui.dataBitsHLD.hidden = false;
            }

            if(inst.transferModeHLD == "LIN_TRANSFER_MODE_CALLBACK") {
                ui.transferCompleteCallbackFxnHLD.hidden = false;
            } else {
                ui.transferCompleteCallbackFxnHLD.hidden = true;
            }
        },
    },
    {
        name: "GROUP_CLOCK_CONFIGURATION",
        displayName: "Clock Configuration",
        collapsed:true,
        config: [
            {
                name: "clockSourceHLD",
                displayName: "Module Clock Source",
                default: soc.getClkSource(),
                description: "Clock Source",
                hidden: true,
                getValue: (inst) => {
                    const interfaceName = getInterfaceName(inst)
                    const linSolution = inst[interfaceName].$solution
                    let linInstanceName = ""
                    if(linSolution)
                        linInstanceName   = linSolution.peripheralName
                    else
                        linInstanceName = "LIN0"
                    return soc.getClkSource(linInstanceName)
                }
            },
            {
                name: "inputClkFreqHLD",
                displayName: "Input Clock Frequency (Hz)",
                default: soc.getClkRate(),
                hidden: true,
                getValue: (inst) => {
                    const interfaceName = getInterfaceName(inst)
                    const linSolution = inst[interfaceName].$solution
                    let linInstanceName = ""
                    if(linSolution)
                        linInstanceName   = linSolution.peripheralName
                    else
                        linInstanceName = inst[interfaceName].$suggestSolution?.peripheralName
                    return soc.getClkRate(linInstanceName)
                }
            },
        ]
    },
    {
        name: "GROUP_GENERAL_CONFIGURATION",
        displayName: "General Configuration",
        collapsed:true,
        config: [
            {
                name        : "opModeHLD",
                displayName : "Operating Mode",
                description : "Driver's Mode of Operation",
                hidden      : true,
                default     : "LIN_OPER_MODE_INTERRUPT",
                options     :
                [
                    { name: "LIN_OPER_MODE_POLLING", displayName: "Polled Mode" },
                    { name: "LIN_OPER_MODE_INTERRUPT", displayName: "Interrupt Mode" },
                    { name: "LIN_OPER_MODE_DMA", displayName: "DMA Mode" },
                ],
                onChange: function (inst, ui) {
                    if(inst.opModeHLD == "LIN_OPER_MODE_INTERRUPT") {
                        ui.transferModeHLD.hidden = false;
                        ui.intrPriority.hidden = false;
                    } else if(inst.opModeHLD == "LIN_OPER_MODE_POLLING") {
                        ui.transferModeHLD.hidden = true;
                        ui.intrPriority.hidden = true;
                    } else {
                        ui.intrPriority.hidden = true;
                    }
                },
            },
            {
                name            : "transferModeHLD",
                displayName     : "Transfer Mode",
                description     : "Determines whether the driver operates synchronously or asynchronously",
                // longDescription : "",
                hidden          : true,
                default         : "LIN_TRANSFER_MODE_BLOCKING",
                options         :
                [
                    { name: "LIN_TRANSFER_MODE_BLOCKING", displayName: "Blocking" },
                    { name: "LIN_TRANSFER_MODE_CALLBACK", displayName: "Callback" },
                ],
                onChange: function (inst, ui) {
                    if(inst.transferModeHLD == "LIN_TRANSFER_MODE_BLOCKING") {
                        ui.transferCompleteCallbackFxnHLD.hidden = true;
                    } else {
                        ui.transferCompleteCallbackFxnHLD.hidden = false;
                    }
                },
            },
            {
                name: "transferCompleteCallbackFxnHLD",
                displayName: "Transfer Complete Callback",
                default: "NULL",
                hidden: true,
                description: "Transfer Complete Callback function when Callback mode is selected",
            },
            {
                name: "intrPriority",
                displayName: "Interrupt Priority",
                default: 4,
                hidden: true,
                description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
            },
        ]
    },
    {
        name: "GROUP_ADVANCED_CONFIGURATION",
        displayName: "Advanced Configuration",
        collapsed:true,
        config: [

            {
                name        : "debugModeHLD",
                displayName : "Debug Mode Configuration",
                description : "Determines whether the module will freeze during debug or complete transfer before freezing.",
                hidden      : true,
                default     : "LIN_HLD_DEBUG_COMPLETE",
                options     :
                [
                    { name: "LIN_HLD_DEBUG_FROZEN", displayName: "Frozen" },
                    { name: "LIN_HLD_DEBUG_COMPLETE", displayName: "Complete" },
                ],
                onChange: function (inst, ui) {
                    // might not be required
                    if(inst.debugModeHLD == "LIN_HLD_DEBUG_COMPLETE") {
                    } else {}
                },
            },
            {
                name: "enableLoopbackHLD",
                displayName: "Enable Loopback",
                default: false,
                hidden: true,
                description: "If enabled, Loopback is enabled through configured Lines",
                onChange: function (inst, ui) {
                    if(inst.enableLoopbackHLD == true) {
                        ui.loopBackModeHLD.hidden = false;
                        if(inst.loopBackModeHLD == "LIN_HLD_LOOPBACK_INTERNAL") {
                            ui.loopBackTypeHLD.hidden = true;
                        } else {
                            ui.loopBackTypeHLD.hidden = false;
                        }
                    } else {
                        ui.loopBackModeHLD.hidden = true;
                        ui.loopBackTypeHLD.hidden = true;
                    }
                },
            },
            {
                name        : "loopBackModeHLD",
                displayName : "Loopback Mode",
                description : "Determines whether the loopback is internal or external.",
                hidden      : true,
                default     : "LIN_HLD_LOOPBACK_INTERNAL",
                options     :
                [
                    { name: "LIN_HLD_LOOPBACK_INTERNAL", displayName: "Internal Loopback" },
                    { name: "LIN_HLD_LOOPBACK_EXTERNAL", displayName: "External Loopback" },
                ],
                onChange: function (inst, ui) {
                    if(inst.loopBackModeHLD == "LIN_HLD_LOOPBACK_INTERNAL") {
                        ui.loopBackTypeHLD.hidden = true;
                    } else {
                        ui.loopBackTypeHLD.hidden = false;
                    }
                },
            },
            {
                name        : "loopBackTypeHLD",
                displayName : "Loopback Type",
                description : "Determines whether the loopback is Digital or Analog.",
                hidden      : true,
                default     : "LIN_HLD_LOOPBACK_DIGITAL",
                options     :
                [
                    { name: "LIN_HLD_LOOPBACK_DIGITAL", displayName: "Digital Loopback" },
                    { name: "LIN_HLD_LOOPBACK_ANALOG", displayName: "Analog Loopback" },
                ],
                onChange: function (inst, ui) {
                    // might not be required
                    if(inst.loopBackTypeHLD == "LIN_HLD_LOOPBACK_DIGITAL") {

                    } else {

                    }
                },
            },
        ]
    },
    {
        name: "GROUP_BAUD_CONFIGURATION",
        displayName: "Baud Configuration",
        collapsed:true,
        config: [
            {
                name: "manualConfigBaudHLD",
                displayName: "Manual Configuration",
                default: false,
                hidden: true,
                description: "If enabled, Baud Pre-scalers Can be assigned Manually",
                onChange: function (inst, ui) {
                    if(inst.manualConfigBaudHLD == true) {
                        ui.baudPreScalerHLD.readOnly = false;
                        ui.fracDivSel_M_HLD.readOnly = false;
                        ui.supFracDivSel_U_HLD.readOnly = false;
                        ui.baudRateHLD.readOnly = true;
                        /** Calculate and Change Baud Value */
                        let config = soc.getDefaultConfig();
                        inst.baudRateHLD = (config.sysClk/((16.0*inst.baudPreScalerHLD) + 16 + inst.fracDivSel_M_HLD)) | 0;

                    } else {
                        ui.baudPreScalerHLD.readOnly = true;
                        ui.fracDivSel_M_HLD.readOnly = true;
                        ui.supFracDivSel_U_HLD.readOnly = true;
                        ui.baudRateHLD.readOnly = false;
                        /** Re Calculate and change in case of modification by user */
                        let config = soc.getDefaultConfig();
                        inst.baudPreScalerHLD = ((config.sysClk/(16.0*inst.baudRateHLD)) - 1) | 0;
                        inst.fracDivSel_M_HLD = 16*((config.sysClk/(16.0*inst.baudRateHLD)) - (inst.baudPreScalerHLD + 1)) | 0;
                    }
                },
            },
            {
                name: "baudRateHLD",
                displayName: "Baud Rate(Bits/s)",
                default: 19200,
                hidden: true,
                readOnly: false,
                description: "Baud Rate",
                onChange: function (inst, ui) {
                    let config = soc.getDefaultConfig();
                    inst.baudPreScalerHLD = ((config.sysClk/(16.0*inst.baudRateHLD)) - 1) | 0;
                    inst.fracDivSel_M_HLD = 16*((config.sysClk/(16.0*inst.baudRateHLD)) - (inst.baudPreScalerHLD + 1)) | 0;
                },
            },
            {
                name: "baudPreScalerHLD",
                displayName: "Prescaler",
                description: "The 24-bit integer prescaler used to select the required baud rates.",
                default: getDefaultPreScaler(),
                hidden: true,
                readOnly: true,
                description: "Prescaler",
                onChange: function (inst, ui) {
                    /** Calculate and Change Baud Value */
                    let config = soc.getDefaultConfig();
                    inst.baudRateHLD = (config.sysClk/((16.0*inst.baudPreScalerHLD) + 16 + inst.fracDivSel_M_HLD)) | 0;
                },
            },
            {
                name: "fracDivSel_M_HLD",
                displayName: "Fractional Divider",
                description: "The 4-bit fractional divider to refine the baud rate selection.",
                default: getDefaultFracDiv(),
                hidden: true,
                readOnly: true,
                description: "Fractional Divider",
                onChange: function (inst, ui) {
                    /* Calculate and Change Baud Value */
                    let config = soc.getDefaultConfig();
                    inst.baudRateHLD = (config.sysClk/((16.0*inst.baudPreScalerHLD) + 16 + inst.fracDivSel_M_HLD)) | 0;
                },
            },
            {
                name: "supFracDivSel_U_HLD",
                displayName: "Super Fractional Divider",
                default: 0,
                hidden: true,
                readOnly: true,
                description: "Super Fractional Divider",
                onChange: function (inst, ui) {
                    /** Calculate and Change Baud Value */
                },
            },
        ]
    },
    {
        name: "GROUP_LIN_MODE_CONFIGURATION",
        displayName: "LIN/SCI Mode Configuration",
        collapsed: true,
        config: [
            {
                name: "enableParityHLD",
                displayName: "Enable Parity",
                hidden: true,
                default: true,
                description: "Determines whether Parity is Enabled",
                onChange: function (inst, ui) {
                    if(inst.moduleModeHLD == "LIN_MODULE_OP_MODE_LIN") {
                        ui.parityTypeHLD.hidden = true;
                    } else {
                        if(inst.enableParityHLD == true) {
                            ui.parityTypeHLD.hidden = false;
                        } else {
                            ui.parityTypeHLD.hidden = true;
                        }
                    }
                },
            },
            {
                name: "parityTypeHLD",
                displayName: "Parity Type",
                hidden: true,
                default: "LIN_HLD_SCI_PARITY_ODD",
                description: "Designates odd or even parity.",
                longDescription:`
The parity bit is calculated based on the data bits in each frame and the
address bit [in address-bit mode]. The start and stop fields in the
frame are not included in the parity calculation.

- **Odd:** The module transmits and expects to receive a value in the parity bit that makes odd the total number of bits in the frame with the value of 1.
- **Even:** The module transmits and expects to receive a value in the parity bit that makes even the total number of bits in the frame with the value of 1.`,
                options:
                [
                    { name: "LIN_HLD_SCI_PARITY_ODD", displayName: "Odd" },
                    { name: "LIN_HLD_SCI_PARITY_EVEN", displayName: "Even" },
                ],
                onChange: function (inst, ui) {
                    if(inst.parityTypeHLD == "LIN_HLD_SCI_PARITY_ODD") {
                    } else {}
                },
            },
            {
                name: "multiBufferModeHLD",
                displayName: "Multi Buffer Mode",
                hidden: true,
                default: true,
                description: "Controls receive/transmit buffer usage, that is, whether the RX/TX multi-buffers are used or a single register is used.",
                onChange: function (inst, ui) {
                    if(inst.multiBufferModeHLD == true) {
                    } else {}
                },
            },
            {
                name: "commModeLinHLD",
                displayName: "Comm Mode",
                hidden: true,
                default: "LIN_COMM_HLD_LIN_USELENGTHVAL",
                description: "Selects length control option.",
                longDescription: `
Selects length control option for ID-field bits ID4 and ID5.
- **USELENGTHVAL:** ID4 and ID5 are not used for length control.
- **ID4ID5LENCTL:** ID4 and ID5 are used for length control.`,
                options:
                [
                    { name: "LIN_COMM_HLD_LIN_USELENGTHVAL", displayName: "USELENGTHVAL" },
                    { name: "LIN_COMM_HLD_LIN_ID4ID5LENCTL", displayName: "ID4ID5LENCTL" },
                ],
                onChange: function (inst, ui) {
                    if(inst.commModeLinHLD == "LIN_COMM_HLD_LIN_USELENGTHVAL") {
                    } else {}
                },
            },
            {
                name: "commModeSciHLD",
                displayName: "Comm Mode",
                hidden: true,
                default: "LIN_COMM_HLD_SCI_IDLELINEMODE",
                description: "SCI communication mode.",
                longDescription: `
Selects the SCI Communication Mode.
- **Idle Line:** Idle-line mode is used.
- **Address Bit:** Address-bit mode is used.`,
                options:
                [
                    { name: "LIN_COMM_HLD_SCI_IDLELINEMODE", displayName: "Idle Line" },
                    { name: "LIN_COMM_HLD_SCI_ADDRBITMODE", displayName: "Address Bit" },
                ],
                onChange: function (inst, ui) {
                    if(inst.commModeSciHLD == "LIN_COMM_HLD_SCI_IDLELINEMODE") {
                    } else {}
                },
            },
            {
                name: "linModeHLD",
                displayName: "LIN Mode",
                hidden: true,
                default: "LIN_MODE_HLD_LIN_COMMANDER",
                description: "Selects LIN Commander/Responder Configuration.",
                options:
                [
                    { name: "LIN_MODE_HLD_LIN_COMMANDER", displayName: "Commander" },
                    { name: "LIN_MODE_HLD_LIN_RESPONDER", displayName: "Responder" },
                ],
                onChange: function (inst, ui) {
                    if(inst.linModeHLD == "LIN_MODE_HLD_LIN_COMMANDER") {
                    } else {}
                },
            },
            {
                name: "maskFilteringTypeHLD",
                displayName: "Filtering Type",
                hidden: true,
                default: "LIN_HLD_MSG_FILTER_IDRESPONDER",
                description: "Mask filtering comparison type.",
                longDescription: `
Controls the type of mask filtering comparison.

- **ID Responder:** RECEIVEDID and IDSLAVETASKBYTE fields in the LINID register are used for detecting a match (using TX/RXMASK values). Mask of 0xFF in
LINMASK register will result in ALWAYS match.
- **ID Byte:** RECEIVEDID and IDBYTE fields in the LINID register are used for detecting a match (using TX/RXMASK values). Mask of 0xFF in LINMASK
register will result in NO match.

**Note:** ID filtering using ID-SlaveTask(ID Responder) byte(Recommended).`,
                options:
                [
                    { name: "LIN_HLD_MSG_FILTER_IDBYTE", displayName: "ID Byte" },
                    { name: "LIN_HLD_MSG_FILTER_IDRESPONDER", displayName: "ID Responder" },
                ],
                onChange: function (inst, ui) {
                    if(inst.maskFilteringTypeHLD == "LIN_HLD_MSG_FILTER_IDBYTE") {
                    } else {}
                },
            },
            {
                name: "linTxMaskHLD",
                displayName: "TX Mask",
                hidden: true,
                default: 0xFF,
                description: "TX Filter Mask",
                displayFormat: "hex"
            },
            {
                name: "linRxMaskHLD",
                displayName: "RX Mask",
                hidden: true,
                default: 0xFF,
                description: "RX Filter Mask",
                displayFormat: "hex"
            },
            {
                name: "checksumTypeHLD",
                displayName: "Checksum Type",
                hidden: true,
                default: "LIN_HLD_CHECKSUM_ENHANCED",
                description: "Checksum Type(Classic/Enhanced)",
                longDescription: `
Controls the type of checksum to be used: Classic or Enhanced.

- **Enhanced:** Enhanced checksum is used.
Enhanced checksum is compatible with LIN 2.0 and newer responder nodes. The enhanced
checksum contains the modulo-256 sum with carry over all data bytes AND the protected
Identifier.

- **Classic:** Classic checksum is used.
Checksum is compatible with LIN 1.3 responder nodes. The classic checksum contains the
modulo-256 sum with carry over all data bytes. Frames sent with Identifier 60 (0x3C) to
63 (0x3F) must always use the classic checksum.`,
                options:
                [
                    { name: "LIN_HLD_CHECKSUM_CLASSIC", displayName: "Classic" },
                    { name: "LIN_HLD_CHECKSUM_ENHANCED", displayName: "Enhanced" },
                ],
                onChange: function (inst, ui) {
                    if(inst.checksumTypeHLD == "LIN_HLD_CHECKSUM_CLASSIC") {
                    } else {}
                },
            },
            {
                name: "adaptModeEnableHLD",
                displayName: "Adapt Mode Enable",
                hidden: true,
                default: false,
                description: "Adapt Mode Enable",
                onChange: function (inst, ui) {
                    if(inst.adaptModeEnableHLD == true) {
                        ui.maxBaudRateHLD.hidden = false;
                    } else {
                        ui.maxBaudRateHLD.hidden = true;
                    }
                },
            },
            {
                name: "maxBaudRateHLD",
                displayName: "Max Baud Rate(Bits/s)",
                hidden: true,
                default: 20000,
                description: "Max Baud Rate",
                displayFormat: "dec"
            },
            {
                name: "syncDelimiterHLD",
                displayName: "Sync Delimiter",
                hidden: true,
                default: "LIN_HLD_SYNC_DELIMITER_LEN_3",
                description: "Sync Delimiter",
                longDescription: `
2-bit Sync Delimiter compare.
Used to configure the number of Tbit for the sync delimiter in the sync field.`,
                options:
                [
                    { name: "LIN_HLD_SYNC_DELIMITER_LEN_1", displayName: "1 Tbit" },
                    { name: "LIN_HLD_SYNC_DELIMITER_LEN_2", displayName: "2 Tbit" },
                    { name: "LIN_HLD_SYNC_DELIMITER_LEN_3", displayName: "3 Tbit" },
                    { name: "LIN_HLD_SYNC_DELIMITER_LEN_4", displayName: "4 Tbit" },
                ],
                onChange: function (inst, ui) {

                },
            },
            {
                name: "syncBreakHLD",
                displayName: "Sync Break",
                hidden: true,
                default: "LIN_HLD_SYNC_BREAK_LEN_18",
                description: "Sync Break Extend",
                longDescription: `
Used to configure the number of Tbits for the sync break to extend the minimum 13 Tbit in the Sync Field to
a maximum of 20 Tbit.`,
                options:
                [
                    { name: "LIN_HLD_SYNC_BREAK_LEN_13", displayName: "13 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_14", displayName: "14 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_15", displayName: "15 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_16", displayName: "16 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_17", displayName: "17 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_18", displayName: "18 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_19", displayName: "19 Tbit" },
                    { name: "LIN_HLD_SYNC_BREAK_LEN_20", displayName: "20 Tbit" },
                ],
                onChange: function (inst, ui) {

                },
            },
            {
                name: "stopBitsHLD",
                displayName: "Stop Bits",
                hidden: true,
                default: "LIN_HLD_SCI_STOP_BITS_1",
                description: "Stop Bits",
                options:
                [
                    { name: "LIN_HLD_SCI_STOP_BITS_1", displayName: "1 Stop Bit" },
                    { name: "LIN_HLD_SCI_STOP_BITS_2", displayName: "2 Stop Bits" },
                ],
                onChange: function (inst, ui) {
                    if(inst.stopBitsHLD == "LIN_HLD_SCI_STOP_BITS_1") {
                    } else {}
                },
            },
            {
                name: "dataBitsHLD",
                displayName: "Data Bits",
                hidden: true,
                default: 8,
                description: "SCI character length from 1 to 8 bits.",
                displayFormat: "dec"
            },
        ]
    }
];

const hideAllLldConfigs = (ui) => {

    ui.enableLoopback.hidden = true;
    ui.loopbackMode.hidden = true;
    ui.loopbackType.hidden = true;
    ui.loopbackPath.hidden = true;
    ui.enableInterrupt.hidden = true;
    ui.interruptFlags.hidden = true;
    ui.interruptLine.hidden = true;
    ui.interruptPriorityLine0.hidden = true;
    ui.interruptPriorityLine1.hidden = true;
    ui.useDefault.hidden = true;
    ui.linMode.hidden = true;
    ui.linCommMode.hidden = true;
    ui.linDebugMode.hidden = true;
    ui.linChecksum.hidden = true;
    ui.linMsgFilter.hidden = true;
    ui.enableParityCheck.hidden = true;
}

const setLldDefaultConfigs = (inst, ui) => {

    inst.enableLoopback = false;
    ui.enableLoopback.hidden = false;

    inst.loopbackMode = "LIN_TEST_INTERNAL";
    ui.loopbackMode.hidden = true;

    inst.loopbackType = "LIN_LOOPBACK_DIGITAL";
    ui.loopbackType.hidden = true;

    inst.loopbackPath = "LIN_ANALOG_LOOP_NONE";
    ui.loopbackPath.hidden = true;

    ui.useDefault.hidden = false;

    if (inst.useDefault == false){
        ui.linMode.hidden = false
        ui.linCommMode.hidden = false
        ui.linDebugMode.hidden = false
        ui.linChecksum.hidden = false
        ui.linMsgFilter.hidden = false
        ui.enableParityCheck.hidden = false
    } else {
        ui.linMode.hidden = true
        ui.linCommMode.hidden = true
        ui.linDebugMode.hidden = true
        ui.linChecksum.hidden = true
        ui.linMsgFilter.hidden = true
        ui.enableParityCheck.hidden = true
    }

    ui.enableInterrupt.hidden = false;

    if (inst.enableInterrupt === true) {

        ui.interruptFlags.hidden = false;
        ui.interruptLine.hidden = false;
        ui.interruptPriorityLine0.hidden = false;
        ui.interruptPriorityLine1.hidden = false;

    } else {

        ui.interruptFlags.hidden = true;
        ui.interruptLine.hidden = true;
        ui.interruptPriorityLine0.hidden = true;
        ui.interruptPriorityLine1.hidden = true;
    }
}

const hideAllHldConfigs = (ui) => {

    ui.clockSourceHLD.hidden = true;
    ui.inputClkFreqHLD.hidden = true;
    ui.moduleModeHLD.hidden = true;
    ui.opModeHLD.hidden = true;
    ui.transferModeHLD.hidden = true;
    ui.intrPriority.hidden = true;
    ui.manualConfigBaudHLD.hidden = true;
    ui.baudRateHLD.hidden = true;
    ui.baudPreScalerHLD.hidden = true;
    ui.fracDivSel_M_HLD.hidden = true;
    ui.supFracDivSel_U_HLD.hidden = true;
    ui.enableLoopbackHLD.hidden = true;
    ui.loopBackModeHLD.hidden = true;
    ui.loopBackTypeHLD.hidden = true;
    ui.debugModeHLD.hidden = true;
    ui.enableParityHLD.hidden = true;
    ui.multiBufferModeHLD.hidden = true;
    ui.linModeHLD.hidden = true;
    ui.commModeLinHLD.hidden = true;
    ui.commModeSciHLD.hidden = true;
    ui.maskFilteringTypeHLD.hidden = true;
    ui.linTxMaskHLD.hidden = true;
    ui.linRxMaskHLD.hidden = true;
    ui.checksumTypeHLD.hidden = true;
    ui.adaptModeEnableHLD.hidden = true;
    ui.maxBaudRateHLD.hidden = true;
    ui.syncDelimiterHLD.hidden = true;
    ui.syncBreakHLD.hidden = true;
    ui.transferCompleteCallbackFxnHLD.hidden = true;
    ui.parityTypeHLD.hidden = true;
    ui.stopBitsHLD.hidden = true;
    ui.dataBitsHLD.hidden = true;
}

function getDefaultPreScaler() {
    let config = soc.getDefaultConfig();
    return ((config.sysClk/(16.0 * 19200.0)) - 1) | 0;
}
function getDefaultFracDiv() {
    let config = soc.getDefaultConfig();
    return 16*((config.sysClk/(16.0*19200)) - (getDefaultPreScaler() + 1)) | 0;
}

const setHldDefaultConfigs = (inst, ui) => {

    // inst.clockSourceHLD = soc.getDefaultClkSource();
    ui.clockSourceHLD.hidden = false;

    // inst.inputClkFreqHLD = soc.getClockValue(soc.getDefaultClkSource());
    ui.inputClkFreqHLD.hidden = false;

    inst.moduleModeHLD = "LIN_MODULE_OP_MODE_LIN";
    ui.moduleModeHLD.hidden = false;

    inst.opModeHLD = "LIN_OPER_MODE_INTERRUPT";
    ui.opModeHLD.hidden = false;

    inst.transferModeHLD = "LIN_TRANSFER_MODE_BLOCKING";
    ui.transferModeHLD.hidden = false;

    ui.intrPriority.hidden = false;

    /* Baud Related Configurations */
    inst.baudRateHLD = 19200;
    inst.baudPreScalerHLD = getDefaultPreScaler();
    inst.fracDivSel_M_HLD = getDefaultFracDiv();

    ui.manualConfigBaudHLD.hidden = false;
    ui.supFracDivSel_U_HLD.hidden = true

    if(inst.manualConfigBaudHLD === false) {
        ui.baudPreScalerHLD.readOnly = true;
        ui.fracDivSel_M_HLD.readOnly = true;
        ui.supFracDivSel_U_HLD.readOnly = true;
    } else {
        ui.baudPreScalerHLD.readOnly = false;
        ui.fracDivSel_M_HLD.readOnly = false;
        ui.supFracDivSel_U_HLD.readOnly = false;
    }

    inst.debugModeHLD = "LIN_HLD_DEBUG_COMPLETE";
    ui.debugModeHLD.hidden = false;

    inst.enableLoopbackHLD = false;
    ui.enableLoopbackHLD.hidden = false;
    ui.loopBackModeHLD.hidden = true;
    ui.loopBackTypeHLD.hidden = true;

    inst.baudRateHLD = 19200;
    ui.baudRateHLD.hidden = false

    ui.baudPreScalerHLD.hidden = false
    ui.fracDivSel_M_HLD.hidden = false

    inst.enableParityHLD = true;
    ui.enableParityHLD.hidden = false;

    inst.multiBufferModeHLD = true;
    ui.multiBufferModeHLD.hidden = false;

    inst.linModeHLD = "LIN_MODE_HLD_LIN_COMMANDER";
    ui.linModeHLD.hidden = false;

    inst.commModeLinHLD = "LIN_COMM_HLD_LIN_USELENGTHVAL";
    ui.commModeLinHLD.hidden = false;

    inst.commModeSciHLD = "LIN_COMM_HLD_SCI_IDLELINEMODE";
    ui.commModeSciHLD.hidden = true;

    inst.maskFilteringTypeHLD = "LIN_HLD_MSG_FILTER_IDRESPONDER";
    ui.maskFilteringTypeHLD.hidden = false;

    inst.linTxMaskHLD = 0xFF;
    ui.linTxMaskHLD.hidden = false;

    inst.linRxMaskHLD = 0xFF;
    ui.linRxMaskHLD.hidden = false;

    inst.checksumTypeHLD = "LIN_HLD_CHECKSUM_ENHANCED";
    ui.checksumTypeHLD.hidden = false;

    inst.adaptModeEnableHLD = false;
    ui.adaptModeEnableHLD.hidden = false;

    inst.maxBaudRateHLD = 20000;
    ui.maxBaudRateHLD.hidden = true;

    inst.syncDelimiterHLD = "LIN_HLD_SYNC_DELIMITER_LEN_3";
    ui.syncDelimiterHLD.hidden = false;

    inst.syncBreakHLD = "LIN_HLD_SYNC_BREAK_LEN_18";
    ui.syncBreakHLD.hidden = false;

    ui.transferCompleteCallbackFxnHLD.hidden = true;

    ui.parityTypeHLD.hidden = true;
    ui.stopBitsHLD.hidden = true;
    ui.dataBitsHLD.hidden = true;
}

function getConfigurables()
{
    let config = [

        {
            name: "sdkInfra",
            displayName: "SDK Infra",
            default: "LLD",
            options: [
                {
                    name: "HLD",
                    displayName: "HLD"
                },
                {
                    name: "LLD",
                    displayName: "LLD"
                },
            ],
            onChange: function (inst, ui) {
                if(inst.sdkInfra == "LLD") {
                    hideAllHldConfigs(ui);
                    setLldDefaultConfigs(inst, ui);
                } else {
                    hideAllLldConfigs(ui);
                    setHldDefaultConfigs(inst, ui);
                }
            },
            description: "SDK Infra",
        },
    ];

    config.push(...configLLD)
    config.push(...configHLD)

    return config;
}
function filterHardware(component)
{
    return (common.typeMatches(component.type, ["LIN"]));
}

let lin_module_name = "/drivers/lin/lin";

function getModuleStaticAll(inst) {

    let moduleStatic;

    moduleStatic = {
        modules: function(inst) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    }

    return moduleStatic;
}

function addModuleInstances(instance) {
    let modInstances = new Array();

    if(instance.sdkInfra == "HLD") {
        if(instance.opModeHLD == "LIN_OPER_MODE_DMA") {
            modInstances.push({
                name: "edmaDriver",
                displayName: "EDMA Configuration",
                moduleName: "/drivers/edma/edma",
            });
        }
    }

    return modInstances;
}

let lin_module = {
    displayName: "LIN",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: lin_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: lin_module_name,
        },
    },
    defaultInstanceName     :   "CONFIG_LIN",
    validate                :   validate,
    maxInstances            :   getConfigArr().length,
    config                  :   getConfigurables(),
    moduleStatic            :   getModuleStaticAll(),
    moduleInstances         :   moduleInstances,
    sharedModuleInstances   :   addModuleInstances,
    getInstanceConfig,
    pinmuxRequirements,
    getInterfaceName,
    getPeripheralPinNames,
    getClockEnableIds,
    getClockFrequencies,
    onMigrate,
    filterHardware : filterHardware
};

function onMigrate(newInst, oldInst, oldSystem) {
    let pins = getPeripheralPinNames(oldInst)
    let interfaceName = getInterfaceName(oldInst)
    common.onMigrate(newInst, oldInst, oldSystem, pins, interfaceName)
}

function validate(instance, report) {
    common.validate.checkNumberRange(instance, report, "intrPriority", 0, hwi.getHwiMaxPriority(), "dec");
    if(instance.moduleModeHLD == "LIN_MODULE_OP_MODE_LIN") {
        /** LIN Mode Validation Checks */
        if((instance.baudRateHLD < 1000) || (instance.baudRateHLD > 20000)) {
            report.logError("The LIN protocol defines baud rate boundaries as: 1kHz ≤ Baud Rate ≤ 20kHz", instance, "baudRateHLD");
        }
        if((instance.baudPreScalerHLD < 0) || (instance.baudPreScalerHLD > ((2 ** 24) - 1))) {
            report.logError("Out of boundary, 24-bit Integer Prescaler", instance, "baudPreScalerHLD");
        }
        if((instance.fracDivSel_M_HLD < 0) || (instance.fracDivSel_M_HLD > 15)) {
            report.logError("Out of boundary, 4-bit Fractional Divider", instance, "fracDivSel_M_HLD");
        }
        if((instance.linTxMaskHLD < 0x00) || (instance.linTxMaskHLD > 0xFF)) {
            report.logError("Out of boundary, 8-bit Mask", instance, "linTxMaskHLD");
        }
        if((instance.linRxMaskHLD < 0x00) || (instance.linRxMaskHLD > 0xFF)) {
            report.logError("Out of boundary, 8-bit Mask", instance, "linRxMaskHLD");
        }
        if((instance.maxBaudRateHLD < 0) || (instance.maxBaudRateHLD > 20000)) {
            report.logError("Out of boundary, baud rate boundaries as: 1kHz ≤ Baud Rate ≤ 20kHz", instance, "maxBaudRateHLD");
        }

        if(instance.transferModeHLD == "LIN_TRANSFER_MODE_CALLBACK") {
            if ((instance.transferCompleteCallbackFxnHLD == "NULL") || (instance.transferCompleteCallbackFxnHLD == "")) {
                report.logError("Callback function must be provided in Callback Transfer Mode", instance, "transferCompleteCallbackFxnHLD");
            }
        }

    } else {
        /** SCI Mode Validation Checks */
        if((instance.dataBitsHLD < 1) || (instance.dataBitsHLD > 8)) {
            report.logError("Out of boundary, 1 ≤ Data Bits ≤ 8", instance, "dataBitsHLD");
        }

        if(instance.transferModeHLD == "LIN_TRANSFER_MODE_CALLBACK") {

        }
    }

    if (["am263x", "am263px", "am261x"].includes(common.getSocName()) ) {
        let clockSrc_Freq_Map = soc.getClockSrcValueMap()
        
        const interfaceName = getInterfaceName(instance)
        const linSolution = instance[interfaceName]
        let linInstanceName = ""

        if(linSolution)
            linInstanceName   = linSolution.$assign
        
        if(linInstanceName === undefined || linInstanceName === "Any"){
            linInstanceName = "LIN0"
        }


        let clockSrc = soc.getClkSource(linInstanceName)
        let clockRate = soc.getClkRate(linInstanceName)

        if(!clockSrc_Freq_Map.hasOwnProperty(clockSrc) || clockRate !== clockSrc_Freq_Map[clockSrc]){
            if(!clockSrc_Freq_Map.hasOwnProperty(clockSrc)){
                report.logWarning(`Invalid clock source ${clockSrc} selected `, instance, "inputClkFreqHLD");
            }
            else{
                report.logWarning(`Valid clock frequency for this clock source ${clockSrc} is ${clockSrc_Freq_Map[clockSrc]}`, instance, "inputClkFreqHLD");
            }
        }
    }
}

function moduleInstances(inst) {
    let modInstances = new Array();

    if(inst.sdkInfra == "HLD") {
        if(inst.opModeHLD == "LIN_OPER_MODE_DMA") {

            modInstances.push({
                name: "linRxConfigXbar",
                displayName: "LIN DMA RX Trigger Configuration",
                moduleName: '/xbar/dma_trig_xbar/dma_trig_xbar',
                requiredArgs: {
                    parentName: getInterfaceName(inst) + "_RXDMA",
                },
            });
            modInstances.push({
                name: "linTxConfigXbar",
                displayName: "LIN DMA TX Trigger Configuration",
                moduleName: '/xbar/dma_trig_xbar/dma_trig_xbar',
                requiredArgs: {
                    parentName: getInterfaceName(inst) + "_TXDMA",
                },
            });
        }
    }

    if(inst.sdkInfra == "HLD")
    {
        modInstances.push({
            name: "LIN_child",
            moduleName: '/drivers/lin/v0/lin_v0_template',
            },
        );
    } else {
        modInstances.push({
            name: "LIN_child",
            moduleName: '/drivers/lin/v0/lin_v0_template_lld',
            },
        );
    }

    return (modInstances);
}

exports = lin_module;
