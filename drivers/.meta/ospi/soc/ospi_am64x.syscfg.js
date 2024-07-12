let common = system.getScript("/common");

let ospi_input_clk_freq = 133333333;

const ospi_config_r5fss = [
    {
        name            : "OSPI0",
        baseAddr        : "CSL_FSS0_OSPI0_CTRL_BASE",
        dataBaseAddr    : "CSL_FSS0_DAT_REG1_BASE",
        inputClkFreq    : ospi_input_clk_freq,
        dacEnable       : false,
        baudRateDiv     : 4,
        intrNum         : 171,
        clockIds        : [ "TISCI_DEV_FSS0", "TISCI_DEV_FSS0_FSAS_0", "TISCI_DEV_FSS0_OSPI_0" ],
        clockFrequencies: [
            {
                moduleId: "TISCI_DEV_FSS0_OSPI_0",
                clkId   : "TISCI_DEV_FSS0_OSPI_0_OSPI_RCLK_CLK",
                clkRate : ospi_input_clk_freq,
            },
        ],
    },
];

const ospi_config_a53ss = [
    {
        name            : "OSPI0",
        baseAddr        : "CSL_FSS0_OSPI0_CTRL_BASE",
        dataBaseAddr    : "CSL_FSS0_DAT_REG1_BASE",
        inputClkFreq    : ospi_input_clk_freq,
        dacEnable       : false,
        baudRateDiv     : 4,
        intrNum         : 171,
        clockIds        : [ "TISCI_DEV_FSS0", "TISCI_DEV_FSS0_FSAS_0", "TISCI_DEV_FSS0_OSPI_0" ],
        clockFrequencies: [
            {
                moduleId: "TISCI_DEV_FSS0_OSPI_0",
                clkId   : "TISCI_DEV_FSS0_OSPI_0_OSPI_RCLK_CLK",
                clkRate : ospi_input_clk_freq,
            },
        ],
    },
];

const ospi_dma_restrict_regions = [
    { start : "CSL_R5FSS0_ATCM_BASE"    , size : "CSL_R5FSS0_ATCM_SIZE" },
    { start : "CSL_MCU_M4FSS0_IRAM_BASE", size : "CSL_MCU_M4FSS0_IRAM_SIZE" },
    { start : "CSL_MCU_M4FSS0_DRAM_BASE", size : "CSL_MCU_M4FSS0_DRAM_SIZE" },
];

function getDefaultConfig()
{
    if((common.getSelfSysCfgCoreName().match(/r5f*/)) || (common.getSelfSysCfgCoreName().match(/m4f*/)))
    {
        return ospi_config_r5fss[0];
    }
    else if(common.getSelfSysCfgCoreName().match(/a53*/))
    {
        return ospi_config_a53ss[0];
    }
}

function getConfigArr() {

    if((common.getSelfSysCfgCoreName().match(/r5f*/)) || (common.getSelfSysCfgCoreName().match(/m4f*/)))
    {
        return ospi_config_r5fss;
    }
    if(common.getSelfSysCfgCoreName().match(/a53*/))
    {
        return ospi_config_a53ss;
    }
}

function getDmaRestrictedRegions() {

    return ospi_dma_restrict_regions;
}

function getSupportedDataLines() {
    return 8;
}

function addModuleInstances(instance) {
    let modInstances = new Array();

    if(instance.dmaEnable == true) {
        modInstances.push({
            name: "udmaDriver",
            displayName: "UDMA Configuration",
            moduleName: "/drivers/udma/udma",
        });
    }

    return modInstances;
}

let ospi_module_name = "/drivers/ospi/ospi";

exports = {
    getDefaultConfig,
    getConfigArr,
    getDmaRestrictedRegions,
    getSupportedDataLines,
    addModuleInstances,
};


