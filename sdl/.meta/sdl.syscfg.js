
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

exports = {
    displayName: "SDL",
    templates: [
        {
            name: "/sdl/sdl/ti_sdl_config.c.xdt",
            outputPath: "ti_sdl_config.c",
            alwaysRun: true,
        },
        {
            name: "/sdl/sdl/ti_sdl_config.h.xdt",
            outputPath: "ti_sdl_config.h",
            alwaysRun: true,
        },
    ],
    topModules: soc.getTopModules(),
};
