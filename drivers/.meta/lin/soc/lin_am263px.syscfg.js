let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const lin_config_r5fss = [
    {
        name            : "LIN0",
        baseAddr        : "CSL_LIN0_U_BASE",
        intrNum0        : 16,
        intrNum1        : 17,
        clockIds        : [ "SOC_RcmPeripheralId_LIN0_UART0" ],
        sysClk          : getSysClkFrequency(),
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN0_UART0",
                clkId   : getClkSource("LIN0"),
                clkRate : getClkRate("LIN0"),
            },
        ],
    },
    {
        name            : "LIN1",
        baseAddr        : "CSL_LIN1_U_BASE",
        intrNum0        : 18,
        intrNum1        : 19,
        clockIds        : [ "SOC_RcmPeripheralId_LIN1_UART1" ],
        sysClk          : getSysClkFrequency(),
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN1_UART1",
                clkId   : getClkSource("LIN1"),
                clkRate : getClkRate("LIN1")
            },
        ],
    },
        {
        name            : "LIN2",
        baseAddr        : "CSL_LIN2_U_BASE",
        intrNum0        : 20,
        intrNum1        : 21,
        clockIds        : [ "SOC_RcmPeripheralId_LIN2_UART2" ],
        sysClk          : getSysClkFrequency(),
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN2_UART2",
                clkId   : getClkSource("LIN2"),
                clkRate : getClkRate("LIN2")
            },
        ],
    },
    {
        name            : "LIN3",
        baseAddr        : "CSL_LIN3_U_BASE",
        intrNum0        : 22,
        intrNum1        : 23,
        clockIds        : [ "SOC_RcmPeripheralId_LIN3_UART3" ],
        sysClk          : getSysClkFrequency(),
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN3_UART3",
                clkId   : getClkSource("LIN3"),
                clkRate : getClkRate("LIN3")
            },
        ],
    },
    {
        name            : "LIN4",
        baseAddr        : "CSL_LIN4_U_BASE",
        intrNum0        : 24,
        intrNum1        : 25,
        clockIds        : [ "SOC_RcmPeripheralId_LIN4_UART4" ],
        sysClk          : getSysClkFrequency(),
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN4_UART4",
                clkId   : getClkSource("LIN4"),
                clkRate : getClkRate("LIN4")
            },
        ],
    },
];

function getDefaultConfig() {
	return lin_config_r5fss[0];
}

function getClockSourceOptions() {
    return [
        {name: "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1"},
        {name: "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0"},
    ];
}

function getClockSrcValueMap(clkSrc) {

    let clockSrc_Freq_Map = {
        "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1": 192000000,
        "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0": 200000000,
    }

    return clockSrc_Freq_Map
}

function getConfigArr() {
    let lin_config;

    lin_config = lin_config_r5fss;

    return lin_config;
}

function getInterfaceName(instance) {
    return "LIN";
}

function getClkRate(instanceName =  "LIN0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let lin_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return lin_input_clk_freq;
}

function getClkSource(instanceName =  "LIN0") {
 
    instanceName = instanceName.replace("LIN", "UART"); // LIN and UART share the same mux
    let lin_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return lin_input_clock_source;
}

/* This is subject to change, therefore update might be required */
function getSysClkFrequency(){

    return helperScript.helperGetFrequencyNamedConnection("SYSCLK");
}

exports = {
    getConfigArr,
    getInterfaceName,
    getDefaultConfig,
    getClkSource,
    getSysClkFrequency,
    getClkRate,
    getClockSrcValueMap
};
