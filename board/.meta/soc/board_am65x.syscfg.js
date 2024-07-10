
let common = system.getScript("/common");

const driverVer = {
    "flash": {
        version: "v0",
    },
};

const topModules = [
    "/board/flash/flash",
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
