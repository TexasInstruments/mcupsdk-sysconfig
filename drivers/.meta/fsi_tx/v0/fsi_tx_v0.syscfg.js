
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
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
    /* None */
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
            description: "Operation Mode",
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
