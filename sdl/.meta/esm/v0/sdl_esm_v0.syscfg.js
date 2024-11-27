let common = system.getScript("/common");
let soc = system.getScript(`/sdl/esm/soc/sdl_esm_${common.getSocName()}`);

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
    /* Check if high and low prio set for same event */
    for(var i = 0; i < instance.hiPrioEvts.length; i++) {
        for(var j = 0; j < instance.loPrioEvts.length; j++) {
            if (instance.hiPrioEvts[i] == instance.loPrioEvts[j]) {
                report.logError("ESM Event "+instance.hiPrioEvts[i]+" cannot be set to both high and low priority", instance);
            }
        }
    }
}

function isEsmEvtEnabled(instance, esmEvent) {
    let found = false;

    /* Check if high and low prio set for same event */
    for(var i = 0; i < instance.hiPrioEvts.length; i++) {
        if (esmEvent == instance.hiPrioEvts[i]) {
            found = true;
	}
    }
    for(var i = 0; i < instance.loPrioEvts.length; i++) {
        if (esmEvent == instance.loPrioEvts[i]) {
            found = true;
        }
    }

    return found;
}

function getEvtName(instance, esmEvent) {
    let instConfig = getInstanceConfig(instance);
    let esmName = "";

    for(var i = 0; i < instConfig.esmEvents.length; i++) {
        if (instConfig.esmEvents[i].eventNum == esmEvent) {
            esmName = instConfig.esmEvents[i].name;
            break;
        }
    }

    return esmName;
}

function getEventOptions(index)
{
    let my_config_arr = getConfigArr();
    let esm_config = [];

    for (var i = 0; i < my_config_arr[index].esmEvents.length; i++) {
        let evt_config = {
                name : my_config_arr[index].esmEvents[i].name,
        };
        esm_config.push(evt_config);
    }

    return esm_config;
}

function getConfigurables()
{
    let config = [];
    let my_config_arr = getConfigArr();

    config.push(common.ui.makeInstanceConfig(getConfigArr()));

    config.push(
        {
            name: "esmCallback",
            displayName: "Callback for ESM Events",
            description: "Make sure a function with the name specified here is implemented and linked in to the application",
            default: "NULL",
        },
        {
            name: "esmCallbackArgs",
            displayName: "Callback for ESM Events Arguments",
            description: "Make sure there is a initialized global variable pointer which points to the desired callback argument",
            default: "NULL",
        },
    );

    config.push(
        {
            name: "hiPrioEvts",
            displayName: "High Priority Events",
            default: [],
            minSelections: 0,
            options: function(inst) {
                let instConfig = getInstanceConfig(inst);
                return getEventOptions(instConfig.esmIdx);
            }
	},
        {
            name: "loPrioEvts",
            displayName: "Low Priority Events",
            default: [],
            minSelections: 0,
            options: function(inst) {
                let instConfig = getInstanceConfig(inst);
                return getEventOptions(instConfig.esmIdx);
            }
        },
        {
            name: "errPinEvts",
            displayName: "Error Pin Events",
            default: [],
            minSelections: 0,
            options: function(inst) {
                let instConfig = getInstanceConfig(inst);
                return getEventOptions(instConfig.esmIdx);
            }
        },

    );

    return config;
}

let esm_module_name = "/sdl/esm/esm";
let esm_module = {
    displayName: "ESM",
    longDescription:
`The Error Signaling Module (ESM) aggregates safety-related events and/or errors resulting from diagnostics from throughout the device into one location that can be monitored internally or externally.
Individual events can be configured to generate an interrupt, or trigger the error pin, or both.

A callback should be provided which will be used by the ESM module to notify the application when an ESM error interrupt has occurred.
`,

    templates: {
        "/sdl/sdl/ti_sdl_config.h.xdt": {
            module_init_config: "/sdl/esm/templates/sdl_esm_config.h.xdt",
            moduleName: esm_module_name,
        },
        "/sdl/sdl/ti_sdl_config.c.xdt": {
            module_init_config: "/sdl/esm/templates/sdl_esm_config.c.xdt",
            module_init_early: "/sdl/esm/templates/sdl_esm_init.c.xdt",
            moduleName: esm_module_name,
        },
    },

    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_ESM",

    config: getConfigurables(),

    moduleStatic: {
        modules: function(instance) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    validate: validate,
    getInstanceConfig,
    isEsmEvtEnabled,
    getEvtName,
};

exports = esm_module;



