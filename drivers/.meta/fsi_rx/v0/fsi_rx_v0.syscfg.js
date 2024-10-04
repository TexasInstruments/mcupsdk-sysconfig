
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
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
    };

    return [peripheral];
}

function getInterfaceName(inst) {
    return soc.getInterfaceName(inst);
}

function getPeripheralPinNames(inst) {
    return [ "CLK", "D0", "D1" ];
}

function validate(instance, report) {
    /* None. Verified by SYSCFG based on selected pin */
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
                }
                else if(inst.sdkInfra == "HLD")
                {
                    ui.intrEnable.hidden = true;
                    ui.operMode.hidden = false;
                    ui.intrPriority.hidden = false;
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
                if((inst.operMode == "DMA")  || (inst.operMode == "POLLED")) {
                    ui.intrPriority.hidden = true;
                }
                if(inst.operMode == "INTERRUPT") {
                    ui.intrPriority.hidden = false;
                }
            },
        },
        {
            name: "intrPriority",
            displayName: "Interrupt Priority",
            default: 4,
            hidden: true,
            description: `Interrupt Priority: 0 (highest)`,
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
