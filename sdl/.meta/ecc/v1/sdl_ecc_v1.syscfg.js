let common = system.getScript("/common");
let soc = system.getScript(`/sdl/ecc/soc/sdl_ecc_${common.getSocName()}`);
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
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtCor) != true) {
        report.logError("ESM event "+instConfig.esmEvtCor+ " must be enabled",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvtUncor) != true) {
        report.logError("ESM event "+instConfig.esmEvtUncor+ " must be enabled",instance);
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

let ecc_module_name = "/sdl/ecc/ecc";
let ecc_module = {
    displayName: "ECC",
    longDescription:
`The ECC (Error Correcting Code) module provides support for programming the ECC Aggregators in the device. The ECC Aggregators provide Single Error Correction (SEC), Double-bit Error Detection (DED), reporting for these events, and a feature to perform error injection. Errors corrected and detected by the ECC Aggregators are reported though ESM events. As such, the ESM module is a dependency for notification of ECC errors via interrupt.
Each ECC Aggregator is connected to multiple endpoints which may be of type RAM wrapper or Interconnect. Some endpoints may be instantiated in the device as "inject-only". For endpoints of this type, the aggregator provides only error injection support and does not provide detection or correction support.
The ECC metadata header file in SDL can be referenced to see which endpoints are "inject-only".
`,

    templates: {
        "/sdl/sdl/ti_sdl_config.h.xdt": {
            module_init_config: "/sdl/ecc/templates/sdl_ecc_config.h.xdt",
            moduleName: ecc_module_name,
        },
        "/sdl/sdl/ti_sdl_config.c.xdt": {
            module_init_config: "/sdl/ecc/templates/sdl_ecc_config.c.xdt",
            module_init: "/sdl/ecc/templates/sdl_ecc_init.c.xdt",
            moduleName: ecc_module_name,
        },
    },

    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_ECC",

    config: getConfigurables(),

    moduleInstances: moduleInstances,

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

/*
 *  ======== moduleInstances ========
 */
function moduleInstances(inst) {
    let modInstances = new Array();

    let instConfig = getInstanceConfig(inst);
    var eccEndpts = instConfig.eccEndpts;
    for (var i = 0; i < eccEndpts.length; i++) {
        modInstances.push({
            name: "eccEpt"+eccEndpts[i].endptNum,
            displayName: eccEndpts[i].name+" ("+eccEndpts[i].endptNum+")",
            moduleName: '/sdl/ecc/v1/sdl_ecc_v1_endpt',
            useArray: false,
            args: {
                endptNum: eccEndpts[i].endptNum,
            }
        });
    }

    return (modInstances);
}

exports = ecc_module;



