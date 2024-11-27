let common = system.getScript("/common");
let soc = system.getScript(`/sdl/stc/soc/sdl_stc_${common.getSocName()}`);

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
}

function getConfigurables(inst)
{
    let config = [];

    config.push(common.ui.makeInstanceConfig(getConfigArr()));

    config.push(
        {
            name: "intervalNum",
            displayName: "Interval Num",
            default: "STC_MSS_INTERVAL_NUM",
        },
        {
            name: "lpScanMode",
            displayName: "Scan Mode Config - lpScanMode",
            default: "STC_MSS_LP_SCAN_MODE",
        },
        {
            name: "codecSpreadMode",
            displayName: "Scan Mode Config - codecSpreadMode",
            default: "STC_MSS_CODEC_SPREAD_MODE",
        },
        {
            name: "capIdleCycle",
            displayName: "Scan Mode Config - capIdleCycle",
            default: "STC_MSS_CAP_IDLE_CYCLE",
        },
        {
            name: "scanEnHighCap_idleCycle",
            displayName: "Scan Mode Config - scanEnHighCap_idleCycle",
            default: "STC_MSS_SCANEN_HIGH_CAP_IDLE_CYCLE",
        },
        {
            name: "maxRunTime",
            displayName: "Max Run Time",
            default: "STC_MSS_MAX_RUN_TIME",
        },
        {
            name: "clkDiv",
            displayName: "Clock Div",
            default: "STC_MSS_CLK_DIV",
        },
        {
            name: "romStartAddress",
            displayName: "ROM Start Address",
            default: "STC_ROM_START_ADDRESS",
        },
        {
            name: "pRomStartAdd",
            displayName: "Pointer of ROM Start Address",
            default: "STC_pROM_START_ADDRESS",
        },
    );

    return config;
}

let stc_module_name = "/sdl/stc/stc";
let stc_module = {
    displayName: "STC",
    longDescription:
`The Self-Test Controller (STC) is used to test logic cores based on the On-Product Multiple Input Signature Register (OPMISR) scan compression architecture.
`,

    templates: {
        "/sdl/sdl/ti_sdl_config.h.xdt": {
            module_init_config: "/sdl/stc/templates/sdl_stc_config.h.xdt",
            moduleName: stc_module_name,
        },
        "/sdl/sdl/ti_sdl_config.c.xdt": {
            module_init_config: "/sdl/stc/templates/sdl_stc_config.c.xdt",
            moduleName: stc_module_name,
        },
    },

    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_STC",

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
};

exports = stc_module;
