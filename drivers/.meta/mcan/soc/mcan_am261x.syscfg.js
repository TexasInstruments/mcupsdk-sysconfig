let common = system.getScript("/common");

let mcan_func_clk = 80 * 1000 * 1000;

const mcan_config_r5fss = [
    {
        name            : "MCAN0",
        baseAddr        : "CSL_MCAN0_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN0_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN0_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN0",
                clkId   : getDefaultClkSource(),
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN1",
        baseAddr        : "CSL_MCAN1_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN1_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN1_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN1",
                clkId   : getDefaultClkSource(),
                clkRate : mcan_func_clk,
            },
        ],
    },
];

function getDefaultClkSource() {
    let mcan_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0";

    if(common.getR5Freq() == "500MHz")
    {
        mcan_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";
    }

    return mcan_input_clock_source;
}

function getConfigArr() {
    let mcan_config;

    mcan_config = mcan_config_r5fss;

    return mcan_config;
}

function getInterfaceName(instance) {
    return "MCAN";
}

exports = {
    getConfigArr,
    getInterfaceName,
};
