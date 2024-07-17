
let common = system.getScript("/common");

const topModules_main = [
    "/usb/tinyusb/tinyusb",
];

const topModules_mcu = [

];

const driverVer = "v1"

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if(common.getSelfSysCfgCoreName().includes("m4f")) {
            topModules = topModules_mcu;
        }

        return topModules;
    },
    getDriverVer: function() {
        return driverVer;
    },
};
