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
];

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
    getClkSource,
    getClkRate,
    getInterfaceName,
};
