
let common = system.getScript("/common");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

if(common.getSocName() == 'f29h85x')
{
    exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
        displayName: "TI Drivers",
        templates: [
            {
                name: "/drivers/system/system_config.c.xdt",
                outputPath: "ti_drivers_config.c",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/system_config.h.xdt",
                outputPath: "ti_drivers_config.h",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/drivers_open_close.c.xdt",
                outputPath: "ti_drivers_open_close.c",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/drivers_open_close.h.xdt",
                outputPath: "ti_drivers_open_close.h",
                alwaysRun: true,
            },
        ],
        topModules: soc.getTopModules(),
    };
}
else
{
    exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
        displayName: "TI Drivers",
        templates: [
            {
                name: "/drivers/system/system_config.c.xdt",
                outputPath: "ti_drivers_config.c",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/system_config.h.xdt",
                outputPath: "ti_drivers_config.h",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/drivers_open_close.c.xdt",
                outputPath: "ti_drivers_open_close.c",
                alwaysRun: true,
            },
            {
                name: "/drivers/system/drivers_open_close.h.xdt",
                outputPath: "ti_drivers_open_close.h",
                alwaysRun: true,
            },
            {
                name: "/drivers/pinmux/pinmux_config.c.xdt",
                outputPath: "ti_pinmux_config.c",
                alwaysRun: true,
            },
            {
                name: "/drivers/pinmux/pinmux.csv.xdt",
                outputPath: "pinmux.csv",
                alwaysRun: common.getSocName().includes('am26'),
            },
            {
                name: "/drivers/system/power_clock_config.c.xdt",
                outputPath: "ti_power_clock_config.c",
                alwaysRun: true,
            },
            {
                name: "/clockTree/templates/ti_clocktree_pll_config.c.xdt",
                outputPath: "ti_clocktree_pll_config.c",
                alwaysRun: false,
            },
			{
                name: "/clockTree/templates/ti_clocktree_pll_config.h.xdt",
                outputPath: "ti_clocktree_pll_config.h",
                alwaysRun: false,
            }
        ],
        topModules: soc.getTopModules(),
    };
}