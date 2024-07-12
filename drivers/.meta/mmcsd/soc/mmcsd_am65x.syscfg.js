let common = system.getScript("/common");

let mmcsd_input_clk_freq = 200000000;

const mmcsd_config_r5fss = [

    {
            name              : "MMC0",
            ctrlBaseAddr      : "CSL_MMC0_CTL_CFG_BASE",
            ssBaseAddr        : "CSL_MMC0_SS_CFG_BASE",
            inputClkFreq      : mmcsd_input_clk_freq,
            intrNum           : 28,
            busWidth          : "MMCSD_BUS_WIDTH_8BIT",
            tuningType        : "MMCSD_PHY_TUNING_TYPE_MANUAL", /* Make this configurable later */
            clockIds          : [ "TISCI_DEV_MMCSD0" ],
            clockFrequencies  : [
                    {
                            moduleId  : "TISCI_DEV_MMCSD0",
                            clkId     : "TISCI_DEV_MMCSD0_BUS_EMMCSDSS_XIN_CLK",
                            clkRate   : mmcsd_input_clk_freq,
                    },
            ],
	},
    {
            name              : "MMC1",
            ctrlBaseAddr      : "CSL_MMC1_CTL_CFG_BASE",
            ssBaseAddr        : "CSL_MMC1_SS_CFG_BASE",
            inputClkFreq      : mmcsd_input_clk_freq,
            intrNum           : 29,
            busWidth          : "MMCSD_BUS_WIDTH_4BIT",
            tuningType        : "MMCSD_PHY_TUNING_TYPE_AUTO", /* Make this configurable later */
            clockIds          : [ "TISCI_DEV_MMCSD1" ],
            clockFrequencies  : [
                    {
                            moduleId  : "TISCI_DEV_MMCSD1",
                            clkId     : "TISCI_DEV_MMCSD1_BUS_EMMCSDSS_XIN_CLK",
                            clkRate   : mmcsd_input_clk_freq,
                    },
            ],
    },
];

const operating_modes_sd = [
    { name : "HS", displayName : "HS"},
];

const operating_modes_emmc = [
    { name : "DDR50", displayName : "DDR50"},
    { name : "SDR50", displayName : "SDR50"},
    { name : "HS200", displayName : "HS200"},
];

function getOperatingModesSD() {
    return operating_modes_sd;
}

function getOperatingModesEMMC() {
    return operating_modes_emmc;
}

function getDefaultOperatingModeEMMC() {
    return { name : "HS200", displayName : "HS200"};
}

function getDefaultOperatingModeSD() {
    return { name : "HS", displayName : "HS"};
}

function getDefaultConfig() {
	return mmcsd_config_r5fss[0];
}

function getConfigArr() {
	return mmcsd_config_r5fss;
}

exports = {
	getDefaultConfig,
	getConfigArr,
    getOperatingModesSD,
    getOperatingModesEMMC,
    getDefaultOperatingModeEMMC,
    getDefaultOperatingModeSD,
};
