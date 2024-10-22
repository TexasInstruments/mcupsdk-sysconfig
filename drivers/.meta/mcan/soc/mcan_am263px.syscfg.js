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
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
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
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
        {
        name            : "MCAN2",
        baseAddr        : "CSL_MCAN2_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN2_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN2_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN2",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN3",
        baseAddr        : "CSL_MCAN3_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN3_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN3_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN3",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN4",
        baseAddr        : "CSL_MCAN4_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN4_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN4_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN4" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN4",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN5",
        baseAddr        : "CSL_MCAN5_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN5_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN5_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN5" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN5",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN6",
        baseAddr        : "CSL_MCAN6_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN6_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN6_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN6" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN6",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
    {
        name            : "MCAN7",
        baseAddr        : "CSL_MCAN7_MSG_RAM_U_BASE",
        intrNum0        : "CSLR_R5FSS0_CORE0_INTR_MCAN7_MCAN_LVL_INT_0",
        intrNum1        : "CSLR_R5FSS0_CORE0_INTR_MCAN7_MCAN_LVL_INT_1",
        clockIds        : [ "SOC_RcmPeripheralId_MCAN7" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCAN7",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : mcan_func_clk,
            },
        ],
    },
];

function getConfigArr() {
    let mcan_config;

    mcan_config = mcan_config_r5fss;

    return mcan_config;
}

function getInterfaceName(instance) {
    return "MCAN";
}

function getDmaType() {
    return "EDMA";
}

function getClkSource() {
    return "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0";
}

exports = {
    getConfigArr,
    getInterfaceName,
    getDmaType,
    getClkSource,
};
