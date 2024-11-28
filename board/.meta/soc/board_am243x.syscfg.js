
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
        version: "am243x",
    },
};

const topModules = [
    "/board/eeprom/eeprom",
    "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
    "/board/ethphy/ethphy",
    "/board/flash/flash",
    "/board/led/led",
];

const topModules_alv = [
    "/board/ram/ram",
];

exports = {
    getTopModules: function() {

        let topModules_main = topModules;
        if(common.getSocPackage() == "ALV") {
            topModules_main = topModules_main.concat(topModules_alv);
        }
        return topModules_main;
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
