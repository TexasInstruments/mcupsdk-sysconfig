
let common = system.getScript("/common");

const driverVer = {
    "flash": {
        version: "v0",
    },
    "parallelRam": {
        version: "v0",
    },
    "ram": {
        version: "v0",
    },
    "ethphy": {
        version: "am64x",
    },
};

const topModules = [
    "/board/eeprom/eeprom",
    "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
    "/board/ethphy/ethphy",
    "/board/flash/flash",
    "/board/ram/ram",
    "/board/led/led",

];

const topModules_a53 = [
    "/board/ram/ram",
    "/board/led/led",
	"/board/flash/flash",
    "/board/eeprom/eeprom",
    "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
];

exports = {
    getTopModules: function() {
        if (common.getSelfSysCfgCoreName().match(/a53*/))
        {
            return topModules_a53;
        }
        return topModules;
    },
    getDriverVer: function(driverName) {
        return driverVer[driverName].version;
    },
    getDriverInstanceValid: function(driverName) {
        let valid = false;
        if(driverName in driverVer)
        {
            valid = true;
        }
        return valid;
    }
};
