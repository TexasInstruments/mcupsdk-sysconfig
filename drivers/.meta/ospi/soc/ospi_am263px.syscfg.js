let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const ospi_config_r5fss = [
    {
        name            : "OSPI0",
        baseAddr        : "CSL_FLASH_CONFIG_REG8_U_BASE",
        dataBaseAddr0   : "CSL_FLASH_DATA_REG0_U_BASE",
        dataBaseAddr1   : "CSL_FLASH_DATA_REG1_U_BASE",
        inputClkFreq    : getDefaultClkRate(),
        dacEnable       : false,
        baudRateDiv     : 8,
        intrNum         : 54,
        clockIds        : [ "SOC_RcmPeripheralId_OSPI0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_OSPI0",
                clkId   : getDefaultClkSource("OSPI0"),
                clkRate : getDefaultClkRate("OSPI0"),
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

function getDefaultClkSource(instanceName = "OSPI0") {

    let ospi_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return ospi_input_clock_source;
}

function getDefaultClkRate(instanceName =  "OSPI0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let ospi_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

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
    if(system.deviceData.device == "AM263Px") {
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
    getPhyTuningParams,
    getDefaultClkSource,
    getDefaultClkRate
};


