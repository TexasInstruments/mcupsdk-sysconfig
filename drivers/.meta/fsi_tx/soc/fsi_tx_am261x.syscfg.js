
let common = system.getScript("/common");

const staticConfig = [
    {
        name: "FSITX0",
        baseAddr: "CSL_CONTROLSS_FSI_TX0_U_BASE",
        funcClk: getDefaultClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_CONTROLSS_PLL" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_CONTROLSS_PLL",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT2",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name: "FSITX1",
        baseAddr: "CSL_CONTROLSS_FSI_TX1_U_BASE",
        funcClk: getDefaultClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_CONTROLSS_PLL" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_CONTROLSS_PLL",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT2",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name: "FSITX2",
        baseAddr: "CSL_CONTROLSS_FSI_TX2_U_BASE",
        funcClk: getDefaultClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_CONTROLSS_PLL" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_CONTROLSS_PLL",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT2",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name: "FSITX3",
        baseAddr: "CSL_CONTROLSS_FSI_TX3_U_BASE",
        funcClk: getDefaultClkRate(),
        clockIds        : [ "SOC_RcmPeripheralId_CONTROLSS_PLL" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_CONTROLSS_PLL",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT2",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
];

function getDefaultClkRate() {
    let fsi_tx_func_clk = 400 * 1000 * 1000;

    if(common.getR5Freq() == "500MHz")
    {
        fsi_tx_func_clk = 500 * 1000 * 1000;
    }

    return fsi_tx_func_clk;
}

function getStaticConfigArr() {
    return staticConfig;
}

function getInterfaceName(inst) {
    return "FSITX";
}

let soc = {
    getStaticConfigArr,
    getInterfaceName,
    getDefaultClkRate,
    interruptXbarConfig: true,
};

exports = soc;
