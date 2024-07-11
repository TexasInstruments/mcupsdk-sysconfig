let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let hwi = system.getScript("/kernel/dpl/hwi.js");
let soc    = system.getScript(`/drivers/mmcsd/soc/mmcsd_${common.getSocName()}`);

function getConfigArr() {
	return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
	let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find(o => o.name === solution.peripheralName);

    config.clockFrequencies[0].clkRate = moduleInstance.inputClkFreq;

    return {
        ...config,
        ...moduleInstance,
    };
}

function getOperatingMode(inst) {

    if((inst.cardType == "EMMC") || (inst.cardType == "NO_DEVICE"))
    {
        switch(inst.modeSelectEMMC)
        {
            default:
            case "HS200":
                return "MMCSD_SUPPORT_MMC_DS | MMCSD_SUPPORT_MMC_HS200";
                break;
            case "DDR50":
                return "MMCSD_SUPPORT_MMC_DS | MMCSD_SUPPORT_MMC_HS_DDR";
                break;
            case "SDR50":
                return "MMCSD_SUPPORT_MMC_DS | MMCSD_SUPPORT_MMC_HS_SDR";
                break;
        }
    }else if(inst.cardType == "SD")
    {
        switch(inst.modeSelectSD)
        {
            default:
                return "MMCSD_SUPPORT_SD_DS | MMCSD_SUPPORT_SD_HS";
                break;
        }
    }

}

function pinmuxRequirements(instance) {

	let interfaceName;
    if(instance.sdkInfra == "HLD")
    {
        interfaceName = getInterfaceName(instance);
    }
    else
    {
        interfaceName = getInterfaceNameLLD(instance);
        if(interfaceName == "MMCSD1") {
            interfaceName = "MMC1";
        }
        else {
            interfaceName = "MMC0";
        }
    }

	let resources = [];
    let pinResource = {};

    if(interfaceName == "MMC1")
    {
    	pinResource = pinmux.getPinRequirements(interfaceName, "CLK", "MMC1 CLK Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "nopull" );
    	resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "CLKLB", "MMC1 CLKLB Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "CMD", "MMC1 CMD Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "DAT0", "MMC1 DAT0 Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "DAT1", "MMC1 DAT1 Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "DAT2", "MMC1 DAT2 Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "DAT3", "MMC1 DAT3 Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);

    	pinResource = pinmux.getPinRequirements(interfaceName, "SDCD", "MMC1 SDCD Pin");
    	pinmux.setConfigurableDefault( pinResource, "rx", true );
    	resources.push( pinResource);
    }

	let peripheral = {
		name          : interfaceName,
        displayName   : "MMCSD Instance",
        interfaceName : interfaceName,
        resources     : resources,
	}

	return [peripheral];
}

function getPeripheralPinNames(inst) {

    if(inst.sdkInfra == "HLD") {
        if(getInterfaceName(inst) == "MMC1") {
            return ["CLK", "CLKLB", "CMD", "DAT0", "DAT1", "DAT2", "DAT3", "SDCD"];
        }
    }
    else {
        if(getInterfaceNameLLD(inst) == "MMCSD1") {
            return ["CLK", "CLKLB", "CMD", "DAT0", "DAT1", "DAT2", "DAT3", "SDCD"];
        }
    }


    return [ ];
}

function getInterfaceName(inst) {
	return inst.moduleSelect;
}

function getInterfaceNameLLD(inst) {
	return inst.moduleSelectLLD;
}

function getClockEnableIds(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}

function checkBusMode(instance, report, busWidthproperty, busSpeedProperty) {

    let busWidth1BitSupported = 0;
    let busWidth = instance[busWidthproperty];
    let busSpeed = instance[busSpeedProperty];

    if((busSpeed == "SDR25") || (busSpeed == "SDR50")) {
        busWidth1BitSupported = 1;
    }
    if((busWidth1BitSupported == 0) & (busWidth == "1BIT")) {
        report.logError("Bus width 1BIT not supported in selected Operating Mode", instance, "busWidthMMC");
    }
}

function checkBusModeSD(instance, report, busWidthproperty, busSpeedProperty) {

    let busWidth1BitSupported = 0;
    let busWidth = instance[busWidthproperty];
    let busSpeed = instance[busSpeedProperty];

    if((busSpeed == "HS") || (busSpeed == "DS")) {
        busWidth1BitSupported = 1;
    }
    if((busWidth1BitSupported == 0) & (busWidth == "1BIT")) {
        report.logError("Bus width 1BIT not supported in selected Operating Mode", instance, "busWidthSD");
    }
}



let mmcsd_module_name = "/drivers/mmcsd/mmcsd";

let mmcsd_module = {
	displayName: "MMCSD",

	templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: mmcsd_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: mmcsd_module_name,
        },
	},

	maxInstances: getConfigArr().length,
	defaultInstanceName: "CONFIG_MMCSD",
	validate: validate,
	config: [
        {
            /* HLD Only */
            name: "moduleSelect",
            displayName: "Select MMCSD Module",
            description: "The MMC0 is usually connected to the eMMC device and MMC1 is usually connected to the SD card slot",
            default: "MMC1",
            options: [
                { name: "MMC0" },
                { name: "MMC1" },
            ],
            onChange: function (inst, ui) {
                if(inst.moduleSelect == "MMC0")
                {
                    inst.cardType = "EMMC";
                    inst.phyType = "HW_PHY";

                    ui.modeSelectEMMC.hidden = true;
                    ui.modeSelectSD.hidden = true;

                    ui.usePLLSD.hidden = true;
                    ui.busWidthMMC.hidden = false;
                    ui.busWidthSD.hidden = true;

                    if(inst.autoAssignMaxBusSpeed == true){
                        ui.modeSelectEMMC.hidden = true;
                        ui.busWidthMMC.hidden = true;
                    }
                    else{
                        ui.modeSelectEMMC.hidden = false;
                        ui.busWidthMMC.hidden = false;
                    }
                }
                else
                {
                    inst.cardType = "SD";
                    inst.phyType = "SW_PHY";
                    ui.modeSelectSD.hidden = true;
                    ui.modeSelectEMMC.hidden = true;

                    ui.usePLLSD.hidden = false;
                    ui.busWidthMMC.hidden = true;
                    ui.busWidthSD.hidden = false;

                    if(inst.autoAssignMaxBusSpeed == true){
                        ui.modeSelectSD.hidden = true;
                        ui.busWidthSD.hidden = true;
                    }
                    else{
                        ui.modeSelectSD.hidden = false;
                        ui.busWidthSD.hidden = false;
                    }
                }
            },
        },
        {
            /* LLD Only */
            name: "moduleSelectLLD",
            displayName: "Select MMCSD Module LLD",
            description: "The MMCSD0 is connected to the eMMC device and MMCSD1 is connected to the SD card slot",
            default: "MMCSD1",
            hidden: true,
            options: [
                { name: "MMCSD0" },
                { name: "MMCSD1" },
            ],
            onChange: function (inst, ui) {

                inst.autoAssignMaxBusSpeed = true;
                ui.modeSelectSDLLD.hidden = true;
                ui.modeSelectEMMCLLD.hidden = true;

                if(inst.moduleSelectLLD == "MMCSD0")
                {
                    inst.moduleSelect = "MMC0";

                    inst.cardType = "EMMC";
                    inst.phyType = "HW_PHY";

                    ui.busWidthMMC.hidden = false;
                    ui.busWidthSD.hidden = true;

                    if(inst.sdkInfra == "LLD")
                    {
                        ui.modeSelectEMMC.hidden = true;
                        ui.modeSelectSD.hidden = true;

                        ui.cardTypeSDLLD.hidden = true;
                        ui.cardTypeMMCLLD.hidden = false;
                        inst.cardTypeMMCLLD = "EMMC";

                        ui.usePLLSD.hidden = true;
                        ui.busWidthMMC.hidden = false;
                    }
                    else
                    {

                    }
                }
                else
                {
                    inst.moduleSelect = "MMC1";

                    inst.cardType = "SD";
                    inst.phyType = "SW_PHY";

                    ui.busWidthMMC.hidden = true;
                    ui.busWidthSD.hidden = false;

                    if(inst.sdkInfra == "LLD")
                    {
                        ui.modeSelectSD.hidden = true;
                        ui.modeSelectEMMC.hidden = true;

                        ui.cardTypeSDLLD.hidden = false;
                        ui.cardTypeMMCLLD.hidden = true;
                        inst.cardTypeSDLLD = "SD";

                        ui.usePLLSD.hidden = false;
                        ui.busWidthMMC.hidden = true;
                    }
                    else
                    {

                    }
                }
            },
        },
        {
            name: "autoAssignMaxBusSpeed",
            displayName: "Auto Assign Maximum Speed",
            default: true,
            onChange: function (inst, ui) {
                if(inst.sdkInfra == "LLD")
                {
                    let hideConfigs = false;
                    if(inst.autoAssignMaxBusSpeed == true) {
                        hideConfigs = true;
                    }

                    if(inst.moduleSelectLLD == "MMCSD1") {
                        ui.modeSelectSDLLD.hidden = hideConfigs;
                        ui.busWidthSD.hidden = hideConfigs;
                    }
                    else {
                        ui.modeSelectEMMCLLD.hidden = hideConfigs;
                        ui.busWidthMMC.hidden = hideConfigs;
                    }
                }
                else
                {
                    /* For HLD */
                    let hideConfigs = false;
                    if(inst.autoAssignMaxBusSpeed == true) {
                        hideConfigs = true;
                    }

                    if(inst.moduleSelect == "MMC1") {
                        ui.modeSelectSD.hidden = hideConfigs;
                        ui.busWidthSD.hidden = hideConfigs;
                    }
                    else {
                        ui.modeSelectEMMC.hidden = hideConfigs;
                        ui.busWidthMMC.hidden = hideConfigs;
                    }
                }
            },
        },
        {
            /* HLD Only */
            name: "modeSelectEMMC",
            displayName: "EMMC Operating Mode",
            description: "Select the operating mode for EMMC",
            default: soc.getDefaultOperatingModeEMMC().name,
            options: soc.getOperatingModesEMMC(),
            hidden : true,
        },
        {
            /* HLD Only */
            name: "modeSelectSD",
            displayName: "SD Operating Mode",
            description: "Select the operating mode for SD",
            default: soc.getDefaultOperatingModeSD().name,
            options: soc.getOperatingModesSD(),
            hidden: true,
        },
        {
            /* LLD Only */
            name: "modeSelectSDLLD",
            displayName: "SD Operating Mode LLD",
            description: "Select the operating mode for SD",
            default: soc.getDefaultOperatingModeSD().name,
            options: soc.getOperatingModesSDLLD(),
            hidden: true,
        },
        {
            /* LLD Only */
            name: "modeSelectEMMCLLD",
            displayName: "EMMC Operating Mode LLD",
            description: "Select the operating mode for EMMC",
            default: soc.getDefaultOperatingModeEMMC().name,
            options: soc.getOperatingModesEMMCLLD(),
            hidden : true,
        },

		{
			name: "inputClkFreq",
			displayName: "Input Clock Frequency (Hz)",
			default: soc.getDefaultConfig().inputClkFreq,
            hidden: true,
		},
        {
            /* HLD & LLD */
			name: "busWidthMMC",
			displayName: "Bus Width",
			default: "4BIT",
            options: [
                { name: "1BIT" },
                { name: "4BIT" },
                { name: "8BIT" },
            ],
            hidden: true,
		},
        {
            /* HLD & LLD */
			name: "busWidthSD",
			displayName: "Bus Width",
			default: "4BIT",
            options: [
                { name: "1BIT" },
                { name: "4BIT" },
            ],
            hidden: true,
		},
		{
			name: "cardType",
			displayName: "Card Type",
			default: "EMMC",
            options: [
                { name: "EMMC" },
                { name: "SD" },
                { name: "NO_DEVICE" },
            ],
		},

        {
            /* LLD Only */
			name: "cardTypeMMCLLD",
			displayName: "Card Type MMC",
			default: "EMMC",
            options: [
                { name: "EMMC" },
                { name: "NO_DEVICE" },
            ],
            hidden: true,
		},
        {
            /* LLD Only */
			name: "cardTypeSDLLD",
			displayName: "Card Type SD",
			default: "SD",
            options: [
                { name: "SD" },
                { name: "NO_DEVICE" },
            ],
            hidden: true,
		},
        {
            /* HLD & LLD */
			name: "usePLLSD",
			displayName: "Use PLL for SD Clock",
            description: "If activated PLL will exit low power mode and start locking clock",
			default: false,
            hidden: false,
		},
        {
            /* HLD Only */
            name: "intrPriority",
            displayName: "Interrupt Priority",
            default: 4,
            hidden: false,
            description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
        },
		{
            name: "intrEnable",
            displayName: "Interrupt Enable",
            default: false,
            hidden: false,
            onChange: function (inst, ui) {
                let hideConfigs = false;
                if(inst.intrEnable == false) {
                    hideConfigs = true;
                    inst.transferCallbackFxn = "NULL";
                    inst.transferMode = "BLOCKING";
                    ui.transferCallbackFxn.hidden = true;
                }
                ui.transferMode.hidden = hideConfigs;
            },
            description: "If enabled interrupt mode otherwise polling mode",
        },
        {
            name: "transferMode",
            displayName: "Transfer Mode",
            default: "BLOCKING",
            hidden: true,
            options: [
                {
                    name: "BLOCKING",
                    displayName: "Blocking"
                },
                {
                    name: "CALLBACK",
                    displayName: "Callback"
                },
            ],
            onChange: function (inst, ui) {
                if(inst.transferMode == "CALLBACK") {
                    ui.transferCallbackFxn.hidden = false;
                }
                else{
                    inst.transferCallbackFxn = "NULL";
                    ui.transferCallbackFxn.hidden = true;
                }
            },
            description: "This determines whether the driver operates synchronously or asynchronously",
        },
        {
            name: "transferCallbackFxn",
            displayName: "Transfer Callback",
            default: "NULL",
            hidden: true,
            description: "Transfer callback function when callback mode is selected",
        },
        {
            name: "dmaEnable",
            displayName: "DMA Enable",
            default: false,
            hidden: false,
        },
        {
            /* HLD Only */
			name: "phyType",
			displayName: "PHY Type",
			options: [
                { name: "HW_PHY" },
                { name: "SW_PHY" },
                { name: "NO_PHY" },
            ],
			default: "SW_PHY",
			hidden: true,
		},
        {
            /* HLD & LLD */
			name: "tuningType",
			displayName: "Tuning Type",
			options: [
                { name: "AUTO" },
                { name: "MANUAL" },
            ],
			default: "AUTO",
			hidden: false,
		},
        {
            /* HLD & LLD */
            name: "sdkInfra",
            displayName: "SDK Infra",
            default: "HLD",
            options: [
                {
                    name: "HLD",
                    displayName: "HLD"
                },
                {
                    name: "LLD",
                    displayName: "LLD"
                },
            ],
            onChange: function (inst, ui) {

                inst.autoAssignMaxBusSpeed = true;

                if(inst.sdkInfra == "LLD") {

                    ui.moduleSelect.hidden = true;
                    ui.moduleSelectLLD.hidden = false;

                    ui.inputClkFreq.hidden = true;
                    ui.phyType.hidden = true;
                    ui.intrEnable.hidden = true;
                    ui.intrPriority.hidden = true;
                    ui.transferMode.hidden = true;
                    ui.transferCallbackFxn.hidden = true;

                    ui.cardType.hidden = true;

                    ui.modeSelectEMMC.hidden = true;
                    ui.modeSelectSD.hidden = true;




                    if(inst.moduleSelectLLD == "MMCSD0")
                    {
                        inst.moduleSelect = "MMC0";

                        inst.phyType = "HW_PHY";

                        ui.cardTypeSDLLD.hidden = true;
                        ui.cardTypeMMCLLD.hidden = false;

                        ui.usePLLSD.hidden = true;

                        ui.busWidthMMC.hidden = false;
                        ui.busWidthSD.hidden = true;
                    }
                    else
                    {
                        inst.moduleSelect = "MMC1";

                        inst.phyType = "SW_PHY";

                        ui.cardTypeSDLLD.hidden = false;
                        ui.cardTypeMMCLLD.hidden = true;

                        ui.usePLLSD.hidden = false;

                        ui.busWidthMMC.hidden = true;
                        ui.busWidthSD.hidden = false;

                    }
                }
                else {

                    ui.moduleSelect.hidden = false;
                    ui.moduleSelectLLD.hidden = true;

                    ui.inputClkFreq.hidden = true;
                    ui.phyType.hidden = true;

                    inst.intrEnable = false;
                    ui.intrEnable.hidden = false;
                    ui.intrPriority.hidden = false;

                    ui.cardType.hidden = false;

                    ui.cardTypeSDLLD.hidden = true;
                    ui.cardTypeMMCLLD.hidden = true;

                    ui.busWidthMMC.hidden = true;
                    ui.busWidthSD.hidden = false;

                    ui.modeSelectSDLLD.hidden = true;
                    ui.modeSelectEMMCLLD.hidden = true;




                    if(inst.moduleSelect == "MMC0") {

                        ui.modeSelectEMMC.hidden = true;
                        ui.modeSelectSD.hidden = true;

                        ui.busWidthMMC.hidden = false;
                        ui.busWidthSD.hidden = true;

                        ui.usePLLSD.hidden = true;
                    }
                    else {

                        ui.modeSelectEMMC.hidden = true;
                        ui.modeSelectSD.hidden = false;

                        ui.busWidthMMC.hidden = true;
                        ui.busWidthSD.hidden = false;

                        ui.usePLLSD.hidden = false;
                    }
                }
            },
            description: "SDK Infra",
        },
	],
    moduleInstances: moduleInstances,
	getInstanceConfig,
	pinmuxRequirements,
	getInterfaceName,
    getInterfaceNameLLD,
	getPeripheralPinNames,
	getClockEnableIds,
	getClockFrequencies,
    getOperatingMode,
};

function validate(inst, report) {

    if ((inst.moduleSelectLLD == "MMCSD0") & (inst.sdkInfra == "LLD")) {
        if(inst.autoAssignMaxBusSpeed == false) {
            checkBusMode(inst, report,"busWidthMMC", "modeSelectEMMCLLD");
        }
    }
    if ((inst.moduleSelectLLD == "MMCSD1") & (inst.sdkInfra == "LLD")) {
        if(inst.autoAssignMaxBusSpeed == false) {
            checkBusModeSD(inst, report,"busWidthSD", "modeSelectSDLLD");
        }
    }

    if(inst.sdkInfra == "HLD") {

        if((inst.transferMode == "CALLBACK") & (inst.intrEnable == true) &
        ((inst.transferCallbackFxn == "NULL") || (inst.transferCallbackFxn == ""))) {
            report.logError("Callback function MUST be provided for callback transfer mode", inst, "transferCallbackFxn");
        }

        if ((inst.moduleSelect == "MMC0")) {
            if(inst.autoAssignMaxBusSpeed == false) {
                checkBusMode(inst, report,"busWidthMMC", "modeSelectEMMC");
            }
        }
        if ((inst.moduleSelect == "MMC1")) {
            if(inst.autoAssignMaxBusSpeed == false) {
                checkBusModeSD(inst, report,"busWidthSD", "modeSelectSD");
            }
        }

        if( ((inst.moduleSelect == "MMC0") & (inst.cardType == "SD")) ||
            ((inst.moduleSelect == "MMC1") & (inst.cardType == "EMMC"))) {
            report.logError("Selected Module Does not Support Selected Card Type", inst, "cardType");
        }

    }

}


/*
 *  ======== moduleInstances ========
 */
function moduleInstances(inst) {
    let modInstances = new Array();

    if(inst.sdkInfra == "HLD")
    {
        modInstances.push({
            name: "MMCSD_child",
            moduleName: '/drivers/mmcsd/v0/mmcsd_v0_template',
            },
        );
    }
    else
    {
        modInstances.push({
            name: "MMCSD_child",
            moduleName: '/drivers/mmcsd/v0/mmcsd_v0_template_lld',
            },
        );
    }

    return (modInstances);
}

exports = mmcsd_module;
