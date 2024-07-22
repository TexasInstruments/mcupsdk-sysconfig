let common = system.getScript("/common");

function getInstanceConfig(moduleInstance) {

    return {
        ...moduleInstance,
    };
};

let hwiConfigLongDesc = `
The initialization for driver porting layer (DPL_init) enables interrupts at the
end of it for virtue of the drivers relying on interrupts being enabled. While
this would be fine in a baremetal/no-rtos scenario, in case of an RTOS based
application, this can create problems, since the DPL_init happens before one
starts the scheduler. Scheduler expects the interrupts not to be enabled before
it starts. To solve this, we are giving an option here whether to enable or
disable the interrupts in DPL. Select this option based on if you're running an
RTOS application or not.
`

let dpl_cfg_module = {
    displayName: "DPL CFG",

    templates: {
        "/kernel/dpl/dpl_config.c.xdt": {
            dpl_config: "/kernel/dpl/dpl_cfg.c.xdt",
        },
    },

    defaultInstanceName: "CONFIG_DPL_CFG",
    maxInstances: 1,

    moduleStatic: {
        config: [
            {
                name: "hwiPEnable",
                displayName: "Enable Interrupts In DPL Init",
                default: true,
                description: `Whether to enable interrupts in DPL initialization`,
                longDescription: hwiConfigLongDesc
            },
        ]
    },
    getInstanceConfig
};

exports = dpl_cfg_module;
