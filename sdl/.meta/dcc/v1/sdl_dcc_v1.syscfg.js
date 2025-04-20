let common = system.getScript("/common");
let soc = system.getScript(`/sdl/dcc/soc/sdl_dcc_${common.getSocName()}`);
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
            report.logError("Resource conflict", instance);
        }
    }

    if (instance.esmConfig.instance != instConfig.esmInst) {
        report.logError("ESM Instance "+instConfig.esmInst+ " must be configured",instance);
    }
    else if (esm.isEsmEvtEnabled(instance.esmConfig, instConfig.esmEvent) != true) {
        report.logError("ESM event "+instConfig.esmEvent+ " must be enabled",instance);
    }

    if (instance.clkSrc0ValidSeed < 4) {
        report.logError("Clk0 Valid Seed Value must not be 4 or greater",instance);
    }
    if (instance.clkSrc0Seed == 0 || instance.clkSrc1Seed == 0)
    {
        report.logError("Clk0 Seed and Clk1 Seed must be greater than 0", instance);
    }
}

let dcc_mode_options = [
    {
        name: "Continuous",
        displayName: "Continuous",
    },
    {
        name: "Single-shot",
        displayName: "Single-Shot",
    },
];

function getConfigurables(inst)
{
    let config = [];

    config.push(common.ui.makeInstanceConfig(getConfigArr()));

    config.push(
        {
            name: "mode",
            displayName: "DCC Mode",
            default: "Continuous",
            options: dcc_mode_options,
            onChange: function (inst, ui) {
                if(inst.mode == "Continuous") {
                    ui.callback.hidden = true;
                    ui.callbackArg.hidden = true;
                    ui.oneShotInsts.hidden = true;
                }
                else {
                    ui.callback.hidden = false;
                    ui.callbackArg.hidden = false;
                    ui.oneShotInsts.hidden = false;
                }
            },
        },
        {
            name: "callback",
            displayName: "DCC Done Interrupt Callback",
            default: "NULL",
            hidden: true,
        },
        {
            name: "callbackArg",
            displayName: "DCC Done Interrupt Callback Arg",
            default: "NULL",
            hidden: true,
        },
        {
            name: "oneShotInsts",
            displayName: "One Shot Instance",
            description: "In one-shot mode, the DCC can be re-programmed to test another clock once one test is completed. Enter the number of combinations that will be tested with this DCC instance.",
            default: 1,
            displayFormat: "dec",
            hidden: true,
        },
    );

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

let dcc_module_name = "/sdl/dcc/dcc";
let dcc_module = {
    displayName: "DCC",
    longDescription:
`The Dual Clock Comparator (DCC) is used to determine the accuracy of a clock signal during the time execution of an application. DCC is designed to detect drifts from the expected clock frequency.
Each DCC instance supports using clocks in the device as sources for clk1 and clk2. Which clocks may be selected depends on the instance. DCC can be configured to run in continuous or single-shot mode. If configured for continuous mode, then it will continue to run, comparing until an error event occurs. In single-shot mode, it will run for a programmed number of cycles and will generate either a Done or Error event. If an instance is used in single-shot mode, then the DCC instance can be configured to cycle through several clock source combinations.
`,

    templates: {
        "/sdl/sdl/ti_sdl_config.h.xdt": {
            module_init_config: "/sdl/dcc/templates/sdl_dcc_config.h.xdt",
            moduleName: dcc_module_name,
        },
        "/sdl/sdl/ti_sdl_config.c.xdt": {
            module_init_config: "/sdl/dcc/templates/sdl_dcc_config.c.xdt",
            module_init: "/sdl/dcc/templates/sdl_dcc_init.c.xdt",
            moduleName: dcc_module_name,
        },
    },

    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_DCC",

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
    let dccIndex = instConfig.index;

    if (inst.mode == "Continuous")
    {
        modInstances.push({
            name: "clkSrc0",
            displayName: "Clock Sources",
            moduleName: '/sdl/dcc/v1/sdl_dcc_v1_clksrc',
            useArray: false,
            requiredArgs: {
                dccIndex,
	    }
        });
    }
    else
    {
        for(var i = 0; i < inst.oneShotInsts; i++)
        {
            modInstances.push({
                name: "clkSrc"+i,
                displayName: "Clock Sources "+i,
                moduleName: '/sdl/dcc/v1/sdl_dcc_v1_clksrc',
                useArray: false,
                requiredArgs: {
                    dccIndex,
                }
            });
        }
    }

    return (modInstances);
}

exports = dcc_module;
