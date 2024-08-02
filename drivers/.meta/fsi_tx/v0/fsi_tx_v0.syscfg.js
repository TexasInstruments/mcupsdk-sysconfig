
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let hwi = system.getScript("/kernel/dpl/hwi.js");
let soc = system.getScript(`/drivers/fsi_tx/soc/fsi_tx_${common.getSocName()}`);

function getStaticConfigArr() {
    return system.getScript(`/drivers/fsi_tx/soc/fsi_tx_${common.getSocName()}`).getStaticConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let staticConfigArr = getStaticConfigArr();
    let staticConfig = staticConfigArr.find( o => o.name === solution.peripheralName);

    return {
        ...staticConfig,
        ...moduleInstance
    }
};

function pinmuxRequirements(inst) {
    let interfaceName = getInterfaceName(inst);

    let resources = [];
    let pinResource = {};

    pinResource = pinmux.getPinRequirements(interfaceName, "CLK", "FSI Clock");
    pinmux.setConfigurableDefault( pinResource, "rx", false );
    resources.push( pinResource);
    pinResource = pinmux.getPinRequirements(interfaceName, "D0", "FSI TX Data 0");
    pinmux.setConfigurableDefault( pinResource, "rx", false );
    resources.push( pinResource);
    pinResource = pinmux.getPinRequirements(interfaceName, "D1", "FSI TX Data 1");
    pinmux.setConfigurableDefault( pinResource, "rx", false );
    resources.push( pinResource);

    let peripheral = {
        name          : interfaceName,
        displayName   : "FSI TX Instance",
        interfaceName : interfaceName,
        resources : resources,
        signalTypes: {
            CLK: "CLK",
            D0: "D0",
            D1: "D1"
        }
    };

    return [peripheral];
}

function getInterfaceName(inst) {
    return soc.getInterfaceName(inst);
}

function getPeripheralPinNames(inst) {
    return [ "CLK", "D0", "D1" ];
}

function getClockEnableIds(inst) {
    let instConfig = getInstanceConfig(inst);
    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}

function validate(inst, report) {
    common.validate.checkNumberRange(inst, report, "intrPriority", 0, hwi.getHwiMaxPriority(), "dec");
    common.validate.checkNumberRange(inst, report, "frameDataSize", 1, 16, "dec");
    common.validate.checkNumberRange(inst, report, "userData", 0, 255, "dec");
}
function filterHardware(component)
{
    return (common.typeMatches(component.type, ["FSITX"]));
}

let fsi_tx_module_name = "/drivers/fsi_tx/fsi_tx";

let fsi_tx_module = {
    displayName: "FSI_TX",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: fsi_tx_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: fsi_tx_module_name,
        },
    },
    defaultInstanceName: "CONFIG_FSI_TX",
    config: getConfigurables(),
    validate: validate,
    modules: function(inst) {
        return [{
            name: "system_common",
            moduleName: "/system_common",
        }]
    },
    sharedModuleInstances: addModuleInstances,
    moduleInstances: moduleInstances,
    pinmuxRequirements,
    getInstanceConfig,
    getInterfaceName,
    getPeripheralPinNames,
    getClockEnableIds,
    getClockFrequencies,
    filterHardware:filterHardware
};

function addModuleInstances(instance) {
    let modInstances = new Array();

    if(instance.sdkInfra == "HLD")
    {
        if((instance.operMode == "DMA")) {
            modInstances.push({
                name: "edmaDriver",
                displayName: "EDMA Configuration",
                moduleName: "/drivers/edma/edma",
            });
        }
    }

    return modInstances;
}

function getConfigurables()
{
    let config = [];

    config.push(
        {
            name: "sdkInfra",
            displayName: "SDK Infra",
            default: "LLD",
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
            description: "SDK Infra",
            onChange: function (inst, ui) {
                if(inst.sdkInfra == "LLD")
                {
                    ui.intrEnable.hidden = false;
                    ui.operMode.hidden = true;
                    ui.intrPriority.hidden = true;
                    ui.frameType.hidden = true;
                    ui.frameTag.hidden = true;
                    ui.numLane.hidden = true;
                    ui.frameDataSize.hidden = true;
                    ui.userData.hidden = true;
                    ui.errorCheck.hidden = true;
                    ui.delayLineCtrl.hidden = true;
                    ui.rxTrigger.hidden = true;
                    ui.udataFilterTest.hidden = true;
                }
                else if(inst.sdkInfra == "HLD")
                {
                    ui.intrEnable.hidden = true;
                    ui.operMode.hidden = false;
                    ui.intrPriority.hidden = false;
                    ui.frameType.hidden = false;
                    ui.frameTag.hidden = false;
                    ui.numLane.hidden = false;
                    ui.frameDataSize.hidden = false;
                    ui.userData.hidden = false;
                    ui.errorCheck.hidden = false;
                    ui.delayLineCtrl.hidden = false;
                    ui.rxTrigger.hidden = false;
                    ui.udataFilterTest.hidden = false;
                }
            },
        },
        {
            name: "intrEnable",
            displayName: "Interrupt Mode",
            description: "Enable Interrupt mode of operation",
            default: true,
        },
        {
            name: "operMode",
            displayName: "Operation Mode",
            default: "INTERRUPT",
            hidden: true,
            options: [
                {
                    name: "POLLED",
                    displayName: "Polled Mode"
                },
                {
                    name: "INTERRUPT",
                    displayName: "Interrupt Mode"
                },
                {
                    name: "DMA",
                    displayName: "DMA Mode"
                },
            ],
            description: "Operation Mode",
            onChange: function (inst, ui) {
                if(inst.operMode == "DMA") {
                    ui.intrPriority.hidden = true;
                    ui.userData.hidden = true;
                }
                if(inst.operMode == "POLLED") {
                    ui.intrPriority.hidden = true;
                    ui.userData.hidden = false;
                }
                if(inst.operMode == "INTERRUPT") {
                    ui.intrPriority.hidden = false;
                    ui.userData.hidden = false;
                }
            },
        },
        {
            name: "intrPriority",
            displayName: "Interrupt Priority",
            default: 4,
            hidden: true,
            description:  `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
        },
        {
            name: "userData",
            displayName: "User Data",
            default: 7,
            hidden: true,
            description: `User Data: 0 to 255`,
        },
        {
            name: "numLane",
            displayName: "Number of Lanes",
            default: "FSI_DATA_WIDTH_1_LANE",
            hidden: true,
            options: [
                {
                    name: "FSI_DATA_WIDTH_1_LANE",
                    displayName: "FSI_DATA_WIDTH_1_LANE"
                },
                {
                    name: "FSI_DATA_WIDTH_2_LANE",
                    displayName: "FSI_DATA_WIDTH_2_LANE"
                },
            ],
        },
        {
            name: "frameDataSize",
            displayName: "Frame Data Size",
            default: "16",
            hidden: true,
            description: `Frame Data Size: 1 to 16`,
        },
        {
            name: "frameType",
            displayName: "Frame Type",
            default: "FSI_FRAME_TYPE_NWORD_DATA",
            hidden: true,
            options: [
                {
                    name: "FSI_FRAME_TYPE_NWORD_DATA",
                    displayName: "FSI_FRAME_TYPE_NWORD_DATA"
                },
                {
                    name: "FSI_FRAME_TYPE_1WORD_DATA",
                    displayName: "FSI_FRAME_TYPE_1WORD_DATA"
                },
                {
                    name: "FSI_FRAME_TYPE_2WORD_DATA",
                    displayName: "FSI_FRAME_TYPE_2WORD_DATA"
                },
                {
                    name: "FSI_FRAME_TYPE_4WORD_DATA",
                    displayName: "FSI_FRAME_TYPE_4WORD_DATA"
                },
                {
                    name: "FSI_FRAME_TYPE_6WORD_DATA",
                    displayName: "FSI_FRAME_TYPE_6WORD_DATA"
                },
            ],
            description: `Frame type`,
        },
        {
            name: "frameTag",
            displayName: "Frame Data Tag",
            default: "FSI_FRAME_TAG1",
            hidden: true,
            options: [
                {
                    name: "FSI_FRAME_TAG0",
                    displayName: "FSI_FRAME_TAG0"
                },
                {
                    name: "FSI_FRAME_TAG1",
                    displayName: "FSI_FRAME_TAG1"
                },
                {
                    name: "FSI_FRAME_TAG2",
                    displayName: "FSI_FRAME_TAG2"
                },
                {
                    name: "FSI_FRAME_TAG3",
                    displayName: "FSI_FRAME_TAG3"
                },
                {
                    name: "FSI_FRAME_TAG4",
                    displayName: "FSI_FRAME_TAG4"
                },
                {
                    name: "FSI_FRAME_TAG5",
                    displayName: "FSI_FRAME_TAG5"
                },
                {
                    name: "FSI_FRAME_TAG6",
                    displayName: "FSI_FRAME_TAG6"
                },
                {
                    name: "FSI_FRAME_TAG7",
                    displayName: "FSI_FRAME_TAG7"
                },
                {
                    name: "FSI_FRAME_TAG8",
                    displayName: "FSI_FRAME_TAG8"
                },
                {
                    name: "FSI_FRAME_TAG9",
                    displayName: "FSI_FRAME_TAG9"
                },
                {
                    name: "FSI_FRAME_TAG10",
                    displayName: "FSI_FRAME_TAG10"
                },
                {
                    name: "FSI_FRAME_TAG11",
                    displayName: "FSI_FRAME_TAG11"
                },
                {
                    name: "FSI_FRAME_TAG12",
                    displayName: "FSI_FRAME_TAG12"
                },
                {
                    name: "FSI_FRAME_TAG13",
                    displayName: "FSI_FRAME_TAG13"
                },
                {
                    name: "FSI_FRAME_TAG14",
                    displayName: "FSI_FRAME_TAG14"
                },
                {
                    name: "FSI_FRAME_TAG15",
                    displayName: "FSI_FRAME_TAG15"
                },
            ],
            description: `Frame data tag`,
        },
        {
            name: "errorCheck",
            displayName: "Error Check",
            default: "FSI_TX_NO_ERROR_CHECK",
            hidden: true,
            options: [
                {
                    name: "FSI_TX_ECC_ERROR_CHECK",
                    displayName: "ECC Error Check"
                },
                {
                    name: "FSI_TX_USER_DEFINED_CRC_CHECK",
                    displayName: "User Defined Crc"
                },
                {
                    name: "FSI_TX_NO_ERROR_CHECK",
                    displayName: "No Error Check",
                },
            ],
            description: `Error Check`,
        },
        {
            name: "delayLineCtrl",
            displayName: "Delay Line Control",
            description: "Enable Delay Line Control",
            default: false,
            hidden: true,
        },
        {
            name: "rxTrigger",
            displayName: "Enable Rx Trigger",
            description: "Enable Rx Trigger",
            default: false,
            hidden: true,
            onChange: function (inst, ui) {
                let hideConfigs = true;
                if(inst.rxTrigger == true) {
                    hideConfigs = false;
                }
                ui.rxTriggerVal.hidden = hideConfigs;
            }
        },
        {
            name: "rxTriggerVal",
            displayName: "Receive Trigger Value",
            default: "4",
            hidden: true,
            description: "Receive Trigger Value",
        },
        {
            name: "udataFilterTest",
            displayName: "User Data Filter Test",
            default: false,
            hidden: true,
            description: "User Data Filter Test",
        },
    )
    return config;
}

function moduleInstances(inst) {
    let modInstances = new Array();

    if(inst.sdkInfra == "LLD")
    {
        if(soc.interruptXbarConfig == true && inst.intrEnable == true)
        {
            modInstances.push({
                name: "fsiTxIntXbar0",
                displayName: "FSI TX Interrupt 0 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_TX_INT0",
                },
            });
            modInstances.push({
                name: "fsiTxIntXbar1",
                displayName: "FSI TX Interrupt 1 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_TX_INT1",
                },
            });
        }
    }
    else if(inst.sdkInfra == "HLD")
    {
        if(soc.interruptXbarConfig == true && inst.operMode == "INTERRUPT")
        {
            modInstances.push({
                name: "fsiTxIntXbar0",
                displayName: "FSI TX Interrupt 0 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_TX_INT0",
                },
            });
            modInstances.push({
                name: "fsiTxIntXbar1",
                displayName: "FSI TX Interrupt 1 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_TX_INT1",
                },
            });
        }
    }
    if( inst.sdkInfra == "HLD")
    {
        modInstances.push({
            name: "child",
            moduleName: '/drivers/fsi_tx/v0/fsi_tx_v0_template_hld',
            },
        );
    }
    else
    {
        modInstances.push({
            name: "child",
            moduleName: '/drivers/fsi_tx/v0/fsi_tx_v0_template',
            },
        );
    }

    return (modInstances);
}

exports = fsi_tx_module;
