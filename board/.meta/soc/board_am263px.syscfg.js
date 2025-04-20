
let common = system.getScript("/common");

const driverVer = {
    "flash": {
        version: "v2",
    },
    "ethphy": {
        version: "am263px",
    },
};

const topModules_main = [
      "/board/eeprom/eeprom",
      "/board/led/led",
      "/board/flash/flash",
      "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
      "/board/ethphy/ethphy",
      "/board/ioexp/ioexp",
      "/board/pmic/pmic"
];
const topModules_mcu = [
];

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if(common.getSelfSysCfgCoreName().includes("hsm")) {
            topModules = topModules_mcu;
        }

        return topModules;
    },
    getDriverVer: function(driverName) {
        return driverVer[driverName].version;
    },
};
