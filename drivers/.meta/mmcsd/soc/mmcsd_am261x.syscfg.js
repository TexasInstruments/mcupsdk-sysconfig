let common = system.getScript("/common");

let mmcsd_input_clk_freq = 240000000;

const mmcsd_config_r5fss = [
	{
		name              : "MMC0",
		baseAddr          : "CSL_MMC0_U_BASE",
        instNum           : 0,
        intrNum           : 83,
		inputClkFreq      : mmcsd_input_clk_freq,
        outputClk         : 400000,
        iodelayFxn        : "NULL",
        switchVoltageFxn  : "NULL",
        inputClockControl : "NULL",
		busWidth          : "MMCSD_BUS_WIDTH_8BIT",
		modes             : "MMCSD_SUPPORT_MMC_DS | MMCSD_SUPPORT_MMC_HS_SDR",
		clockIds          : [ "SOC_RcmPeripheralId_MMC0" ],
		clockFrequencies  : [
			{
				moduleId  : "SOC_RcmPeripheralId_MMC0",
				clkId     : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0",
				clkRate   : mmcsd_input_clk_freq,
			},
		],
	},
];

const operating_modes_sd = [
    { name : "DS", displayName : "DS"},
    { name : "HS", displayName : "HS"},
];

function getDefaultConfig() {
	return mmcsd_config_r5fss[0];
}

function getConfigArr() {
	return mmcsd_config_r5fss;
}

function getClockSourceOptions() {
    return [
        {name: "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1"},
        {name: "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0"},
    ];
}

function getClockValue(clkSrc) {
    let clockVal;
    if(clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1") {
        clockVal = 192000000;
    } else if (clkSrc === "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0") {
        clockVal = 200000000;
    } else {
        /* Bad clk source */
    }
    return clockVal;
}

function getDefaultOperatingModeSD() {
    return { name : "DS", displayName : "DS"};
}

function getOperatingModesSD() {
    return operating_modes_sd;
}

exports = {
	getDefaultConfig,
	getConfigArr,
	getClockSourceOptions,
    getClockValue,
    getDefaultOperatingModeSD,
    getOperatingModesSD,
};