let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");

let mcasp_input_clk_freq = 48000000;

const mcasp_config = [
    {
        name                : "RCSS_MCASPA",
        regBaseAddr         : "CSL_RCSS_MCASP_A_U_BASE",
        dataRegBaseAddr     : "CSL_RCSS_MCASPA_DATA_U_BASE",
        numSerializers      : 16,
        inputClkFreq        : mcasp_input_clk_freq,
        intr0Num            : 52,
        intr1Num            : 55,
        edmaChTx            : 48,
        edmaChRx            : 51,
        clockIds        : [ "SOC_RcmPeripheralId_RCSS_MCASPA_AUX" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_RCSS_MCASPA_AUX",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : mcasp_input_clk_freq,
            },
        ],
    },
    {
        name                : "RCSS_MCASPB",
        regBaseAddr         : "CSL_RCSS_MCASP_B_U_BASE",
        dataRegBaseAddr     : "CSL_RCSS_MCASPB_DATA_U_BASE",
        numSerializers      : 6,
        inputClkFreq        : mcasp_input_clk_freq,
        intr0Num            : 53,
        intr1Num            : 56,
        edmaChTx            : 49,
        edmaChRx            : 52,
        clockIds        : [ "SOC_RcmPeripheralId_RCSS_MCASPB_AUX" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_RCSS_MCASPB_AUX",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : mcasp_input_clk_freq,
            },
        ],
    },
    {
        name                : "RCSS_MCASPC",
        regBaseAddr         : "CSL_RCSS_MCASP_C_U_BASE",
        dataRegBaseAddr     : "CSL_RCSS_MCASPC_DATA_U_BASE",
        numSerializers      : 6,
        inputClkFreq        : mcasp_input_clk_freq,
        intr0Num            : 54,
        intr1Num            : 57,
        edmaChTx            : 50,
        edmaChRx            : 53,
        clockIds        : [ "SOC_RcmPeripheralId_RCSS_MCASPC_AUX" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_RCSS_MCASPC_AUX",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : mcasp_input_clk_freq,
            },
        ],
    },
];

let mcasp_ext_rxhclk_src = [
    { name: 0, displayName: "WUCPUCLK"},
    { name: 1, displayName: "WUCPUCLK"},
    { name: 2, displayName: "DPLL_PER_HSDIV0_CLKOUT0"},
    { name: 3, displayName: "DPLL_PER_HSDIV0_CLKOUT1"},
    { name: 4, displayName: "DPLL_PER_HSDIV0_CLKOUT2"},
    { name: 5, displayName: "RCCLK10M"},
    { name: 6, displayName: "XREF_CLK0"},
    { name: 7, displayName: "XREF_CLK1"},
    { name: 16, displayName: "Invalid Clock"},
];

let mcasp_ext_txhclk_src = [
    { name: 0, displayName: "WUCPUCLK"},
    { name: 1, displayName: "WUCPUCLK"},
    { name: 2, displayName: "DPLL_PER_HSDIV0_CLKOUT0"},
    { name: 3, displayName: "DPLL_PER_HSDIV0_CLKOUT1"},
    { name: 4, displayName: "DPLL_PER_HSDIV0_CLKOUT2"},
    { name: 5, displayName: "RCCLK10M"},
    { name: 6, displayName: "XREF_CLK0"},
    { name: 7, displayName: "XREF_CLK1"},
    { name: 16, displayName: "Invalid Clock"},
];

let mcasp_aux_clk_src = [
    { name: 0, displayName: "WUCPUCLK"},
    { name: 1, displayName: "WUCPUCLK"},
    { name: 2, displayName: "DPLL_PER_HSDIV0_CLKOUT0"},
    { name: 3, displayName: "DPLL_PER_HSDIV0_CLKOUT1"},
    { name: 4, displayName: "DPLL_PER_HSDIV0_CLKOUT2"},
    { name: 5, displayName: "RCCLK10M"},
    { name: 6, displayName: "XREF_CLK0"},
    { name: 7, displayName: "XREF_CLK1"},
    { name: 16, displayName: "Invalid Clock"},
];

let mcasp_ext_hclk_src_list = [
    "REFCLK", "CLKOUT", "CLK", "CLK0", "CLK1"
];

function getConfigArr() {
    return mcasp_config;
}

function getExtClkPins() {
    return mcasp_ext_hclk_src_list;
}

function getExtRxHclkSrc() {
    return mcasp_ext_rxhclk_src;
}

function getExtTxHclkSrc() {
    return mcasp_ext_txhclk_src;
}

function getAuxClkSrc() {
    return mcasp_aux_clk_src;
}

function getPinmuxReq(txHclkSourceMux, rxHclkSourceMux)
{
    let systemResources = [];
    let pinResource = {}

    if(txHclkSourceMux == 0 || rxHclkSourceMux == 0)
    {
        pinResource = pinmux.getPinRequirements("FE1_REFCLK", "REFCLK", "Wakeup cpu clk 1");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 1 || rxHclkSourceMux == 1)
    {
        pinResource = pinmux.getPinRequirements("FE2_REFCLK", "REFCLK", "Wakeup cpu clk 2");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 2 || rxHclkSourceMux == 2)
    {
        pinResource = pinmux.getPinRequirements("MCU_CLKOUT", "CLKOUT", "DPLL_PER_HSDIV0_CLKOUT1");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 3 || rxHclkSourceMux == 3)
    {
        pinResource = pinmux.getPinRequirements("OBS_CLKOUT", "CLKOUT", "DPLL_PER_HSDIV0_CLKOUT2");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 4 || rxHclkSourceMux == 4)
    {
        pinResource = pinmux.getPinRequirements("PMIC_CLKOUT", "CLKOUT", "DPLL_PER_HSDIV0_CLKOUT3");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 5 || rxHclkSourceMux == 5)
    {
        pinResource = pinmux.getPinRequirements("RCOSC_CLK", "CLK", "RCCLK10M");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 6 || rxHclkSourceMux == 6)
    {
        pinResource = pinmux.getPinRequirements("XREF_CLK0", "CLK0", "External ref clk 0");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }
    if(txHclkSourceMux == 7 || rxHclkSourceMux == 7)
    {
        pinResource = pinmux.getPinRequirements("XREF_CLK1", "CLK1", "External ref clk 1");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        systemResources.push(pinResource);
    }

    return systemResources;
}

function getSystemPinmux(systemResources, txHclkSourceMux, rxHclkSourceMux)
{
    let systemPinmux = {
        name: "AUX_CLK_SRC",
        displayName: "AUX Clock Source",
        interfaceName: "XREF_CLK1",
        resources: systemResources
    };

    if(txHclkSourceMux == 0 || rxHclkSourceMux == 0)
    {
        systemPinmux.interfaceName = "FE1_REFCLK";
    }
    if(txHclkSourceMux == 1 || rxHclkSourceMux == 1)
    {
        systemPinmux.interfaceName = "FE2_REFCLK";
    }
    if(txHclkSourceMux == 2 || rxHclkSourceMux == 2)
    {
        systemPinmux.interfaceName = "MCU_CLKOUT";
    }
    if(txHclkSourceMux == 3 || rxHclkSourceMux == 3)
    {
        systemPinmux.interfaceName = "OBS_CLKOUT";
    }
    if(txHclkSourceMux == 4 || rxHclkSourceMux == 4)
    {
        systemPinmux.interfaceName = "PMIC_CLKOUT";
    }
    if(txHclkSourceMux == 5 || rxHclkSourceMux == 5)
    {
        systemPinmux.interfaceName = "RCOSC_CLK";
    }
    if(txHclkSourceMux == 6 || rxHclkSourceMux == 6)
    {
        systemPinmux.interfaceName = "XREF_CLK0";
    }
    if(txHclkSourceMux == 7 || rxHclkSourceMux == 7)
    {
        systemPinmux.interfaceName = "XREF_CLK1";
    }

    return systemPinmux;
}

exports = {
    getConfigArr,
    mcasp_input_clk_freq,
    getExtRxHclkSrc,
    getExtTxHclkSrc,
    getExtClkPins,
    getAuxClkSrc,
    getPinmuxReq,
    getSystemPinmux,
};