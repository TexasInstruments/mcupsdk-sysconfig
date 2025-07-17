let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const mmcsd_config_r5fss = [
	{
		name              : "MMC",
		baseAddr          : "CSL_MMC0_U_BASE",
        instNum           : 0,
        intrNum           : 83,
		inputClkFreq      : getDefaultClkRate(),
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
                clkId     : getDefaultClkSource("MMC0"),
				clkRate   : getDefaultClkRate(),
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

function getDefaultClkSource(instanceName = "MMC0") {

    let mmcsd_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return mmcsd_input_clock_source;

}

function getDefaultClkRate(instanceName =  "MMC0") {
    
    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let mmcsd_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return mmcsd_input_clk_freq;
}

function getClockSrcValueMap(clkSrc) {

    let clockSrc_Freq_Map = {
        "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1": 192000000,
        "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0": 200000000,
    }

    return clockSrc_Freq_Map
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
    getClockSrcValueMap,
    getDefaultOperatingModeSD,
    getOperatingModesSD,
    getDefaultClkSource,
    getDefaultClkRate
};