let common = system.getScript("/common");

const mcspi_config_r5fss = [
    {
        name            : "SPI0",
        baseAddr        : "CSL_MCSPI0_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI0_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI0",
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name            : "SPI1",
        baseAddr        : "CSL_MCSPI1_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI1_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI1",
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name            : "SPI2",
        baseAddr        : "CSL_MCSPI2_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI2_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI2",
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name            : "SPI3",
        baseAddr        : "CSL_MCSPI3_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        intrNum         : "CSLR_R5FSS0_CORE0_INTR_MCSPI3_INTR",
        clockIds        : [ "SOC_RcmPeripheralId_MCSPI3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_MCSPI3",
                clkId   : getDefaultClkSource(),
                clkRate : getDefaultClkRate(),
            },
        ],
    },
];

function getDefaultClkRate() {
    let mcspi_input_clk_freq = 48000000;

    if(common.getDefaultR5Freq() == "500MHz")
    {
        mcspi_input_clk_freq = 50000000;
    }

    return mcspi_input_clk_freq;
}

function getDefaultClkSource() {
    let mcspi_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";

    if(common.getDefaultR5Freq() == "500MHz")
    {
        mcspi_input_clock_source = "SOC_RcmPeripheralClockSource_SYS_CLK";
    }

    return mcspi_input_clock_source;
}

function getClkRate() {
    let mcspi_input_clk_freq = 48000000;

    if(common.getR5Freq() == "500MHz")
    {
        mcspi_input_clk_freq = 50000000;
    }

    return mcspi_input_clk_freq;
}

function getClkSource() {
    let mcspi_input_clock_source = "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";

    if(common.getR5Freq() == "500MHz")
    {
        mcspi_input_clock_source = "SOC_RcmPeripheralClockSource_SYS_CLK";
    }

    return mcspi_input_clock_source;
}

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

exports = {
    getConfigArr,
    getMaxChannels,
    isFrequencyDefined,
    getClkRate,
    getClkSource,
};
