let common = system.getScript("/common");

const lin_config_r5fss = [
    {
        name            : "LIN0",
        baseAddr        : "CSL_LIN0_U_BASE",
        intrNum         : 61,
        clockIds        : [ "SOC_RcmPeripheralId_LIN0_UART0" ],
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
        intrNum         : 63,
        clockIds        : [ "SOC_RcmPeripheralId_LIN1_UART1" ],
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
        intrNum         : 65,
        clockIds        : [ "SOC_RcmPeripheralId_LIN2_UART2" ],
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

    if(common.getR5Freq() == "500MHz")
    {
        lin_input_clk_freq = 160000000;
    }

    return lin_input_clk_freq;
}

function getDefaultClkSource() {
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

exports = {
    getConfigArr,
    getInterfaceName,
};
