
let common = system.getScript("/common");

const sdlVer = {
    "esm": {
        version: "v2",
    },
    "ccm": {
        version: "v0",
    },
    "dcc": {
        version: "v1",
    },
    "ecc": {
        version: "v1",
    },
};

const topModules_main = [
    "/sdl/esm/esm",
    "/sdl/ccm/ccm",
    "/sdl/dcc/dcc",
    "/sdl/ecc/ecc",
];

const topModules_mcu = [
    "/sdl/esm/esm",
    "/sdl/ccm/ccm",
    "/sdl/dcc/dcc",
    "/sdl/ecc/ecc",
];

function getCpuID() {
    let corename_map = {
        "r5fss0-0" : "CSL_CORE_ID_R5FSS0_0",
        "r5fss0-1" : "CSL_CORE_ID_R5FSS0_1",
    };
    if(common.getSelfSysCfgCoreName().includes("hsm")) {
            corename_map = system.getScript(`/imports/drivers/soc/drivers_${common.getSocName()}_hsm.syscfg.js`).corename_map_hsm;
        }

    return corename_map[common.getSelfSysCfgCoreName()];
}

function getSelfCoreID() {
    let corename_map = {
        "r5fss0-0" : "R5FSS0_CORE0",
        "r5fss0-1" : "R5FSS0_CORE1",
    };

    return corename_map[common.getSelfSysCfgCoreName()];
}

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if(common.getSelfSysCfgCoreName().includes("hsm")) {
            topModules = topModules_mcu;
        }

        return topModules;
    },
    getSdlVer: function(sdlName) {
        return sdlVer[sdlName].version;
    },
    getCpuID,
    getSelfCoreID,
};
