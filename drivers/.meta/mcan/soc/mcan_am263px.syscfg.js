let common = system.getScript("/common");
let clockTreeInfo = system.clockTree;
let helperScript = system.getScript(`/clockTree/helperScript.js`);

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
                clkId   : getDefaultClkSource("MCAN0"),
                clkRate : getDefaultClkRate("MCAN0"),
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
                clkId   : getDefaultClkSource("MCAN1"),
                clkRate : getDefaultClkRate("MCAN1"),
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
                clkId   : getDefaultClkSource("MCAN2"),
                clkRate : getDefaultClkRate("MCAN2"),
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
                clkId   : getDefaultClkSource("MCAN3"),
                clkRate : getDefaultClkRate("MCAN3"),
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
                clkId   : getDefaultClkSource("MCAN4"),
                clkRate : getDefaultClkRate("MCAN4"),
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
                clkId   : getDefaultClkSource("MCAN5"),
                clkRate : getDefaultClkRate("MCAN5"),
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
                clkId   : getDefaultClkSource("MCAN6"),
                clkRate : getDefaultClkRate("MCAN6"),
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
                clkId   : getDefaultClkSource("MCAN7"),
                clkRate : getDefaultClkRate("MCAN7"),
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

function getDefaultClkSource(interfaceName) {

    return getClkSource(interfaceName)

}

function getClkSource(interfaceName) {

    const muxSelectedIn = helperScript.helperMux(interfaceName)    
    return "SOC_RcmPeripheralClockSource_" + muxSelectedIn
}

function getDefaultClkRate(instanceName =  "MCAN0") {

    return getClkRate(instanceName);
}

function getClkRate(instanceName =  "MCAN0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let mcan_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return mcan_input_clk_freq;
}

exports = {
    getConfigArr,
    getInterfaceName,
    getDmaType,
    getClkSource,
    getClkRate
};
