let common = system.getScript("/common");
let soc = system.getScript(`/sdl/ccm/soc/sdl_ccm_${common.getSocName()}`);
let esm = system.getScript(`/sdl/esm/esm`);

function getConfigArr() {
    return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === moduleInstance.instance);

    return config;
};

function validate(instance, report) {
    var moduleInstances = instance.$module.$instances;
    let instConfig = getInstanceConfig(instance);

    for(var i = moduleInstances.length; i-- > 0; ) {
        if (instance.instance === moduleInstances[i].instance && instance !== moduleInstances[i]) {
            report.logError("Resource conflict",instance);
        }
    }
            
    if (instance.esmConfig.instance != instConfig.esmInst) {
        report.logError("ESM Instance "+instConfig.esmInst+ " must be configured",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtBUSMON) != true) {
        report.logError("ESM event "+instConfig.esmEvtBUSMON+ " must be enabled",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtCMP) != true) {
        report.logError("ESM event "+instConfig.esmEvtCMP+ " must be enabled",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtCPUMis) != true) {
        report.logError("ESM event "+instConfig.esmEvtCPUMis+ " must be enabled",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtVIM) != true) {
        report.logError("ESM event "+instConfig.esmEvtVIM+ " must be enabled",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtLSCMP) != true) {
        report.logError("ESM event "+instConfig.esmEvtLSCMP+ " must be enabled",instance);
    }
    if(common.getSocName() == "am263px")
    {
        if (instance.esmConfig.instance != instConfig.esmInst) {
            report.logError("ESM Instance "+instConfig.esmInst+ " must be configured",instance);
        }  
        else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtTMU) != true) {
            report.logError("ESM event "+instConfig.esmEvtTMU+ " must be enabled",instance);
        }
        else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtRL2) != true) {
            report.logError("ESM event "+instConfig.esmEvtRL2+ " must be enabled",instance);
        }
    }
}

function getConfigurables(inst)
{
    let config = [];

    config.push(common.ui.makeInstanceConfig(getConfigArr()));

    return config;
}

function addModuleInstances(instance){
    let modInstances = new Array();

    modInstances.push({
        name: "esmConfig",
        displayName: "ESM Module Configuration",
        moduleName: '/sdl/esm/esm',
    });

    return (modInstances);
}

let ccm_module_name = "/sdl/ccm/ccm";
let ccm_module = {
    displayName: "CCM",
    longDescription:
`The Compute Compare Module (CCM) is the R5F sub-system’s implementation for the lockstep error detection logic. The R5F sub-system, when bootstrapped to lockstep mode, has a logic that compares the outputs of the two cores and asserts an interrupt whenever an error is detected. There is also a logic to test the comparison logic.`,

    templates: {
        "/sdl/sdl/ti_sdl_config.h.xdt": {
            module_init_config: "/sdl/ccm/templates/sdl_ccm_config.h.xdt",
            moduleName: ccm_module_name,
        },
        "/sdl/sdl/ti_sdl_config.c.xdt": {
            module_init_config: "/sdl/ccm/templates/sdl_ccm_config.c.xdt",
            module_init: "/sdl/ccm/templates/sdl_ccm_init.c.xdt",
            moduleName: ccm_module_name,
        },
    },

    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_CCM",

    config: getConfigurables(),

    moduleStatic: {
        modules: function(instance) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    sharedModuleInstances: addModuleInstances,
    validate: validate,
    getInstanceConfig,
};

exports = ccm_module;
