let common = system.getScript("/common");
let soc = system.getScript(`/drivers/mcu_lbist/soc/mcu_lbist_${common.getSocName()}`);

function getInstanceConfig(moduleInstance) {

     return {
        ...moduleInstance,
     };
};

function getConfigurables() {

    let configurables = [
        {
            name: "enableMcuLbist",
            displayName: "Perform LBIST Test On CPU",
            description: `Start MCU LBIST in SDL_lbist_selftest()`,
            default: true,
        },
    ];

    return configurables;
}

function validate(instance, report) {

    if (instance.enableMcuLbist == false)
    {
        report.logError("Enable LBIST", instance, "enableMcuLbist");
    }
}

let mcu_lbist_module = {
    displayName: "MCU_LBIST",

    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_init1: "/drivers/mcu_lbist/templates/mcu_lbist_init.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config1: "/drivers/mcu_lbist/templates/mcu_lbist.h.xdt",
        },
    },
    maxInstances: 1,
    defaultInstanceName: "CONFIG_MCU_LBIST",
    config: getConfigurables(),
    validate: validate,
    moduleStatic: {
        modules: function(instance) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    getInstanceConfig,
};


exports = mcu_lbist_module;

