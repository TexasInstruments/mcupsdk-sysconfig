let common = system.getScript("/common");

const ospi_config_r5fss = [
    {
        name            : "OSPI0",
        baseAddr        : "CSL_FLASH_CONFIG_REG8_U_BASE",
        dataBaseAddr0    : "CSL_FLASH_DATA_REG0_U_BASE",
        dataBaseAddr1    : "CSL_FLASH_DATA_REG1_U_BASE",
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
        baseAddr        : "CSL_FSS_UL_128_FSS_OF_UL_OSPI0_OSPI_CFG_VBUSP_VBP2APB_WRAP_OSPI_CFG_VBP_OSPI_FLASH_APB_U_BASE",
        dataBaseAddr0    : "CSL_FSS_UL_128_FSS_OF_UL_DAT_REG0_U_BASE",
        dataBaseAddr1    : "CSL_FSS_UL_128_FSS_OF_UL_DAT_REG0_U_BASE",
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

const ospi_phyTuning_ddr_config =
[
    {
        phyControlMode          : "PHY_MASTER_MODE",
        dllLockMode             : "HALF_CYCLE_LOCK",
        phaseDelayElement       : 1,
        rdDelayMin              : 1,
        rdDelayMax              : 3,
        txDllLowWindowStart     : 0,
        txDllLowWindowEnd       : 48,
        txDllHighWindowStart    : 20,
        txDllHighWindowEnd      : 96,
        rxLowSearchStart        : 0,
        rxLowSearchEnd          : 40,
        rxHighSearchStart       : 10,
        rxHighSearchEnd         : 127,
        txLowSearchStart        : 0,
        txLowSearchEnd          : 64,
        txHighSearchStart       : 20,
        txHighSearchEnd         : 127,
        txDLLSearchOffset       : 8,
        rxTxDLLSearchStep       : 4,
    }
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

function getPhyTuningParams(protocol)
{
    return ospi_phyTuning_ddr_config[0];
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
    getPhyTuningParams
};


