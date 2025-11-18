let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/mcasp/soc/mcasp_${common.getSocName()}`);

const EXTERNAL_CLOCK = 0;
const INTERNAL_CLOCK = 1;

function getConfigArr() {
    return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === solution.peripheralName);

     return {
        ...config,
        ...moduleInstance,
     };
};

function pinmuxRequirements(inst) {

    let interfaceName = getInterfaceName(inst);
    let resources = [];
    let systemResources = [];
    if (inst.enableMcaspTx == true) {
        resources.push( pinmux.getPinRequirements(interfaceName, "FSX", "Frame Sync Transmit Pin") );
        resources.push( pinmux.getPinRequirements(interfaceName, "ACLKX", "Audio Clock Transmit Pin") );
        resources.push( pinmux.getPinRequirements(interfaceName, "AHCLKX", "Audio High Clock Transmit Pin") );
    }
    if (inst.enableMcaspRx == true) {
        resources.push( pinmux.getPinRequirements(interfaceName, "FSR", "Frame Sync Receive Pin") );
        resources.push( pinmux.getPinRequirements(interfaceName, "ACLKR", "Audio Clock Receive") );

    }

    let mcasp = {
        name: interfaceName,
        displayName: "MCASP Instance",
        interfaceName: interfaceName,
        resources: resources,
    };

    if (inst.txHclkSource == EXTERNAL_CLOCK || inst.rxHclkSource  == EXTERNAL_CLOCK)
    {
        systemResources = soc.getPinmuxReq(inst.txHclkSourceMux, inst.rxHclkSourceMux);
        let systemPinmux = soc.getSystemPinmux(systemResources, inst.txHclkSourceMux, inst.rxHclkSourceMux);
        return [mcasp, systemPinmux];
    }

    return [mcasp];
}

function getInterfaceName(inst) {

    return "RCSS_MCASP";
}

function getPeripheralPinNames(inst) {

    let pins = [ "REFCLK", "ACLKR", "FSX", "ACLKX", "AHCLKX", "DAT0", "DAT1", "DAT2", "DAT3", "DAT4", "DAT5", "DAT6", "DAT7", "DAT8", "DAT9", "DAT10", "DAT11", "DAT12", "DAT13", "DAT14", "DAT15" ];
    let extPins = soc.getExtClkPins();

    pins = pins.concat(extPins);

    return pins;
}

function getClockEnableIds(instance) {
    let instConfig = getInstanceConfig(instance);
    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}

function getNumSerializers(inst) {

    let instConfig = getInstanceConfig(inst);
    return instConfig.numSerializers;
}

let mcasp_module_name = "/drivers/mcasp/mcasp";
let mcasp_module = {
    displayName: "MCASP",

    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/mcasp/templates/mcasp_config.c.xdt",
            driver_init: "/drivers/mcasp/templates/mcasp_init.c.xdt",
            driver_deinit: "/drivers/mcasp/templates/mcasp_deinit.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/mcasp/templates/mcasp.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/mcasp/templates/mcasp_open_close_config.c.xdt",
            driver_open: "/drivers/mcasp/templates/mcasp_open.c.xdt",
            driver_close: "/drivers/mcasp/templates/mcasp_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/mcasp/templates/mcasp_open_close.h.xdt",
        },
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: mcasp_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: mcasp_module_name,
        },
    },
    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_MCASP",
    config: [
        {
            name: "transferMode",
            displayName: "Mode of Transfer",
            default: "DMA",
            options: [
                { name: "INTERRUPT", displayName: "Interrupt" },
                { name: "DMA", displayName: "DMA" },
            ],
            description: "Mode of transfer as polled/Interrupt CPU or DMA",
        },
        {
            name: "enableLoopback",
            displayName: "Enable McASP Loopback",
            default: true,
            description: `Enable McASP Loopback`,
            onChange: function (inst, ui) {
                if(inst.enableLoopback == true) {
                    inst.enableMcaspRx = true;
                    ui.enableMcaspRx.readOnly = true;
                    inst.enableMcaspTx = true;
                    ui.enableMcaspTx.readOnly = true;
                    inst.clkSyncMode = "SYNC";
                    ui.clkSyncMode.readOnly = true;
                }
                else {
                    ui.clkSyncMode.readOnly = false;
                    ui.enableMcaspTx.readOnly = false;
                    ui.enableMcaspRx.readOnly = false;
                }
            }
        },
        {
            name: "clkSyncMode",
            displayName: "Clock Synchronization Mode",
            default: "SYNC",
            readOnly: true,
            options: [
                { name: "SYNC", displayName: "Tx and Rx clock in Sync mode" },
                { name: "ASYNC", displayName: "Tx and Rx clocks are separate" },
            ],
            onChange: function (inst, ui) {
                if(inst.clkSyncMode == "SYNC") {
                    inst.afsr = inst.afsx;
                    inst.rxFsSource = inst.txFsSource;
                    inst.rxAclkSource = inst.txAclkSource;
                    inst.rxHclkSource = inst.txHclkSource;
                    ui.afsr.readOnly = true;
                    ui.rxFsSource.readOnly = true;
                    ui.rxAclkSource.readOnly = true;
                    ui.controllerClkr.readOnly = true;
                    ui.rxHclkSource.readOnly = true;
                }
                else {
                    ui.afsr.readOnly = false;
                    ui.rxFsSource.readOnly = false;
                    ui.rxAclkSource.readOnly = false;
                    ui.controllerClkr.readOnly = false;
                    ui.rxHclkSource.readOnly = false;
                }
            }
        },
        {
            name: "xmtConfig",
            displayName: "MCASP Transmit Configuration",
            collapsed: true,
            config: [
                {
                    name: "enableMcaspTx",
                    displayName: "Enable McASP Transmission",
                    default: true,
                    readOnly: true,
                    description: "Enable McASP Transmission",
                    onChange: function (inst, ui) {
                        if(inst.enableMcaspTx == true) {
                            ui.TxMode.hidden = false;
                            ui.NumTxSlots.hidden = false;
                            ui.txDataDelay.hidden = false;
                            ui.txDataOrder.hidden = false;
                            ui.txDataRotation.hidden = false;
                            ui.txFsWidth.hidden = false;
                            ui.txFsPolarity.hidden = false;
                            ui.txBitClkPolarity.hidden = false;
                            ui.txBufferFormat.hidden = false;
                            ui.TxSlotSize.hidden = false;
                            ui.txDataMask.hidden = false;
                            ui.txActiveSlotMask.hidden = false;
                            ui.txFsSource.hidden = false;
                            ui.txAclkSource.hidden = false;
                            ui.txHclkSource.hidden = false;
                            ui.afsx.hidden = false;
                            ui.txCallbackFxn.hidden = false;
                            ui.txAfifoEnable.hidden = false;
                            ui.txAfifoNumEvt.hidden = false;
                            ui.txLoopjobEnable.hidden = false;
                            ui.txLoopjobBuf.hidden = false;
                            ui.txLoopjobBufLength.hidden = false;
                        }
                        else {
                            ui.TxMode.hidden = true;
                            ui.NumTxSlots.hidden = true;
                            ui.txDataDelay.hidden = true;
                            ui.txDataOrder.hidden = true;
                            ui.txDataRotation.hidden =true;
                            ui.txFsWidth.hidden = true;
                            ui.txFsPolarity.hidden = true;
                            ui.txBitClkPolarity.hidden = true;
                            ui.txBufferFormat.hidden =true;
                            ui.TxSlotSize.hidden = true;
                            ui.txDataMask.hidden = true;
                            ui.txActiveSlotMask.hidden = true;
                            ui.txFsSource.hidden = true;
                            ui.txAclkSource.hidden = true;
                            ui.txHclkSource.hidden = true;
                            ui.afsx.hidden = true;
                            ui.txCallbackFxn.hidden = true;
                            ui.txAfifoEnable.hidden = true;
                            ui.txAfifoNumEvt.hidden = true;
                            ui.txLoopjobEnable.hidden = true;
                            ui.txLoopjobBuf.hidden = true;
                            ui.txLoopjobBufLength.hidden = true;
                        }
                    },
                },
                {
                    name: "TxMode",
                    displayName: "Mode of Transmission",
                    default: "I2S",
                    options: [
                        { name: "I2S", displayName: "I2S"},
                        { name: "TDM", displayName: "TDM"},
                    ],
                    description: "Configure Mcasp transmission to either run in I2S or TDM mode",
                    onChange: function (inst, ui) {
                        if(inst.TxMode == "I2S") {
                            inst.NumTxSlots = 2;
                            ui.NumTxSlots.readOnly = true;
                            inst.txDataDelay = 1;
                            ui.txDataDelay.readOnly = true;
                            inst.txDataOrder = 1;
                            ui.txDataOrder.readOnly = true;
                            ui.txDataRotation.readOnly = true;
                            inst.txFsWidth = 1;
                            ui.txFsWidth.readOnly = true;
                            inst.txFsPolarity = 1;
                            ui.txFsPolarity.readOnly = true;
                            inst.txBitClkPolarity = 1;
                            ui.txBitClkPolarity.readOnly = true;
                        }
                        else {
                            ui.NumTxSlots.readOnly = false;
                            ui.txDataDelay.readOnly = false;
                            ui.txDataOrder.readOnly = false;
                            ui.txDataRotation.readOnly = false;
                            ui.txFsWidth.readOnly = false;
                            ui.txFsPolarity.readOnly = false;
                            ui.txBitClkPolarity.readOnly = false;
                        }
                    },
                },
                {
                    name: "NumTxSlots",
                    displayName: "Transmit Slot Count",
                    default: 2,
                    readOnly: true,
                    displayFormat: "dec",
                    description: "Configure number of slots in TDM mode",
                },
                {
                    name: "txDataDelay",
                    displayName: "Transmit Frame Sync Bit Delay",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "0-bit delay between FS and Data"},
                        { name: 1, displayName: "1-bit delay between FS and Data"},
                        { name: 2, displayName: "2-bit delay between FS and Data"},
                    ],
                    description: "Number of bits delay between Frame Sync and Data",
                },
                {
                    name: "txDataOrder",
                    displayName: "Transmit Serial Bitstream Order",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "LSB First"},
                        { name: 1, displayName: "MSB First"},
                    ],
                    description: "Configure McASP to send MSB first or LSB first",
                },
                {
                    name: "txDataRotation",
                    displayName: "Transmit Right-rotation Value",
                    default: 0,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "No rotation"},
                        { name: 1, displayName: "Rotate Right by 4 bits"},
                        { name: 2, displayName: "Rotate Right by 8 bits"},
                        { name: 3, displayName: "Rotate Right by 12 bits"},
                        { name: 4, displayName: "Rotate Right by 16 bits"},
                        { name: 5, displayName: "Rotate Right by 20 bits"},
                        { name: 6, displayName: "Rotate Right by 24 bits"},
                        { name: 7, displayName: "Rotate Right by 28 bits"},
                    ],
                },
                {
                    name: "txFsWidth",
                    displayName: "Transmit Frame Sync Width",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Single Bit"},
                        { name: 1, displayName: "Single Word"},
                    ],
                },
                {
                    name: "txFsPolarity",
                    displayName: "Transmit Frame Sync Polarity",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Rising Edge Indicates Frame Start"},
                        { name: 1, displayName: "Falling Edge Indicates Frame Start"},
                    ],
                    description: "Configure new frame to start form rising edge or falling edge of frame sync signal",
                },
                {
                    name: "txBitClkPolarity",
                    displayName: "Transmit Bit Clock Polarity",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Data shift out in rising edge"},
                        { name: 1, displayName: "Data shift out in falling edge"},
                    ],
                    description: "Configure bit clock to shift out data in rising or falling edge",
                },
                {
                    name: "txBufferFormat",
                    displayName: "Transmit Audio Buffer Format",
                    default: "1SER_MULTISLOT_INTERLEAVED",
                    readOnly: true,
                    options: [
                        { name: "1SER_MULTISLOT_INTERLEAVED", displayName: "1-Serializer Multi-Slot Interleaved" },
                        { name: "1SER_MULTISLOT_NON_INTERLEAVED", displayName: "1-Serializer Multi-Slot NonInterleaved" },
                        { name: "MULTISER_MULTISLOT_SEMI_INTERLEAVED_1", displayName: "Multi-Serializer Multi-Slot Interleaved Type1" },
                        { name: "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2", displayName: "Multi-Serializer Multi-Slot Interleaved Type2" },
                    ],
                    description: "Audio buffer format used by the application transmit buffer",
                },
                {
                    name: "txAfifoEnable",
                    displayName: "Transmit Audio FIFO Enable",
                    default: true,
                    description: "Transmit AFIFO Enable",
                    onChange: function (inst, ui) {
                        if(inst.txAfifoEnable == 1) {
                            ui.txAfifoNumEvt.hidden = false;
                        }
                        else {
                            ui.txAfifoNumEvt.hidden = true;
                        }
                    },
                },
                {
                    name: "txAfifoNumEvt",
                    displayName: "Transmit Audio FIFO Event Word Count",
                    default: 32,
                    displayFormat: "dec",
                    description: "Word count to generate TX even to host",
                },
                {
                    name: "TxSlotSize",
                    displayName: "Transmit Slot Size In Bits",
                    default: 32,
                    displayFormat: "dec",
                    options: [
                        { name: 8, displayName: "8"},
                        { name: 12, displayName: "12"},
                        { name: 16, displayName: "16"},
                        { name: 20, displayName: "20"},
                        { name: 24, displayName: "24"},
                        { name: 28, displayName: "28"},
                        { name: 32, displayName: "32"},
                    ],
                    description: "Number of bits in a slot",
                },
                {
                    name: "txDataMask",
                    displayName: "Transmit Data Bitmask",
                    default: 0,
                    displayFormat: "hex",
                    description: "Configure on which bits of the slot to send out data",
                },
                {
                    name: "txActiveSlotMask",
                    displayName: "Transmit Active Slot Bitmask",
                    default: 0,
                    displayFormat: "hex",
                    description: "Configure which slots of the frame are active (contains audio data)",
                },
                {
                    name: "txCallbackFxn",
                    displayName: "Transmit Callback Function",
                    default: "NULL",
                    description: "Transmit Callback Function",
                },
                {
                    name: "txLoopjobEnable",
                    displayName: "Transmit Loopjob Enable",
                    default: true,
                    readOnly: true,
                    description: "Transmit Loopjob Enable",
                },
                {
                    name: "txLoopjobBuf",
                    displayName: "Transmit Loopjob Buffer",
                    default: "gTxLoopjobBuf0",
                    description: "Transmit Loopjob Buffer",
                },
                {
                    name: "txLoopjobBufLength",
                    displayName: "Transmit Loopjob Buffer Length",
                    default: 256,
                    displayFormat: "dec",
                    description: "Transmit Loopjob Buffer Length in Bytes",
                    longDescription:
`Note: Loopjob length must be same as the transactions submitted by the application.`,
                },
                {
                    name: "xmtClockConfig",
                    displayName: "MCASP Transmit Clock Configuration",
                    collapsed: true,
                    config: [
                        {
                            name: "afsx",
                            displayName: "Transmit Frame Sync Rate",
                            default: 48,
                            displayFormat: "dec",
                            options: [
                                { name: 48, displayName: "48 KHz"},
                                { name: 96, displayName: "96 KHz"},
                                { name: 0,  displayName: "Custom"},
                            ],
                            description: "McASP Transmit Frame Sync frequency",
                            onChange: function (inst, ui) {
                                if(inst.afsx == 0) {
                                    ui.fsx.hidden = false;
                                }
                                else {
                                    ui.fsx.hidden = true;
                                    inst.fsx = inst.afsx;
                                    inst.afsr = inst.afsx;
                                }
                            },
                        },
                        {
                            name: "fsx",
                            displayName: "Custom Frame Sync Rate (KHz)",
                            default: 10,
                            hidden: true,
                            displayFormat: "dec",
                        },
                        {
                            name: "txFsSource",
                            displayName: "Transmit Frame Sync Source",
                            default: INTERNAL_CLOCK,
                            options: [
                                { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                            ],
                            description: "Transmit Frame Sync Source",
                            onChange: function (inst, ui) {
                                if(inst.clkSyncMode == "SYNC") {
                                    inst.rxFsSource = inst.txFsSource;
                                }
                                OnChangeHideTxParameters(inst, ui);
                            },
                        },
                        {
                            name: "txAclkSource",
                            displayName: "Transmit Bit Clock Source",
                            default: INTERNAL_CLOCK,
                            options: [
                                { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                            ],
                            description: "Transmit Bit Clock Source",
                            onChange: function (inst, ui) {
                                if(inst.clkSyncMode == "SYNC") {
                                    inst.rxAclkSource = inst.txAclkSource;
                                }
                                OnChangeHideTxParameters(inst, ui);
                            },
                        },
                        {
                            name: "controllerClkx",
                            displayName: "Transmit Master Clock Rate",
                            default: 512,
                            displayFormat: "dec",
                            options: [
                                { name: 128, displayName: "128 times Fs"},
                                { name: 256, displayName: "256 times Fs"},
                                { name: 512, displayName: "512 times Fs"},
                                { name: 1024, displayName: "1024 times Fs"},
                                { name: 0   , displayName: "Any"},
                            ],
                            description: "Transmit Master Clock Rate | Deprecated configurable",
                            longDescription: "This configurable is deprecated in the current version,\
                                            but maintained as a hiiden configurable for leagacy reason.",
                            hidden: true,
                        },
                        {
                            name: "txHclkSource",
                            displayName: "Transmit High Clock Source",
                            default: INTERNAL_CLOCK,
                            options: [
                                { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                            ],
                            description: "Transmit High Clock Source",
                            onChange: function (inst, ui) {
                                if(inst.txHclkSource == EXTERNAL_CLOCK) {
                                    ui.txHclkSourceMux.hidden = false;
                                    inst.txHclkSourceMux = 16;
                                }
                                else {
                                    ui.txHclkSourceMux.hidden = true;
                                }
                                OnChangeHideTxParameters(inst, ui);
                            }
                        },
                        {
                            name: "txHclkSourceMux",
                            displayName: "Trasmit High Clock Parent",
                            default: 16,
                            hidden: true,
                            options: soc.getExtTxHclkSrc(),
                            onChange: function (inst, ui) {
                                OnChangeHideTxParameters(inst, ui);
                            }
                        },
                        {
                            name: "txHclkDiv",
                            displayName: "TX HCLK Divider",
                            longDescription: `![](../source/sysconfig/drivers/.meta/mcasp/v0/mcasp_hclkdiv.png)`,
                            default: 3,
                        },
                        {
                            name: "txClkDiv",
                            displayName: "TX CLK Divider",
                            longDescription: `![](../source/sysconfig/drivers/.meta/mcasp/v0/mcasp_aclkdiv.png)`,
                            default: 8,
                        },
                    ]
                },
            {
                name: "auxClkSource",
                displayName: "AUX Clock Source",
                default: 2,
                options: soc.getAuxClkSrc(),
                onChange: function (inst, ui) {
                    OnChangeHideTxParameters(inst, ui);
            }
        },
            ],
        },
        {
            name: "rcvConfig",
            displayName: "MCASP Receive Configuration",
            collapsed: true,
            config: [
                {
                    name: "enableMcaspRx",
                    displayName: "Enable McASP Reception",
                    default: true,
                    readOnly: true,
                    description: `Enable McASP Reception`,
                    onChange: function (inst, ui) {
                        if(inst.enableMcaspRx == true){
                            ui.RxMode.hidden = false;
                            ui.NumRxSlots.hidden = false;
                            ui.rxDataDelay.hidden = false;
                            ui.rxDataOrder.hidden = false;
                            ui.rxDataRotation.hidden = false;
                            ui.rxFsWidth.hidden = false;
                            ui.rxFsPolarity.hidden = false;
                            ui.rxBitClkPolarity.hidden = false;
                            ui.rxBufferFormat.hidden = false;
                            ui.RxSlotSize.hidden = false;
                            ui.rxDataMask.hidden = false;
                            ui.rxActiveSlotMask.hidden = false;
                            ui.rxFsSource.hidden = false;
                            ui.rxAclkSource.hidden = false;
                            ui.rxHclkSource.hidden = false;
                            ui.afsr.hidden = false;
                            ui.controllerClkr.hidden = false;
                            ui.rxCallbackFxn.hidden = false;
                            ui.rxAfifoEnable.hidden = false;
                            ui.rxAfifoNumEvt.hidden = false;
                            ui.rxLoopjobEnable.hidden = false;
                            ui.rxLoopjobBuf.hidden = false;
                            ui.rxLoopjobBufLength.hidden = false;
                        }
                        else {
                            ui.RxMode.hidden = true;
                            ui.NumRxSlots.hidden = true;
                            ui.rxDataDelay.hidden = true;
                            ui.rxDataOrder.hidden = true;
                            ui.rxDataRotation.hidden = true;
                            ui.rxFsWidth.hidden = true;
                            ui.rxFsPolarity.hidden = true;
                            ui.rxBitClkPolarity.hidden = true;
                            ui.rxBufferFormat.hidden = true;
                            ui.RxSlotSize.hidden = true;
                            ui.rxDataMask.hidden = true;
                            ui.rxActiveSlotMask.hidden = true;
                            ui.rxFsSource.hidden = true;
                            ui.rxAclkSource.hidden = true;
                            ui.rxHclkSource.hidden = true;
                            ui.afsr.hidden = true;
                            ui.controllerClkr.hidden = true;
                            ui.rxCallbackFxn.hidden = true;
                            ui.rxAfifoEnable.hidden = true;
                            ui.rxAfifoNumEvt.hidden = true;
                            ui.rxLoopjobEnable.hidden = true;
                            ui.rxLoopjobBuf.hidden = true;
                            ui.rxLoopjobBufLength.hidden = true;
                        }
                    },
                },
                {
                    name: "RxMode",
                    displayName: "Mode of Reception",
                    default: "I2S",
                    options: [
                        { name: "I2S", displayName: "I2S"},
                        { name: "TDM", displayName: "TDM"},
                    ],
                    description: "Configure Mcasp reception to either run in I2S or TDM mode",
                    onChange: function (inst, ui) {
                        if(inst.RxMode == "I2S") {
                            inst.NumRxSlots = 2;
                            ui.NumRxSlots.readOnly = true;
                            inst.rxDataDelay = 1;
                            ui.rxDataDelay.readOnly = true;
                            inst.rxDataOrder = 1;
                            ui.rxDataOrder.readOnly = true;
                            inst.rxFsWidth = 1;
                            ui.rxFsWidth.readOnly = true;
                            inst.rxFsPolarity = 1;
                            ui.rxFsPolarity.readOnly = true;
                            inst.rxBitClkPolarity = 1;
                            ui.rxBitClkPolarity.readOnly = true;
                        }
                        else {
                            ui.NumRxSlots.readOnly = false;
                            ui.rxDataDelay.readOnly = false;
                            ui.rxDataOrder.readOnly = false;
                            ui.rxDataRotation.readOnly = false;
                            ui.rxFsWidth.readOnly = false;
                            ui.rxFsPolarity.readOnly = false;
                            ui.rxBitClkPolarity.readOnly = false;
                        }
                    },
                },
                {
                    name: "NumRxSlots",
                    displayName: "Receive Slot Count",
                    default: 2,
                    readOnly: true,
                    displayFormat: "dec",
                    description: "Configure number of slots in TDM mode",
                },
                {
                    name: "rxDataDelay",
                    displayName: "Receive Frame Sync Bit Delay",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "0-bit delay between FS and Data"},
                        { name: 1, displayName: "1-bit delay between FS and Data"},
                        { name: 2, displayName: "2-bit delay between FS and Data"},
                    ],
                    description: "Number of bits delay between Frame Sync and Data",
                },
                {
                    name: "rxDataOrder",
                    displayName: "Receive Serial Bitstream Order",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "LSB First"},
                        { name: 1, displayName: "MSB First"},
                    ],
                    description: "Configure McASP to send MSB first or LSB first",
                },
                {
                    name: "rxPaddingMode",
                    displayName: "Receive Slot Extra Bits Padding",
                    default: 0,
                    hidden: false,
                    options: [
                        { name: 0, displayName: "Pad extra bits with 0"},
                        { name: 1, displayName: "Pad extra bits with 1"},
                        { name: 2, displayName: "Pad extra bits with existing bit"},
                    ],
                    description: "Configure McASP to pad extra bits not belonging to the word defined by Data Bitmask",
                    onChange: function (inst, ui) {
                        if(inst.rxPaddingMode == 2) {
                            ui.rxPaddingBit.hidden = false;
                        }
                        else {
                            ui.rxPaddingBit.hidden = true;
                        }
                    },
                },
                {
                    name: "rxPaddingBit",
                    displayName: "Receive Slot Bit Used For Padding",
                    default: 1,
                    hidden: true,
                    displayFormat: "dec",
                    description: "Configure McASP to use the bit position in the slot to be used for padding",
                },
                {
                    name: "rxDataRotation",
                    displayName: "Receive Right-rotation Value",
                    default: 0,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "No rotation"},
                        { name: 1, displayName: "Rotate Right by 4 bits"},
                        { name: 2, displayName: "Rotate Right by 8 bits"},
                        { name: 3, displayName: "Rotate Right by 12 bits"},
                        { name: 4, displayName: "Rotate Right by 16 bits"},
                        { name: 5, displayName: "Rotate Right by 20 bits"},
                        { name: 6, displayName: "Rotate Right by 24 bits"},
                        { name: 7, displayName: "Rotate Right by 28 bits"},
                    ],
                },
                {
                    name: "rxFsWidth",
                    displayName: "Receive Frame Sync Width",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Single Bit"},
                        { name: 1, displayName: "Single Word"},
                    ],
                },
                {
                    name: "rxFsPolarity",
                    displayName: "Receive Frame Sync Polarity",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Rising Edge Indicates Frame Start"},
                        { name: 1, displayName: "Falling Edge Indicates Frame Start"},
                    ],
                    description: "Configure new frame to start form rising edge or falling edge of frame sync signal",
                },
                {
                    name: "rxBitClkPolarity",
                    displayName: "Receive Bit Clock Polarity",
                    default: 1,
                    readOnly: true,
                    options: [
                        { name: 0, displayName: "Data sampled in falling edge"},
                        { name: 1, displayName: "Data sampled in rising edge"},
                    ],
                    description: "Configure data to be sampled in rising or falling edge",
                },
                {
                    name: "rxBufferFormat",
                    displayName: "Receive Audio Buffer Format",
                    default: "1SER_MULTISLOT_INTERLEAVED",
                    readOnly: true,
                    options: [
                        { name: "1SER_MULTISLOT_INTERLEAVED", displayName: "1-Serializer Multi-Slot Interleaved" },
                        { name: "1SER_MULTISLOT_NON_INTERLEAVED", displayName: "1-Serializer Multi-Slot NonInterleaved" },
                        { name: "MULTISER_MULTISLOT_SEMI_INTERLEAVED_1", displayName: "Multi-Serializer Multi-Slot Interleaved Type1" },
                        { name: "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2", displayName: "Multi-Serializer Multi-Slot Interleaved Type2" },
                    ],
                    description: "Audio buffer format used by the application receive buffer",
                },
                {
                    name: "rxAfifoEnable",
                    displayName: "Receive Audio FIFO Enable",
                    default: true,
                    description: "Receive AFIFO Enable",
                    onChange: function (inst, ui) {
                        if(inst.rxAfifoEnable == 1) {
                            ui.rxAfifoNumEvt.hidden = false;
                        }
                        else {
                            ui.rxAfifoNumEvt.hidden = true;
                        }
                    },
                },
                {
                    name: "rxAfifoNumEvt",
                    displayName: "Receive Audio FIFO Event Word Count",
                    default: 32,
                    displayFormat: "dec",
                    description: "Word count to generate RX even to host",
                },
                {
                    name: "RxSlotSize",
                    displayName: "Receive Slot Size In Bits",
                    default: 32,
                    displayFormat: "dec",
                    options: [
                        { name: 8, displayName: "8"},
                        { name: 12, displayName: "12"},
                        { name: 16, displayName: "16"},
                        { name: 20, displayName: "20"},
                        { name: 24, displayName: "24"},
                        { name: 28, displayName: "28"},
                        { name: 32, displayName: "32"},
                    ],
                    description: "Number of bits in a slot",
                },
                {
                    name: "rxDataMask",
                    displayName: "Receive Data Bitmask",
                    default: 0,
                    displayFormat: "hex",
                    description: "Configure on which bits of the slot to receive data",
                },
                {
                    name: "rxActiveSlotMask",
                    displayName: "Receive Active Slot Bitmask",
                    default: 0,
                    displayFormat: "hex",
                    description: "Configure which slots of the frame are active (contains audio data)",
                },
                {
                    name: "rxCallbackFxn",
                    displayName: "Receive Callback Function",
                    default: "NULL",
                    description: "Receive Callback Function",
                },
                {
                    name: "rxLoopjobEnable",
                    displayName: "Receive Loopjob Enable",
                    default: true,
                    readOnly: true,
                    description: "Receive Loopjob Enable",
                },
                {
                    name: "rxLoopjobBuf",
                    displayName: "Receive Loopjob Buffer",
                    default: "gRxLoopjobBuf0",
                    description: "Receive Loopjob Buffer",
                },
                {
                    name: "rxLoopjobBufLength",
                    displayName: "Receive Loopjob Buffer Length",
                    default: 256,
                    displayFormat: "dec",
                    description: "Receive Loopjob Buffer Length in Bytes",
                    longDescription: `Note: Loopjob length must be same as the transactions submitted by the application.`,
                },
                {
                    name: "rcvClockConfig",
                        displayName: "MCASP Receive Clock Configuration",
                        collapsed: true,
                        config: [
                            {
                                name: "afsr",
                                displayName: "Receive Frame Sync Rate",
                                default: 48,
                                displayFormat: "dec",
                                options: [
                                    { name: 48, displayName: "48 KHz"},
                                    { name: 96, displayName: "96 KHz"},
                                    { name: 0,  displayName: "Custom"},
                                ],
                                description: "McASP Receive Frame Sync frequency",
                                onChange: function (inst, ui) {
                                    if(inst.afsr == 0) {
                                        ui.fsr.hidden = false;
                                    }
                                    else {
                                        ui.fsr.hidden = true;
                                        inst.fsr = inst.afsr;
                                    }
                                },
                            },
                            {
                                name: "fsr",
                                displayName: "Custom Frame Sync Rate (KHz)",
                                default: 10,
                                hidden: true,
                                displayFormat: "dec",
                            },
                            {
                                name: "rxFsSource",
                                displayName: "Receive Frame Sync Source",
                                default: INTERNAL_CLOCK,
                                options: [
                                    { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                    { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                                ],
                                description: "Receive Frame Sync Source",
                                onChange: function (inst, ui) {
                                   OnChangeHideRxParameters(inst, ui);
                                }
                            },
                            {
                                name: "rxAclkSource",
                                displayName: "Receive Bit Clock Source",
                                default: INTERNAL_CLOCK,
                                options: [
                                    { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                    { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                                ],
                                description: "Receive Bit Clock Source",
                                onChange: function (inst, ui) {
                                   OnChangeHideRxParameters(inst, ui);
                                }
                            },
                            {
                                name: "controllerClkr",
                                displayName: "Receive Master Clock Rate",
                                default: 512,
                                displayFormat: "dec",
                                options: [
                                    { name: 128, displayName: "128 times Fs"},
                                    { name: 256, displayName: "256 times Fs"},
                                    { name: 512, displayName: "512 times Fs"},
                                    { name: 1024, displayName: "1024 times Fs"},
                                    { name: 0   , displayName: "Any"},
                                ],
                                description: "Receive Master Clock Rate | Deprecated configurable",
                                longDescription: "This configurable is deprecated in the current version,\
                                            but maintained as a hiiden configurable for leagacy reason.",
                                hidden: true,
                            },
                            {
                                name: "rxHclkSource",
                                displayName: "Receive High Clock Source",
                                default: INTERNAL_CLOCK,
                                options: [
                                    { name: EXTERNAL_CLOCK, displayName: "Externally Generated"},
                                    { name: INTERNAL_CLOCK, displayName: "Internally Generated"},
                                ],
                                description: "Receive High Clock Source",
                                onChange: function (inst, ui) {
                                    if(inst.rxHclkSource == EXTERNAL_CLOCK) {
                                        ui.rxHclkSourceMux.hidden = false;
                                        inst.rxHclkSourceMux = 16;
                                    }
                                    else {
                                        ui.rxHclkSourceMux.hidden = true;
                                    }
                                    OnChangeHideRxParameters(inst, ui);
                                },
                            },
                            {
                                name: "rxHclkSourceMux",
                                displayName: "Receive High Clock Parent",
                                default: 16,
                                hidden: true,
                                options: soc.getExtRxHclkSrc(),
                                onChange: function (inst, ui) {
                                    OnChangeHideRxParameters(inst, ui);
                                }
                            },
                            {
                                name: "rxHclkDiv",
                                displayName: "RX HCLK Divider",
                                longDescription: `![](../source/sysconfig/drivers/.meta/mcasp/v0/mcasp_hclkdiv.png)`,
                                default: 2,
                            },
                            {
                                name: "rxClkDiv",
                                displayName: "RX CLK Divider",
                                longDescription: `![](../source/sysconfig/drivers/.meta/mcasp/v0/mcasp_aclkdiv.png)`,
                                default: 8,
                            },
                    ]
                },
            ],
        },
    ],
    validate: validate,
    validatePinmux: validatePinmux,
    sharedModuleInstances: addModuleInstances,
    moduleInstances: moduleInstances,
    getInstanceConfig,
    getClockEnableIds,
    getClockFrequencies,
    getNumSerializers,
    pinmuxRequirements,
    getInterfaceName,
    getPeripheralPinNames,
};

function addModuleInstances(inst) {
    let modInstances = new Array();

        modInstances.push({
            name: "edmaConfig",
            displayName: "EDMA",
            moduleName: "/drivers/edma/edma",
            requiredArgs: {
                instance: "EDMA_RCSS_A",
            },
        });

    return modInstances;
}

function OnChangeHideTxParameters(inst, ui) {
    /* If txFsSource and txAclkSource are external, txHclkSource and auxClkSource should be hidden.
     *
     * If txFsSource and txAclkSource are internal, txHclkSource is optional (INTERNAL/EXTERNAL). 
     * If Internal, txHclkDiv should be configuable. 
     * If External, txHclkDiv should be hidden.
     */
    if((inst.txFsSource == EXTERNAL_CLOCK) && (inst.txAclkSource == EXTERNAL_CLOCK)) {
        ui.txHclkSource.hidden = true;
        ui.txHclkDiv.hidden = true;
        ui.auxClkSource.hidden = true;
    }
    else if((inst.txFsSource == INTERNAL_CLOCK) && (inst.txAclkSource == INTERNAL_CLOCK)) {
        if(inst.txHclkSource == INTERNAL_CLOCK) {
            ui.txHclkDiv.hidden = false;
            ui.txHclkSourceMux.hidden = true;
        }
        else {
            ui.txHclkDiv.hidden = true;
            ui.txHclkSourceMux.hidden = false;
        }    
    }
    else {
        ui.txHclkSource.hidden = false;
        ui.auxClkSource.hidden = false;
    }
}

function OnChangeHideRxParameters(inst, ui) {
    /* If txFsSource and txAclkSource are external, txHclkSource and auxClkSource should be hidden
     * 
     * If txFsSource and txAclkSource are internal, txHclkSource is optional (INTERNAL/EXTERNAL). 
     * If Internal, rxHclkDiv should be configuable. 
     * If External, txHclkDiv should be hidden.
     */
    if((inst.rxFsSource == EXTERNAL_CLOCK) && (inst.rxAclkSource == EXTERNAL_CLOCK)) 
    {
        ui.rxHclkSource.hidden = true;
        ui.rxHclkDiv.hidden = true;
        ui.auxClkSource.hidden = true;
    }
    else if((inst.rxFsSource == INTERNAL_CLOCK) && (inst.rxAclkSource == INTERNAL_CLOCK)) 
    {
        if(inst.rxHclkSource == INTERNAL_CLOCK) {
            ui.rxHclkDiv.hidden = false;
            ui.rxHclkSourceMux.hidden = true;
        }
        else {
            ui.rxHclkDiv.hidden = true;
            ui.rxHclkSourceMux.hidden = false;
        }
    }
    else
    {
        ui.rxHclkSource.hidden = false;
        ui.auxClkSource.hidden = false;
    }
}

/*
 *  ======== validate ========
 */
function validate(inst, report) {
    if(inst.clkSyncMode == "SYNC") {
        if ((inst.NumTxSlots * inst.TxSlotSize) != (inst.NumRxSlots * inst.RxSlotSize)) {
            report.logError(`The total number of bits per frame must be the same in SYNC mode (XSSZ*XMOD = RSSZ*RMOD)`, inst,  "clkSyncMode");
        }
        if (inst.rxFsSource != inst.txFsSource) {
            report.logError(` TX and RX Frame Sync Source must match in SYNC mode`, inst,  "rxFsSource");
        }
        if (inst.rxFsWidth != inst.txFsWidth) {
            report.logError(` TX and RX Frame Sync width must match in SYNC mode`, inst,  "rxFsWidth");
        }
    }

    if(inst.txHclkSource == EXTERNAL_CLOCK && inst.rxHclkSource == EXTERNAL_CLOCK && inst.txHclkSourceMux != inst.rxHclkSourceMux)
    {
        report.logError(`Choose same valid external clock source for Tx & Rx`, inst, "txHclkSourceMux");
        report.logError(`Choose same valid external clock source for Tx & Rx`, inst, "rxHclkSourceMux")
    }

    if (inst.txHclkSource == EXTERNAL_CLOCK && inst.txHclkSourceMux == 16)
    {
        report.logError(`Choose a valid external clock source`, inst, "txHclkSourceMux")
    }

    if (((inst.txHclkSource == INTERNAL_CLOCK) && (inst.auxClkSource == 16) && ((inst.txFsSource == INTERNAL_CLOCK)) && (inst.txAclkSource == INTERNAL_CLOCK)) || 
        ((inst.rxHclkSource == INTERNAL_CLOCK) && (inst.auxClkSource == 16) && ((inst.rxFsSource == INTERNAL_CLOCK)) && (inst.rxAclkSource == INTERNAL_CLOCK)))
    {
        report.logError(`Choose a valid Aux clock source`, inst, "auxClkSource");
    }

    if (inst.rxHclkSource == EXTERNAL_CLOCK && inst.rxHclkSourceMux == 16)
    {
        report.logError(`Choose a valid external clock source`, inst, "rxHclkSourceMux")
    }

    common.validate.checkNumberRange(inst, report, "NumTxSlots", 2, 32, "dec");
    common.validate.checkNumberRange(inst, report, "NumRxSlots", 2, 32, "dec");
    common.validate.checkNumberRange(inst, report, "txActiveSlotMask", 0, (1 << inst.NumTxSlots)-1, "dec");
    common.validate.checkNumberRange(inst, report, "rxActiveSlotMask", 0, (1 << inst.NumRxSlots)-1, "dec");
    common.validate.checkNumberRange(inst, report, "txAfifoNumEvt", 0, 64, "dec");
    common.validate.checkNumberRange(inst, report, "rxAfifoNumEvt", 0, 64, "dec");
    common.validate.checkNumberRange(inst, report, "txHclkDiv", 1, 4096, "dec");
    common.validate.checkNumberRange(inst, report, "rxHclkDiv", 1, 4096, "dec");
    common.validate.checkNumberRange(inst, report, "txClkDiv", 1, 32, "dec");
    common.validate.checkNumberRange(inst, report, "rxClkDiv", 1, 32, "dec");

    common.validate.checkValidCName(inst, report, "txCallbackFxn");
    common.validate.checkValidCName(inst, report, "rxCallbackFxn");

    if((inst.enableMcaspTx == true) &&
        ((inst.txCallbackFxn == "NULL") ||
            (inst.txCallbackFxn == ""))) {
        report.logError("Callback function MUST be provided", inst, "txCallbackFxn");
    }

    if((inst.enableMcaspRx == true) &&
        ((inst.rxCallbackFxn == "NULL") ||
            (inst.rxCallbackFxn == ""))) {
        report.logError("Callback function MUST be provided", inst, "rxCallbackFxn");
    }

    if((inst.enableMcaspTx == true) && (inst.txLoopjobEnable == true)) {
        common.validate.checkValidCName(inst, report, "txLoopjobBuf");
        if (inst.txLoopjobBuf == "NULL") {
            report.logError("tx loopjob buffer must be provided", inst, "txLoopjobBuf");
        }
    }
    if((inst.enableMcaspRx == true) && (inst.rxLoopjobEnable == true)) {
        common.validate.checkValidCName(inst, report, "rxLoopjobBuf");
        if (inst.rxLoopjobBuf == "NULL") {
            report.logError("rx loopjob buffer must be provided", inst, "rxLoopjobBuf");
        }
    }

    let resArray = [];
    let numSer = 16;

    for (let index = 0; index <= numSer; index++) {
        resArray[index] = false;
    }

    let numTxSer = 0, numRxSer = 0;
    for (let i= 0; i < inst.mcaspSer.length; i++) {
        if(inst.mcaspSer[i].dataDir == "Transmit") {
            numTxSer++;
        } else {
            numRxSer++;
        }
    }
    if (numTxSer > 1) {
       if (inst.txBufferFormat != "MULTISER_MULTISLOT_SEMI_INTERLEAVED_1" && inst.txBufferFormat != "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2"){
           report.logError(`Incorrect buffer format`, inst, "txBufferFormat");
       }
    } else if (numTxSer == 1) {
       if (inst.txBufferFormat != "1SER_MULTISLOT_INTERLEAVED" && inst.txBufferFormat != "1SER_MULTISLOT_NON_INTERLEAVED"){
           report.logError(`Incorrect buffer format`, inst, "txBufferFormat");
       }
    }
    if (numRxSer > 1) {
       if (inst.rxBufferFormat != "MULTISER_MULTISLOT_SEMI_INTERLEAVED_1" && inst.rxBufferFormat != "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2"){
           report.logError(`Incorrect buffer format`, inst, "rxBufferFormat");
       }
    } else if (numRxSer == 1) {
       if (inst.rxBufferFormat != "1SER_MULTISLOT_INTERLEAVED" && inst.rxBufferFormat != "1SER_MULTISLOT_NON_INTERLEAVED"){
           report.logError(`Incorrect buffer format`, inst, "rxBufferFormat");
       }
    }

    if (inst.txBufferFormat == "1SER_MULTISLOT_NON_INTERLEAVED") {
        if (inst.txAfifoNumEvt != inst.NumTxSlots){
            report.logError(`Set Tx FIFO word count to ${inst.NumTxSlots} i.e. Slot count`, inst, "txAfifoNumEvt");
        }
    }
    else if (inst.txBufferFormat == "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2") {
        if (inst.txAfifoNumEvt != numTxSer){
            report.logError(`Set Tx FIFO word count to ${numTxSer} i.e. Serializer count`, inst, "txAfifoNumEvt");
        }
    }
    if (inst.rxBufferFormat == "1SER_MULTISLOT_NON_INTERLEAVED") {
        if (inst.rxAfifoNumEvt != inst.NumRxSlots){
            report.logError(`Set Rx FIFO word count to ${inst.NumRxSlots} i.e. Slot count`, inst, "rxAfifoNumEvt");
        }
    }
    else if (inst.rxBufferFormat == "MULTISER_MULTISLOT_SEMI_INTERLEAVED_2") {
        if (inst.rxAfifoNumEvt != numRxSer){
            report.logError(`Set Rx FIFO word count to ${numRxSer} i.e. Serializer count`, inst, "rxAfifoNumEvt");
        }
    }

    let serInstances = inst["mcaspSer"];

    for (let index = 0; index <= serInstances.length; index++) {
        let serInst = serInstances[index];
        if (serInst != null) {
            if (resArray[serInst.serNum] == false) {
                resArray[index] = true;
            } else {
                report.logError(`serializer number overlaps`, inst, "mcaspSer");
            }
        }
    }
}

/*
 *  ======== validatePinmux ========
 */
function validatePinmux(inst, report) {
    let instConfig = getInstanceConfig(inst);
    if (inst.transferMode == "DMA") {
        /* Validate if the dma channels required for mcasp are allocated and reserved. */
        let edmaTxCh = instConfig.edmaChTx;
        let edmaRxCh = instConfig.edmaChRx;
        let edmaTxChAlloc = false, edmaTxChRes = false;
        let edmaRxChAlloc = false, edmaRxChRes = false;
        for(let i =0; i < inst.edmaConfig.edmaRmDmaCh.length; i++) {
            if ((inst.edmaConfig.edmaRmDmaCh[i].startIndex <= edmaTxCh) &&
                (inst.edmaConfig.edmaRmDmaCh[i].endIndex >= edmaTxCh)) {
                edmaTxChAlloc = true;
            }
            if ((inst.edmaConfig.edmaRmDmaCh[i].startIndex <= edmaRxCh) &&
            (inst.edmaConfig.edmaRmDmaCh[i].endIndex >= edmaRxCh)) {
                edmaRxChAlloc = true;
            }
        }
        if (edmaTxChAlloc == false) {
            report.logError(`Allocate dma channel no: ${edmaTxCh} in "Own Dma Channel Resource Manager" in "EDMA" Configuration`, inst, "transferMode");
        }
        if (edmaRxChAlloc == false) {
            report.logError(`Allocate dma channel no: ${edmaRxCh} in "Own Dma Channel Resource Manager" in "EDMA" Configuration`, inst, "transferMode");
        }
        for(let i =0; i < inst.edmaConfig.edmaRmReservedDmaCh.length; i++) {
            if ((inst.edmaConfig.edmaRmReservedDmaCh[i].startIndex <= edmaTxCh) &&
                (inst.edmaConfig.edmaRmReservedDmaCh[i].endIndex >= edmaTxCh)) {
                edmaTxChRes = true;
            }
            if ((inst.edmaConfig.edmaRmReservedDmaCh[i].startIndex <= edmaRxCh) &&
            (inst.edmaConfig.edmaRmReservedDmaCh[i].endIndex >= edmaRxCh)) {
                edmaRxChRes = true;
            }
        }
        if (edmaTxChRes == false) {
            report.logInfo(`Allocate dma channel no: ${edmaTxCh} in "Reserved Dma Channel Resource Manager" in "EDMA" Configuration for event triggered transfers`, inst, "transferMode");
        }
        if (edmaRxChRes == false) {
            report.logInfo(`Allocate dma channel no: ${edmaRxCh} in "Reserved Dma Channel Resource Manager" in "EDMA" Configuration for event triggered transfers`, inst, "transferMode");
        }
    }
}

function moduleInstances(inst) {

    let serInstances = new Array();

    serInstances.push({
        name: "mcaspSer",
        displayName: "MCASP Serializer Configuration",
        moduleName: '/drivers/mcasp/v0/mcasp_v0_ser',
        useArray: true,
        minInstanceCount: 0,
        args: {
            interfaceName: getInterfaceName(inst),
            enableLoopback: inst.enableLoopback,
        },
    });

    return (serInstances);
}

exports = mcasp_module;
