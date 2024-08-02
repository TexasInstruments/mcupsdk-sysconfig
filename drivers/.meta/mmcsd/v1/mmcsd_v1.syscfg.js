let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let hwi    = system.getScript("/kernel/dpl/hwi.js");
let soc    = system.getScript(`/drivers/mmcsd/soc/mmcsd_${common.getSocName()}`);

function getConfigArr() {
	return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
	let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find(o => o.name === solution.peripheralName);

    config.clockFrequencies[0].clkRate = moduleInstance.inputClkFreq;
    config.clockFrequencies[0].clkId = moduleInstance.clockSource;

    return {
        ...config,
        ...moduleInstance,
    };
}

function pinmuxRequirements(instance) {
	let interfaceName = getInterfaceName(instance);
	let resources = [];
    let pinResource = {};
    if(interfaceName == "MMC")
    {
        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_CLK", "MMC1 CLK Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "nopull" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_SDWP", "MMC1 SDWP Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "nopull" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_CMD", "MMC1 CMD Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_DAT0", "MMC1 DAT0 Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_DAT1", "MMC1 DAT1 Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_DAT2", "MMC1 DAT2 Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_DAT3", "MMC1 DAT3 Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "pu" );
        resources.push( pinResource);

        pinResource = pinmux.getPinRequirements(interfaceName, "MMC_SDCD", "MMC1 SDCD Pin");
        pinmux.setConfigurableDefault( pinResource, "rx", true );
        pinmux.setConfigurableDefault( pinResource, "pu_pd", "nopull" );
        resources.push( pinResource);
    }
	let peripheral = {
		name          : interfaceName,
        displayName   : "MMCSD Instance",
        interfaceName : interfaceName,
        resources     : resources,
        signalTypes: {
            MMC_CLK  :"MMC_CLK",
            MMC_SDWP : "MMC_SDWP",
            MMC_CMD  : "MMC_CMD",
            MMC_DAT0 : "MMC_DAT0",
            MMC_DAT1 : "MMC_DAT1",
            MMC_DAT2 : "MMC_DAT2",
            MMC_DAT3 : "MMC_DAT3",
            MMC_SDCD : "MMC_SDCD"
        }
	}

	return [peripheral];
}

function getPeripheralPinNames(inst) {
    return ["MMC_CLK", "MMC_CMD", "MMC_DAT0", "MMC_DAT1", "MMC_DAT2", "MMC_DAT3", "MMC_SDWP", "MMC_SDCD"];
}

function getInterfaceName(inst) {
	return "MMC";
}

function getClockEnableIds(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}
function filterHardware(component)
{
    return (common.typeMatches(component.type, ["MMCSD"]));
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
            name: "moduleSelect",
            displayName: "Select MMCSD Module",
            description: "The MMC is usually connected to the SD card slot",
            default: "MMC",
            hidden: true,
            options: [
                { name: "MMC" },
            ],
            onChange: function (inst, ui) {
                if(inst.moduleSelect == "MMC") {
                    inst.cardType = "SD";
                }
            },
        },
        {
            name: "clockSource",
            displayName: "Clock Source",
            default: soc.getDefaultClkSource(),
            description: "Clock Source",
            getValue: (inst) => {
                const interfaceName = getInterfaceName(inst)
                const mmcsdSolution = inst[interfaceName].$solution
                let mmcsdInstanceName = ""
                if(mmcsdSolution)
                    mmcsdInstanceName   = mmcsdSolution.peripheralName
                else
                    mmcsdInstanceName = "MMC0"

                // AM263Px has 1 instance and it's named as MMC. But for consistency among am26x devices, we change it to MMC0
                if(mmcsdInstanceName == "MMC") {
                    mmcsdInstanceName = "MMC0";
                }
                return soc.getDefaultClkSource(mmcsdInstanceName)
            }
        },
		{
			name: "inputClkFreq",
			displayName: "Input Clock Frequency (Hz)",
			default: soc.getDefaultClkRate(),
            hidden: false,
            getValue: (inst) => {
                const interfaceName = getInterfaceName(inst)
                const mmcsdSolution = inst[interfaceName].$solution
                let mmcsdInstanceName = ""
                if(mmcsdSolution)
                    mmcsdInstanceName   = mmcsdSolution.peripheralName
                else
                    mmcsdInstanceName = "MMC0"

                // AM263Px has 1 instance and it's named as MMC. But for consistency among am26x devices, we change it to MMC0
                if(mmcsdInstanceName == "MMC") {
                    mmcsdInstanceName = "MMC0";
                }
                return soc.getDefaultClkRate(mmcsdInstanceName)
            }
		},
		{
			name: "cardType",
			displayName: "Card Type",
			default: "SD",
            options: [
                { name: "SD" },
                { name: "EMMC" },
                { name: "NO_DEVICE" },
            ],
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

                    ui.modeSelectSD.hidden = hideConfigs;
                    ui.supportedBusWidth.hidden = hideConfigs;
                }
                else
                {
                    /* For HLD */
                    let hideConfigs = false;
                    if(inst.autoAssignMaxBusSpeed == true) {
                        hideConfigs = true;
                    }

                    ui.modeSelectSD.hidden = hideConfigs;
                    ui.supportedBusWidth.hidden = hideConfigs;
                }
            },
        },
        {
            /* LLD Only */
            name: "modeSelectSD",
            displayName: "SD Operating Mode",
            description: "Select the operating mode for SD",
            default: soc.getDefaultOperatingModeSD().name,
            options: soc.getOperatingModesSD(),
            hidden: true,
        },
        {
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

                if(inst.intrEnable == false) {

                    ui.transferMode.hidden = true;
                    inst.transferCallbackFxn = "NULL";
                    inst.transferMode = "BLOCKING";
                    ui.transferCallbackFxn.hidden = true;
                }
                else {
                    ui.transferMode.hidden = false;
                }
            },
            description: "If enabled, Transfer will happen in interrupt Mode",
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
                else {
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
            onChange: function (inst, ui) {
                ui.intrEnable.hidden = inst.dmaEnable;
                ui.intrPriority.hidden = inst.dmaEnable;
            },
        },
        {
            name: "supportedBusVoltages",
            displayName: "Voltage Value",
            options: [
                { name: "VOLTAGE_3_3V" },
                { name: "VOLTAGE_3_0V" },
            ],
            default: "VOLTAGE_3_3V",
            hidden: true,
        },
        {
            name: "supportedBusWidth",
            displayName: "Data Width",
            options: [
                {
                    name: "MMCSD_BUS_WIDTH_4BIT",
                    displayName: "4BIT"
                },
                {
                    name: "MMCSD_BUS_WIDTH_1BIT",
                    displayName: "1BIT"
                },
            ],
            default: "MMCSD_BUS_WIDTH_4BIT",
            hidden: true,
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

                if(inst.sdkInfra == "LLD") {

                    ui.intrPriority.hidden = true;
                    ui.intrEnable.hidden = true;
                }
                else {

                    inst.intrEnable = false;
                    ui.intrEnable.hidden = false;
                    ui.intrPriority.hidden = false;
                    ui.transferMode.hidden = true;
                }
            },
            description: "SDK Infra",
            hidden: false,
        },
	],
    moduleInstances: moduleInstances,
    sharedModuleInstances: addModuleInstances,
	getInstanceConfig,
	pinmuxRequirements,
	getInterfaceName,
	getPeripheralPinNames,
	getClockEnableIds,
	getClockFrequencies,
    filterHardware:filterHardware
};

function validate(inst, report) {

    if (["am263x", "am263px", "am261x"].includes(common.getSocName()) ) {
        let clockSrc_Freq_Map = soc.getClockSrcValueMap()

        const interfaceName = getInterfaceName(inst)
        const mmcsdSolution = inst[interfaceName]
        let mmcsdInstanceName = ""

        if(mmcsdSolution)
            mmcsdInstanceName   = mmcsdSolution.$assign
        
        if(mmcsdInstanceName === undefined || mmcsdInstanceName === "Any"){
            mmcsdInstanceName = "MMC0"
        }

        let clockSrc = inst.clockSource 
        let clockRate = inst.inputClkFreq
        if(!clockSrc_Freq_Map.hasOwnProperty(clockSrc) || clockRate !== clockSrc_Freq_Map[clockSrc]){
            if(!clockSrc_Freq_Map.hasOwnProperty(clockSrc)){
                report.logWarning(`Invalid clock source ${clockSrc} selected `, inst, "inputClkFreq");
            }
            else{
                report.logWarning(`Valid clock frequency for this clock source ${clockSrc} is ${clockSrc_Freq_Map[clockSrc]}`, inst, "inputClkFreq");
            }
        }
    }
}

/*
 *  ======== moduleInstances ========
 */
function addModuleInstances(inst) {
    let modInstances = new Array();

    if(inst.dmaEnable == true)
    {
        modInstances.push({
            name: "edmaConfig",
            displayName: "EDMA",
            moduleName: '/drivers/edma/edma',
        });
        modInstances.push({
            name: "mmcRxConfigXbar",
            displayName: "MMC DMA RX Trigger Configuration",
            moduleName: '/xbar/dma_trig_xbar/dma_trig_xbar',
            requiredArgs: {
                parentName: "MMC_DMA_RD",
            },
        });
        modInstances.push({
            name: "mmcTxConfigXbar",
            displayName: "MMC DMA TX Trigger Configuration",
            moduleName: '/xbar/dma_trig_xbar/dma_trig_xbar',
            requiredArgs: {
                parentName: "MMC_DMA_WR",
            },
        });
    }
    

    return modInstances;
}

function moduleInstances(inst) {
    let modInstances = new Array();

    if(inst.sdkInfra == "HLD")
    {
        modInstances.push({
            name: "MMCSD_child",
            moduleName: '/drivers/mmcsd/v1/mmcsd_v1_template',
            },
        );
    }
    else
    {
        modInstances.push({
            name: "MMCSD_child",
            moduleName: '/drivers/mmcsd/v1/mmcsd_v1_template_lld',
            },
        );
    }

    return (modInstances);
}

exports = mmcsd_module;
