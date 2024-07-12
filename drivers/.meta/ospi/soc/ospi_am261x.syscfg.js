let common = system.getScript("/common");

const ospi_config_r5fss = [
    {
        name            : "OSPI0",
        baseAddr        : "CSL_FLASH_CONFIG_REG8_U_BASE",
        dataBaseAddr    : "CSL_FLASH_DATA_REG0_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        dacEnable       : false,
        baudRateDiv     : 4,
        intrNum         : 88,
        clockIds        : [ "SOC_RcmPeripheralId_OSPI0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_OSPI0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT3",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
    {
        name            : "OSPI1",
        baseAddr        : "CSL_FSS_UL_128_FSS_OF_UL_OSPI0_OSPI_CFG_VBUSP_OSPI_WRAP_ECC_AGG_VBP_U_BASE",
        dataBaseAddr    : "CSL_FSS_UL_128_FSS_OF_UL_DAT_REG0_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        dacEnable       : false,
        baudRateDiv     : 4,
        intrNum         : 221,
        clockIds        : [ "SOC_RcmPeripheralId_OSPI1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_OSPI1",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT3",
                clkRate : getDefaultClkRate(),
            },
        ],
    },
];

const ospi_dma_restrict_regions = [
    { start : "CSL_MSS_TCMA_RAM_BASE"   , size : "CSL_MSS_TCMA_RAM_SIZE" },
    { start : "CSL_HSM_RAM_U_BASE"      , size : "0x2fffc" }
];

function getDefaultClkRate() {
    let ospi_input_clk_freq = 166666666;

    return ospi_input_clk_freq;
}

function getDefaultConfig()
{
    return ospi_config_r5fss[0];
}

function getConfigArr() {

    return ospi_config_r5fss;
}

function getSupportedDataLines() {
    if(system.deviceData.device == "AM261x_ZCZ" || system.deviceData.device == "AM261x_ZFG") {
        return 8;
    } else {
        return 4;
    }
}

function getDmaRestrictedRegions() {

    return ospi_dma_restrict_regions;
}

function addModuleInstances(instance) {
    let modInstances = new Array();

    if(instance.dmaEnable == true) {
        modInstances.push({
            name: "edmaDriver",
            displayName: "edma Configuration",
            moduleName: "/drivers/edma/edma",
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


