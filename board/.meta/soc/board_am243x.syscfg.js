
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
};

const topModules = [
    "/board/eeprom/eeprom",
    "/board/ethphy/ethphy",
    "/board/flash/flash",
    "/board/ram/ram",
    "/board/led/led",

];

exports = {
    getTopModules: function() {
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
