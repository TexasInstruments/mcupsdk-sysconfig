let common = system.getScript("/common");

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
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
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
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
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
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
            },
        ],
    },
];

function getDefaultClkRate() {
    let lin_input_clk_freq = 192000000;

    if(common.getDefaultR5Freq() == "500MHz")
    {
        lin_input_clk_freq = 160000000;
    }

    return lin_input_clk_freq;
}

function getDefaultClkSource() {
    let lin_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";

    if(common.getDefaultR5Freq() == "500MHz")
    {
        lin_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT2";
    }

    return lin_input_clock_source;
}

function getClkRate() {
    let lin_input_clk_freq = 192000000;

    if(common.getR5Freq() == "500MHz")
    {
        lin_input_clk_freq = 160000000;
    }

    return lin_input_clk_freq;
}

function getClkSource() {
    let lin_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";

    if(common.getR5Freq() == "500MHz")
    {
        lin_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT2";
    }

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

function getClockSourceOptions() {
    let clkSourceOptions =  [];
    clkSourceOptions.push({name: getDefaultClkSource()});
    return clkSourceOptions;
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

    let clkFreq = 200*1000000;

    if(common.getR5Freq() == "500MHz")
    {
        clkFreq = 250*1000000;
    }

    return clkFreq;
}

exports = {
    getConfigArr,
    getInterfaceName,
    getDefaultConfig,
    getClockSourceOptions,
    getDefaultClkSource,
    getClockValue,
};
