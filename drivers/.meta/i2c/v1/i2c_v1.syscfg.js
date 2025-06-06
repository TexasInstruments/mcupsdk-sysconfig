let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/i2c/soc/i2c_${common.getSocName()}`);
let hwi = system.getScript("/kernel/dpl/hwi.js");

let globalClockId = soc.getDefaultClkSource();

function getStaticConfigArr() {
    return system.getScript(`/drivers/i2c/soc/i2c_${common.getSocName()}`).getStaticConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let staticConfigArr = getStaticConfigArr();
    let staticConfig = staticConfigArr.find( o => o.name === solution.peripheralName);

    return {
        ...staticConfig,
        ...moduleInstance,
    }
};

function pinmuxRequirements(inst) {
    let interfaceName = getInterfaceName(inst);

    let resources = [];

    resources.push( pinmux.getPinRequirements(interfaceName, "SCL", "I2C Clock Pin"));
    resources.push( pinmux.getPinRequirements(interfaceName, "SDA", "I2C Data Pin"));

    let peripheral = {
        name          : interfaceName,
        displayName   : "I2C Instance",
        interfaceName : interfaceName,
        resources     : resources,
        signalTypes   : {
            sclPin     : ['SCL'],
            sdaPin     : ['SDA'],
        }
    };

    return [peripheral];
}

function getInterfaceName(inst) {

    return soc.getInterfaceName(inst);
}

function getPeripheralPinNames(inst) {

    return [ "SCL", "SDA" ];
}

function getClockEnableIds(inst) {

    if (common.getSocName() == "am273x") {
        let instConfig = getInstanceConfig(inst);
        return instConfig.clockIds;
    }
    else {
        return soc.getClockEnableIds(inst);
    }
}

function getConfigurables()
{
    let config = [];

    config.push(
        {
            name: "bitRate",
            displayName: "Bit Rate",
            default: "400KHZ",
            description: "I2C bitrate",
            options: [
                {
                    name: "100KHZ",
                    displayName: "100 KHz"
                },
                {
                    name: "400KHZ",
                    displayName: "400 KHz"
                },
            ],
        },
        {
            name: "enableIntr",
            displayName: "Enable Interrupt",
            default: true,
            hidden: false,
            onChange: function (inst, ui) {

                if(inst.sdkInfra == "HLD") {
                    let hideConfigs = false;
                    if(inst.enableIntr == false) {
                        hideConfigs = true;
                        inst.transferCallbackFxn = "NULL";
                        inst.transferMode = "BLOCKING";
                        ui.transferCallbackFxn.hidden = true;
                        ui.intrPriority.hidden = true;
                    }
                    else {
                        ui.intrPriority.hidden = false;
                    }
                    ui.transferMode.hidden = hideConfigs;
                }
                else {
                    ui.intrPriority.hidden = true;
                }

            },
            description: "If enabled, Interrupt mode otherwise Polling mode",
        },
        {
            name: "intrPriority",
            displayName: "Interrupt Priority",
            default: 4,
            hidden: false,
            description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
        },
        {
            name: "transferMode",
            displayName: "Transfer Mode",
            default: "BLOCKING",
            hidden: false,
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
            name: "ownTargetAddr",
            displayName: "Own Target Address (0x00 - 0x7F)",
            default: 0x1C,
            hidden: false,
            displayFormat: "hex"
        },
        {
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
                    inst.transferMode = "BLOCKING";
                    inst.transferCallbackFxn = "NULL";
                    ui.transferCallbackFxn.hidden = true;
                    ui.transferMode.hidden = true;

                    ui.intrPriority.hidden = true;
                    ui.enableIntr.hidden = true;
                    if(inst.enableIntr == "NULL") {
                        /* Clear NULL entry as user need to provide a fxn */
                        inst.enableIntr = false;
                    }
                }
                else {
                    ui.enableIntr.hidden = false;
                    if(inst.enableIntr == true) {
                        ui.intrPriority.hidden = false;
                    }
                    else {
                        ui.intrPriority.hidden = false;
                    }
                    ui.transferMode.hidden = false;
                }
            },
            description: "SDK Infra",
        },
    )

    if(soc.isMakeInstanceRequired())
    {
        config.push(common.ui.makeInstanceConfig(getStaticConfigArr()));
    }

    /* Backward Compatibility Configs */
    config.push(
        {
            name: "advanced",
            displayName: "Show Advanced Config",
            default: false,
            hidden: true,
        },
    )

    return config;
}

function getModuleStatic() {

    let config = [];

    config = (
        {
            name: "GROUP_GLOBAL_I2C_CLOCK_CONFIGURATION",
            displayName: "I2C Global Clock Configuration",
            collapsed:false,

            config : [
                {
                    name: "clockSource",
                    displayName: "Clock Source",
                    default: soc.getDefaultClkSource(),
                    description: "Clock Source",
                    // options: gClockSourceOptions,
                    hidden: false,
                    // onChange: function (inst, ui) {
                    //     inst.funcClk = soc.getClockValue(inst.clockSource);
                    //     globalClockId = inst.clockSource;
                    //     globalClockRate = inst.funcClk;
                    // },
                    getValue: () => {
                        globalClockId = soc.getDefaultClkSource()
                        return globalClockId
                    }
                },
                {
                    name: "funcClk",
                    displayName: "Input Clock Frequency (Hz)",
                    default: 48000000,
                    description: "Source Clock Frequency",
                    displayFormat: "dec",
                    hidden: false,
                    getValue: () => {
                        let globalClockRate = soc.getDefaultClockValue()
                        return globalClockRate
                    }
                },
            ],
        }
    )

    return config;
}

let i2c_module_name = "/drivers/i2c/i2c";

function getModuleStaticAll(inst) {

    let moduleStatic;

    if (common.getSocName() == "am273x") {

        moduleStatic = {
            modules: function(inst) {
                return [{
                    name: "system_common",
                    moduleName: "/system_common",
                }]
            },
        }
    }
    else {

        moduleStatic = {

            config: [ getModuleStatic() ],
            modules: function(inst) {
                return [{
                    name: "system_common",
                    moduleName: "/system_common",
                }]
            },
        }
    }

    return moduleStatic;
}

let i2c_module = {
    displayName: "I2C",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: i2c_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: i2c_module_name,
        },
    },
    maxInstances: getStaticConfigArr().length,
    defaultInstanceName: "CONFIG_I2C",
    config: getConfigurables(),
    moduleStatic : getModuleStaticAll(),
    validate : validate,
    moduleInstances: moduleInstances,
    validatePinmux: validatePinmux,
    pinmuxRequirements,
    getInstanceConfig,
    getInterfaceName,
    getPeripheralPinNames,
    getClockEnableIds,
    getClockFrequencies,
    getClockRate,
};

function validate(instance, report) {
    common.validate.checkNumberRange(instance, report, "ownTargetAddr", 0x0, 0x7F, "hex");
    common.validate.checkValidCName(instance, report, "transferCallbackFxn");
    if((instance.transferMode == "CALLBACK") &&
        ((instance.transferCallbackFxn == "NULL") ||
            (instance.transferCallbackFxn == ""))) {
        report.logError("Callback function MUST be provided for callback transfer mode", instance, "transferCallbackFxn");
    }
}

/*
 *  ======== validatePinmux ========
 */
function validatePinmux(instance, report) {
    let instConfig = getInstanceConfig(instance);
    if((instance.enableIntr == true) &&
        (instConfig.name == "MSS_I2CA") &&
            (common.getSelfSysCfgCoreName().includes("c66"))){
        report.logError("Interrupt mode is not supported for this instance", instance, "enableIntr");
    }
}

/*
 *  ======== moduleInstances ========
 */
function moduleInstances(inst) {
    let modInstances = new Array();

    modInstances.push({
        name: "I2C_child",
        moduleName: '/drivers/i2c/v1/i2c_v1_template',
        },
    );

    return (modInstances);
}

function getClockFrequencies(inst) {

    if (common.getSocName() != "am273x") {
        let globalClockRate = 48000000;
        let clockFrequencies = [
            {
                moduleId: "SOC_RcmPeripheralId_I2C",
                clkId   : globalClockId,
                clkRate : globalClockRate,
            },
        ]

        return clockFrequencies;
    }
    else {

        let instConfig = getInstanceConfig(inst);
        return instConfig.clockFrequencies;
    }
}

function getClockRate(inst) {
    if (common.getSocName() != "am273x") {
        let globalClockRate = 48000000;
        return (globalClockRate);
    }
    else {
        let instConfig = getInstanceConfig(inst);
        return instConfig.funcClk;
    }
}

function getModule()
{
    let module = i2c_module;

    if(soc.isFrequencyDefined())
    {
        module.getClockFrequencies = getClockFrequencies;
    }

    return module;
}

exports = getModule();

