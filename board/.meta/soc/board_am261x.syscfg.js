
let common = system.getScript("/common");

const driverVer = {
    "flash": {
        version: "v2",
    },
    "ethphy": {
        version: "am261x",
    },
};

const topModules_main = [
      "/board/eeprom/eeprom",
      "/board/led/led",
      "/board/flash/flash",
      "/board/ethphy_cpsw_icssg/ethphy_cpsw_icssg",
      "/board/ethphy/ethphy",
      "/board/pmic/pmic",
      "/board/ioexp/ioexp"
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
