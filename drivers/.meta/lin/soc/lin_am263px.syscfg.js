let common = system.getScript("/common");

let lin_func_clk = 192 * 1000 * 1000;

const lin_config_r5fss = [
    {
        name            : "LIN0",
        baseAddr        : "CSL_LIN0_U_BASE",
        intrNum0        : 16,
        intrNum1        : 17,
        clockIds        : [ "SOC_RcmPeripheralId_LIN0_UART0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN0_UART0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : lin_func_clk,
            },
        ],
    },
    {
        name            : "LIN1",
        baseAddr        : "CSL_LIN1_U_BASE",
        intrNum0        : 18,
        intrNum1        : 19,
        clockIds        : [ "SOC_RcmPeripheralId_LIN1_UART1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN1_UART1",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : lin_func_clk,
            },
        ],
    },
        {
        name            : "LIN2",
        baseAddr        : "CSL_LIN2_U_BASE",
        intrNum0        : 20,
        intrNum1        : 21,
        clockIds        : [ "SOC_RcmPeripheralId_LIN2_UART2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN2_UART2",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : lin_func_clk,
            },
        ],
    },
    {
        name            : "LIN3",
        baseAddr        : "CSL_LIN3_U_BASE",
        intrNum0        : 22,
        intrNum1        : 23,
        clockIds        : [ "SOC_RcmPeripheralId_LIN3_UART3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN3_UART3",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : lin_func_clk,
            },
        ],
    },
    {
        name            : "LIN4",
        baseAddr        : "CSL_LIN4_U_BASE",
        intrNum0        : 24,
        intrNum1        : 25,
        clockIds        : [ "SOC_RcmPeripheralId_LIN4_UART4" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN4_UART4",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : lin_func_clk,
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

function getClockValue(clkSrc) {
    let clockVal;
    if(clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1") {
        clockVal = 192000000;
    } else if (clkSrc === "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0") {
        clockVal = 200000000;
    } else {
        /* Bad clk source */
    }
    return clockVal;
}

function getConfigArr() {
    let lin_config;

    lin_config = lin_config_r5fss;

    return lin_config;
}

function getInterfaceName(instance) {
    return "LIN";
}

function getDefaultClkSource() {
    return "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1";
}

exports = {
    getConfigArr,
    getInterfaceName,
    getDefaultConfig,
    getClockSourceOptions,
    getDefaultClkSource,
    getClockValue,
};
