let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const staticConfig_r5f = [
    {
        name: "I2C0",
        baseAddr: "CSL_I2C0_U_BASE",
        intNum: 44,
        eventId: 0,
    },
    {
        name: "I2C1",
        baseAddr: "CSL_I2C1_U_BASE",
        intNum: 45,
        eventId: 0,
    },
    {
        name: "I2C2",
        baseAddr: "CSL_I2C2_U_BASE",
        intNum: 46,
        eventId: 0,
    },
    {
        name: "I2C3",
        baseAddr: "CSL_I2C3_U_BASE",
        intNum: 47,
        eventId: 0,
    },

];

function getStaticConfigArr() {

    let cpu = common.getSelfSysCfgCoreName();
    let staticConfigArr = staticConfig_r5f;

    return staticConfigArr;
}

function getDefaultConfig() {
	return staticConfig_r5f[0];
}

function getInterfaceName(inst) {

    return "I2C";
}

function isMakeInstanceRequired() {
    return false;
}

function isFrequencyDefined()
{
    return true;
}

function getClockEnableIds(inst) {

    return [ "SOC_RcmPeripheralId_I2C" ];
}

function getDefaultClkSource(instanceName = "I2C0") {
    
    let i2c_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return i2c_input_clock_source;
}

function getClockSourceOptions(instanceName = "I2C0") {


    let muxSelectionLines = helperScript.helperMuxInputs(instanceName)
    muxSelectionLines = muxSelectionLines.map((value) => ({name: "SOC_RcmPeripheralClockSource_" + value.name, displayName: value.name}))
    return muxSelectionLines
}

function getDefaultClockValue(instanceName = "I2C0") {
    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let i2c_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return i2c_input_clk_freq;
}

function getClockSrcValueMap(clkSrc) {

    let clockSrc_Freq_Map = {
        "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1": 96000000,
        "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0": 200000000,
        "SOC_RcmPeripheralClockSource_XTALCLK": 25*1000000,
        "SOC_RcmPeripheralClockSource_SYS_CLK": 200*1000000,
        "SOC_RcmPeripheralClockSource_WUCPUCLK": 25*1000000,
        "SOC_RcmPeripheralClockSource_EXT_REFCLK": 100*1000000,
        "SOC_RcmPeripheralClockSource_RCCLK10M": 10*1000000
    }

    return clockSrc_Freq_Map
}

let soc = {

    getStaticConfigArr,
    getInterfaceName,
    isMakeInstanceRequired,
    isFrequencyDefined,
    getDefaultConfig,
    getClockSourceOptions,
    getClockSrcValueMap,
    getDefaultClkSource,
    getDefaultClockValue,
    getClockEnableIds,
};

exports = soc;

