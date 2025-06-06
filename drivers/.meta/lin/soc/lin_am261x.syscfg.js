let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const lin_config_r5fss = [
    {
        name            : "LIN0",
        baseAddr        : "CSL_LIN0_U_BASE",
        intrNum0        : 61,
        intrNum1        : 62,
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
        intrNum0        : 63,
        intrNum1        : 64,
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
        intrNum0        : 65,
        intrNum1        : 66,
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
];

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

function getConfigArr() {
    let lin_config;

    lin_config = lin_config_r5fss;

    return lin_config;
}

function getInterfaceName(instance) {
    return "LIN";
}

function getDefaultConfig() {
    return lin_config_r5fss[0];
}

function getClockValue(clkSrc) {
    let clockVal;
    if(clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0") {
        clockVal = 192000000;
    } else if (clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT2") {
        clockVal = 160000000;
    } else {
        /* Bad clk source */
    }
    return clockVal;
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
    getClkRate
};
