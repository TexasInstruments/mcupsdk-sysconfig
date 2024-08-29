let common = system.getScript("/common");


let mcspi_input_clk_freq = 50000000;

const mcspi_config_r5fss = [
    {
        name            : "SPI0",
        baseAddr        : "CSL_MCSPI0_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 168,
        clockIds        : [ "TISCI_DEV_MCSPI0" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI0_CH3_RX",
            },
        ],
    },
    {
        name            : "SPI1",
        baseAddr        : "CSL_MCSPI1_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 169,
        clockIds        : [ "TISCI_DEV_MCSPI1" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI1_CH3_RX",
            },
        ],
    },
    {
        name            : "SPI2",
        baseAddr        : "CSL_MCSPI2_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 170,
        clockIds        : [ "TISCI_DEV_MCSPI2" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI2_CH3_RX",
            },
        ],
    },
    {
        name            : "SPI3",
        baseAddr        : "CSL_MCSPI3_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 171,
        clockIds        : [ "TISCI_DEV_MCSPI3" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MAIN0_MCSPI3_CH3_RX",
            },
        ],
    },
    {
        name            : "MCU_SPI0",
        baseAddr        : "CSL_MCU_MCSPI0_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 20,
        clockIds        : [ "TISCI_DEV_MCU_MCSPI0" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI0_CH3_RX",
            },
        ],

    },
    {
        name            : "MCU_SPI1",
        baseAddr        : "CSL_MCU_MCSPI1_CFG_BASE",
        inputClkFreq    : mcspi_input_clk_freq,
        intrNum         : 21,
        clockIds        : [ "TISCI_DEV_MCU_MCSPI1" ],
        udmaPdmaChannels: [
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH0_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH0_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH1_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH1_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH2_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH2_RX",
            },
            {
                txCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH3_TX",
                rxCh    : "UDMA_PDMA_CH_MCU_MCSPI1_CH3_RX",
            },
        ],

    },

];

function getMaxChannels(inst) {
    return 5;   /* max number of channels per MCSPI */
}

function getConfigArr() {
    let mcspi_config;

    mcspi_config = mcspi_config_r5fss;

    return mcspi_config;
}

function isFrequencyDefined()
{
    return false;
}

exports = {
    getConfigArr,
    getMaxChannels,
    isFrequencyDefined,
};
