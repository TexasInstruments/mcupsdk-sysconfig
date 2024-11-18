let common = system.getScript("/common");

const driverVer = {
    "flash": {
        version: "v1",
    },
    "ethphy": {
        version: "am273x",
    },
};

const topModules = [
    "/board/led/led",
    "/board/eeprom/eeprom",
    "/board/flash/flash",
    "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
];

exports = {
    getTopModules: function() {
        return topModules;
    },
    getDriverVer: function(driverName) {
        return driverVer[driverName].version;
    },
};
