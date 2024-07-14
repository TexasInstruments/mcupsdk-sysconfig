
let common = system.getScript("/common");

const driverVer = {
    "bootloader": {
        version: "v0",
    },
    "ddr": {
        version: "v0",
    },
    "gpio": {
        version: "v0_1",
    },
    "i2c": {
        version: "v0",
    },
    "ipc": {
        version: "v0",
    },
    "pcie": {
        version: "v0",
    },
    "uart": {
        version: "v0",
    },
    "udma": {
        version: "v0",
    },
};

const topModules = [
    "/drivers/bootloader/bootloader",
    "/drivers/ddr/ddr",
    "/drivers/gpio/gpio",
    "/drivers/i2c/i2c",
    "/drivers/ipc/ipc",
    "/drivers/pcie/pcie",
    "/drivers/uart/uart",
    "/drivers/udma/udma",
];

function getCpuID() {
    let corename_map = {
        "r5fss0-0" : "CSL_CORE_ID_R5FSS0_0",
        "r5fss0-1" : "CSL_CORE_ID_R5FSS0_1",
    };

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
        return topModules;
    },
    getDriverVer: function(driverName) {
        return driverVer[driverName].version;
    },
    getCpuID,
    getSelfCoreID,
};
