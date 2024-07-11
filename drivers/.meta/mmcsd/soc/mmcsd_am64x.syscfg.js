let common = system.getScript("/common");

let mmcsd_input_clk_freq = 200000000;

const mmcsd_config_r5fss = [
	{
		name              : "MMC0",
		ctrlBaseAddr      : "CSL_MMCSD0_CTL_CFG_BASE",
		ssBaseAddr        : "CSL_MMCSD0_SS_CFG_BASE",
		inputClkFreq      : mmcsd_input_clk_freq,
		intrNum           : 165,
		busWidth          : "MMCSD_BUS_WIDTH_8BIT",
		tuningType        : "MMCSD_PHY_TUNING_TYPE_AUTO", /* Make this configurable later */
		clockIds          : [ "TISCI_DEV_MMCSD0" ],
		clockFrequencies  : [
			{
				moduleId  : "TISCI_DEV_MMCSD0",
				clkId     : "TISCI_DEV_MMCSD0_EMMCSS_XIN_CLK",
				clkRate   : mmcsd_input_clk_freq,
			},
		],
	},
	{
		name              : "MMC1",
		ctrlBaseAddr      : "CSL_MMCSD1_CTL_CFG_BASE",
		ssBaseAddr        : "CSL_MMCSD1_SS_CFG_BASE",
		inputClkFreq      : mmcsd_input_clk_freq,
		intrNum           : 166,
		busWidth          : "MMCSD_BUS_WIDTH_4BIT",
		tuningType        : "MMCSD_PHY_TUNING_TYPE_AUTO", /* Make this configurable later */
		clockIds          : [ "TISCI_DEV_MMCSD1" ],
		clockFrequencies  : [
			{
				moduleId  : "TISCI_DEV_MMCSD1",
				clkId     : "TISCI_DEV_MMCSD1_EMMCSDSS_XIN_CLK",
				clkRate   : mmcsd_input_clk_freq,
			},
		],
	},
];

const mmcsd_config_a53ss = [
	{
		name              : "MMC0",
		ctrlBaseAddr      : "CSL_MMCSD0_CTL_CFG_BASE",
		ssBaseAddr        : "CSL_MMCSD0_SS_CFG_BASE",
		inputClkFreq      : mmcsd_input_clk_freq,
		intrNum           : 165,
		busWidth          : "MMCSD_BUS_WIDTH_8BIT",
		tuningType        : "MMCSD_PHY_TUNING_TYPE_AUTO", /* Make this configurable later */
		clockIds          : [ "TISCI_DEV_MMCSD0" ],
		clockFrequencies  : [
			{
				moduleId  : "TISCI_DEV_MMCSD0",
				clkId     : "TISCI_DEV_MMCSD0_EMMCSS_XIN_CLK",
				clkRate   : mmcsd_input_clk_freq,
			},
		],
	},
	{
		name              : "MMC1",
		ctrlBaseAddr      : "CSL_MMCSD1_CTL_CFG_BASE",
		ssBaseAddr        : "CSL_MMCSD1_SS_CFG_BASE",
		inputClkFreq      : mmcsd_input_clk_freq,
		intrNum           : 166,
		busWidth          : "MMCSD_BUS_WIDTH_4BIT",
		tuningType        : "MMCSD_PHY_TUNING_TYPE_AUTO", /* Make this configurable later */
		clockIds          : [ "TISCI_DEV_MMCSD1" ],
		clockFrequencies  : [
			{
				moduleId  : "TISCI_DEV_MMCSD1",
				clkId     : "TISCI_DEV_MMCSD1_EMMCSDSS_XIN_CLK",
				clkRate   : mmcsd_input_clk_freq,
			},
		],
	},
];

const operating_modes_sd = [
    { name : "DS", displayName : "DS"},
    { name : "HS", displayName : "HS"},
    { name : "SDR12", displayName : "SDR12"},
    { name : "SDR25", displayName : "SDR25"},
    { name : "SDR50", displayName : "SDR50"},
    { name : "DDR50", displayName : "DDR50"},
    { name : "SDR104", displayName : "SDR104"},
];

const operating_modes_sd_lld = [
    { name : "DS", displayName : "DS"},
    { name : "HS", displayName : "HS"},
    { name : "SDR12", displayName : "SDR12"},
    { name : "SDR25", displayName : "SDR25"},
    { name : "SDR50", displayName : "SDR50"},
    { name : "DDR50", displayName : "DDR50"},
    { name : "SDR104", displayName : "SDR104"},
]

const operating_modes_emmc = [
    { name : "SDR25", displayName : "SDR25"},
    { name : "SDR50", displayName : "SDR50"},
    { name : "HS200", displayName : "HS200"},
];

const operating_modes_emmc_lld = [
    { name : "SDR25", displayName : "SDR25"},
    { name : "SDR50", displayName : "SDR50"},
    { name : "HS200", displayName : "HS200"},
];

function getOperatingModesSD() {
    return operating_modes_sd;
}

function getOperatingModesSDLLD() {
    return operating_modes_sd_lld;
}

function getOperatingModesEMMC() {
    return operating_modes_emmc;
}
function getOperatingModesEMMCLLD() {
    return operating_modes_emmc_lld;
}

function getDefaultOperatingModeEMMC() {
    return { name : "HS200", displayName : "HS200"};
}

function getDefaultOperatingModeSD() {
    return { name : "HS", displayName : "HS"};
}

function getDefaultConfig() {
    if(common.getSelfSysCfgCoreName().match(/r5f*/))
    {
        return mmcsd_config_r5fss[0];
    }
    else if(common.getSelfSysCfgCoreName().match(/a53*/))
    {
        return mmcsd_config_a53ss[0];
    }
}

function getConfigArr() {
    if(common.getSelfSysCfgCoreName().match(/r5f*/))
    {
        return mmcsd_config_r5fss;
    }
    if(common.getSelfSysCfgCoreName().match(/a53*/))
    {
        return mmcsd_config_a53ss;
    }
}

exports = {
	getDefaultConfig,
	getConfigArr,
    getOperatingModesSD,
    getOperatingModesSDLLD,
    getOperatingModesEMMC,
    getOperatingModesEMMCLLD,
    getDefaultOperatingModeEMMC,
    getDefaultOperatingModeSD,
};