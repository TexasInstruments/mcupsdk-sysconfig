
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let hwi = system.getScript("/kernel/dpl/hwi.js");
let soc = system.getScript(`/drivers/fsi_rx/soc/fsi_rx_${common.getSocName()}`);

function getStaticConfigArr() {
    return system.getScript(`/drivers/fsi_rx/soc/fsi_rx_${common.getSocName()}`).getStaticConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let staticConfigArr = getStaticConfigArr();
    let staticConfig = staticConfigArr.find( o => o.name === solution.peripheralName);

    return {
        ...staticConfig,
        ...moduleInstance
    }
}

function pinmuxRequirements(inst) {
    let interfaceName = getInterfaceName(inst);

    let resources = [];
    let pinResource = {};

    pinResource = pinmux.getPinRequirements(interfaceName, "CLK", "FSI Clock");
    pinmux.setConfigurableDefault( pinResource, "rx", true );
    resources.push( pinResource);
    pinResource = pinmux.getPinRequirements(interfaceName, "D0", "FSI RX Data 0");
    pinmux.setConfigurableDefault( pinResource, "rx", true );
    resources.push( pinResource);
    pinResource = pinmux.getPinRequirements(interfaceName, "D1", "FSI RX Data 1");
    pinmux.setConfigurableDefault( pinResource, "rx", true );
    resources.push( pinResource);

    let peripheral = {
        name          : interfaceName,
        displayName   : "FSI RX Instance",
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

function validate(inst, report) {
    common.validate.checkNumberRange(inst, report, "intrPriority", 0, hwi.getHwiMaxPriority(), "dec");
    common.validate.checkNumberRange(inst, report, "frameDataSize", 1, 16, "dec");
}
function filterHardware(component)
{
    return (common.typeMatches(component.type, ["FSIRX"]));
}

let fsi_rx_module_name = "/drivers/fsi_rx/fsi_rx";

/*
 *  ======== addModuleInstances ========
 */
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

let fsi_rx_module = {
    displayName: "FSI_RX",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: fsi_rx_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: fsi_rx_module_name,
        },
    },
    defaultInstanceName: "CONFIG_FSI_RX",
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
    onMigrate,
    filterHardware:filterHardware
};

function onMigrate(newInst, oldInst, oldSystem) {
    let pins = getPeripheralPinNames(oldInst)
    let interfaceName = getInterfaceName(oldInst)
    common.onMigrate(newInst, oldInst, oldSystem, pins, interfaceName)
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
                    ui.numLane.hidden = true;
                    ui.userData.hidden = true;
                    ui.frameDataSize.hidden = true;
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
                    ui.numLane.hidden = false;
                    ui.userData.hidden = false;
                    ui.frameDataSize.hidden = false;
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
            description: "Opeation Mode",
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
            description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
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
            name: "userData",
            displayName: "User Data",
            default: 7,
            hidden: true,
            description: `User Data: 0 to 255`,
        },
        {
            name: "frameDataSize",
            displayName: "Frame Data Size",
            default: "16",
            hidden: true,
            description: `Frame Data Size: 1 to 16`,
        },
        {
            name: "errorCheck",
            displayName: "Error Check",
            default: "FSI_RX_NO_ERROR_CHECK",
            hidden: true,
            options: [
                {
                    name: "FSI_RX_ECC_ERROR_CHECK",
                    displayName: "ECC Error Check"
                },
                {
                    name: "FSI_RX_USER_DEFINED_CRC_CHECK",
                    displayName: "User Defined Crc"
                },
                {
                    name: "FSI_RX_NO_ERROR_CHECK",
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
                ui.rxTriggerValCycles.hidden = hideConfigs;
            }
        },
        {
            name: "rxTriggerValCycles",
            displayName: "Receiver Trigger Value in Cycles",
            default: "4",
            hidden: true,
            description: "Receiver Trigger Value in Cycles",
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
                name: "fsiRxIntXbar0",
                displayName: "FSI RX Interrupt 0 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_RX_INT0",
                },
            });
            modInstances.push({
                name: "fsiRxIntXbar1",
                displayName: "FSI RX Interrupt 1 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_RX_INT1",
                },
            });
        }
    }
    else if(inst.sdkInfra == "HLD")
    {
        if(soc.interruptXbarConfig == true && inst.operMode == "INTERRUPT")
        {
            modInstances.push({
                name: "fsiRxIntXbar0",
                displayName: "FSI RX Interrupt 0 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_RX_INT0",
                },
            });
            modInstances.push({
                name: "fsiRxIntXbar1",
                displayName: "FSI RX Interrupt 1 XBAR",
                moduleName: '/xbar/int_xbar/int_xbar',
                requiredArgs: {
                    parentName: "FSI_RX_INT1",
                },
            });
        }
    }
    if( inst.sdkInfra == "HLD")
    {
        modInstances.push({
            name: "child",
            moduleName: '/drivers/fsi_rx/v0/fsi_rx_v0_template_hld',
            },
        );
    }
    else
    {
        modInstances.push({
            name: "child",
            moduleName: '/drivers/fsi_rx/v0/fsi_rx_v0_template',
            },
        );
    }

    return (modInstances);
}

exports = fsi_rx_module;
