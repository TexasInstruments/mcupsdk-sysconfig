
let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

//Note that clockFrequencies.clkId and clockFrequencies.clkRate are user configurable from sycfg
//and default values will get overwritten by those input

const watchdog_config = [
    {
        name: "WDT0",
        wdtInstance: "WATCHDOG_INST_ID_0",
        baseAddr: "CSL_WDT0_U_BASE",
        funcClk: getClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_WDT0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_WDT0",
                clkId   : getClkSource("WDT0"),
                clkRate : getClkRate("WDT0"),
            },
        ],
    },
    {
        name: "WDT1",
        wdtInstance: "WATCHDOG_INST_ID_1",
        baseAddr: "CSL_WDT1_U_BASE",
        funcClk: getClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_WDT1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_WDT1",
                clkId   : getClkSource("WDT1"),
                clkRate : getClkRate("WDT1"),
            },
        ],
    },
    {
        name: "WDT2",
        wdtInstance: "WATCHDOG_INST_ID_2",
        baseAddr: "CSL_WDT2_U_BASE",
        funcClk: getClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_WDT2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_WDT2",
                clkId   : getClkSource("WDT2"),
                clkRate : getClkRate("WDT2"),
            },
        ],
    },
    {
        name: "WDT3",
        wdtInstance: "WATCHDOG_INST_ID_3",
        baseAddr: "CSL_WDT3_U_BASE",
        funcClk: getClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_WDT3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_WDT3",
                clkId   : getClkSource("WDT3"),
                clkRate : getClkRate("WDT3"),
            },
        ],
    },
];

function getClkRate(instanceName =  "WDT0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let lin_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return lin_input_clk_freq;
}

function getClkSource(instanceName =  "WDT0") {

    let lin_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return lin_input_clock_source;
}


function getConfigArr() {
    let wdtInst = [];

    if(system.context == "r5fss0-0")
        wdtInst.push(watchdog_config[0]);
    if(system.context == "r5fss0-1")
        wdtInst.push(watchdog_config[1]);
    if(system.context == "r5fss1-0")
        wdtInst.push(watchdog_config[2]);
    if(system.context == "r5fss1-1")
        wdtInst.push(watchdog_config[3]);

    return wdtInst;
}

const SOC_RcmClkSrcInfo = [
    {
        name: "SOC_RcmPeripheralClockSource_XTALCLK",
        displayName: "XTALCLK  (25 MHz)",
        freq: 25000000
    },
    {
        name: "SOC_RcmPeripheralClockSource_SYS_CLK",
        freq: 200000000,
        displayName: "SYS_CLK (200 MHz)"
    },
    {
        name: "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT1",
        freq: 500000000,
        displayName: "DPLL_CORE_HSDIV0_CLKOUT1 (500 MHz)",
    },
    {
        name: "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
        freq: 192000000,
        displayName: "DPLL_PER_HSDIV0_CLKOUT1  (192 MHz)",
    },
]

exports = {
    getConfigArr,
    SOC_RcmClkSrcInfo,
    getClkRate,
    getClkSource
};

