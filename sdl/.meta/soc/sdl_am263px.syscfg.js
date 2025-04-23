
let common = system.getScript("/common");

const sdlVer = {
    "esm": {
        version: "v2",
    },
    "dcc": {
        version: "v1",
    },
    "ecc": {
        version: "v1",
    },
    "ccm": {
        version: "v0",
    },
};

const topModules_main = [
    "/sdl/esm/esm",
    "/sdl/dcc/dcc",
    "/sdl/ecc/ecc",
    "/sdl/ccm/ccm",
];

const topModules_mcu = [
];

function getCpuID() {
    let corename_map = {
        "r5fss0-0" : "CSL_CORE_ID_R5FSS0_0",
        "r5fss0-1" : "CSL_CORE_ID_R5FSS0_1",
        "r5fss1-0" : "CSL_CORE_ID_R5FSS1_0",
        "r5fss1-1" : "CSL_CORE_ID_R5FSS1_1",
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
        "r5fss1-0" : "R5FSS1_CORE0",
        "r5fss1-1" : "R5FSS1_CORE1",
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
