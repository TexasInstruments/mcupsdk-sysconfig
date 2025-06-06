let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);


const mcspi_config_r5fss = [
    {
        name            : "SPI0",
        baseAddr        : "CSL_MCSPI0_U_BASE",
        inputClkFreq    : getClkRate("SPI0"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI0_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI0",
                clkId   : getClkSource("SPI0"),
                clkRate : getClkRate("SPI0"),
            },
        ],
    },
    {
        name            : "SPI1",
        baseAddr        : "CSL_MCSPI1_U_BASE",
        inputClkFreq    : getClkRate("SPI1"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI1_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI1",
                clkId   : getClkSource("SPI1"),
                clkRate : getClkRate("SPI1"),
            },
        ],
    },
    {
        name            : "SPI2",
        baseAddr        : "CSL_MCSPI2_U_BASE",
        inputClkFreq    : getClkRate("SPI2"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI2_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI2",
                clkId   : getClkSource("SPI2"),
                clkRate : getClkRate("SPI2"),
            },
        ],
    },
    {
        name            : "SPI3",
        baseAddr        : "CSL_MCSPI3_U_BASE",
        inputClkFreq    : getClkRate("SPI3"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI3_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI3",
                clkId   : getClkSource("SPI3"),
                clkRate : getClkRate("SPI3"),
            },
        ],
    },
    {
        name            : "SPI4",
        baseAddr        : "CSL_MCSPI4_U_BASE",
        inputClkFreq    : getClkRate("SPI4"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI4_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI4" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI4",
                clkId   : getClkSource("SPI4"),
                clkRate : getClkRate("SPI4"),
            },
        ],
    },
    {
        name            : "SPI5",
        baseAddr        : "CSL_MCSPI5_U_BASE",
        inputClkFreq    : getClkRate("SPI5"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI5_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI5" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI5",
                clkId   : getClkSource("SPI5"),
                clkRate : getClkRate("SPI5"),
            },
        ],
    },
    {
        name            : "SPI6",
        baseAddr        : "CSL_MCSPI6_U_BASE",
        inputClkFreq    : getClkRate("SPI6"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI6_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI6" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI6",
                clkId   : getClkSource("SPI6"),
                clkRate : getClkRate("SPI6"),
            },
        ],
    },
    {
        name            : "SPI7",
        baseAddr        : "CSL_MCSPI7_U_BASE",
        inputClkFreq    : getClkRate("SPI7"),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI7_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI7" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI7",
                clkId   : getClkSource("SPI7"),
                clkRate : getClkRate("SPI7"),
            },
        ],
    },
];

function getMaxChannels(inst) {
    return 2;   /* max number of channels per MCSPI */
}

function getConfigArr() {
    return mcspi_config_r5fss;
}

function isFrequencyDefined()
{
    return true;
}


function getClkRate(instanceName =  "SPI0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let mcspi_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return mcspi_input_clk_freq;
}

function getClkSource(instanceName =  "SPI0") {

    let mcspi_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return mcspi_input_clock_source;
}

exports = {
    getConfigArr,
    getMaxChannels,
    isFrequencyDefined,
    getClkRate,
    getClkSource,
};
