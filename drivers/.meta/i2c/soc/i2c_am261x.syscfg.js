
let common = system.getScript("/common");

let i2c_func_clk = 48000000;

const staticConfig_r5f = [
    {
        name: "I2C0",
        baseAddr: "CSL_I2C0_U_BASE",
        intNum: 79,
        eventId: 0,
    },
    {
        name: "I2C1",
        baseAddr: "CSL_I2C1_U_BASE",
        intNum: 80,
        eventId: 0,
    },
    {
        name: "I2C2",
        baseAddr: "CSL_I2C2_U_BASE",
        intNum: 81,
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

function getDefaultClkSource() {
    return "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0";
}

function getClockSourceOptions() {

    return [
        {name: "SOC_RcmPeripheralClockSource_XTALCLK"},
        {name: "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0"},
        {name: "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0"},
    ];
}

function getDefaultClockValue() {
    return getClockValue(getDefaultClkSource());
}

function getClockValue(clkSrc) {

    let clockVal;

    if(clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0") {
        clockVal = 48000000;
    }
    else if (clkSrc === "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0") {
        clockVal = 500000000;
    }
    else if (clkSrc === "SOC_RcmPeripheralClockSource_XTALCLK") {
        clockVal = 25*1000000;
    }
    else {
        /* Bad clk source */
    }
    return clockVal;
}

let soc = {

    getStaticConfigArr,
    getInterfaceName,
    isMakeInstanceRequired,
    isFrequencyDefined,
    getDefaultConfig,
    getClockSourceOptions,
    getClockValue,
    getDefaultClkSource,
    getDefaultClockValue,
    getClockEnableIds,
};

exports = soc;