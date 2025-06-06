
let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

//Note that clockFrequencies.clkId and clockFrequencies.clkRate are user configurable from sycfg
//and default values will get overwritten by those input

const watchdog_config = [
    {
        name: "WDT0",
        wdtInstance: "WATCHDOG_INST_ID_0",
        baseAddr: "CSL_WDT0_U_BASE",
        funcClk: getClkRate("WDT0"),
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
        funcClk: getClkRate("WDT1"),
        clockIds        : [ "SOC_RcmPeripheralId_WDT1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_WDT1",
                clkId   : getClkSource("WDT1"),
                clkRate : getClkRate("WDT1"),
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
        freq: 250000000,
        displayName: "SYS_CLK (250 MHz)"
    },
    {
        name: "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT1",
        freq: 500000000,
        displayName: "DPLL_CORE_HSDIV0_CLKOUT1 (500 MHz)",
    },
    {
        name: "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0",
        freq: 192000000,
        displayName: "DPLL_PER_HSDIV0_CLKOUT1  (240 MHz)",
    },
]

exports = {
    getConfigArr,
    SOC_RcmClkSrcInfo,
    getClkRate,
    getClkSource
};

