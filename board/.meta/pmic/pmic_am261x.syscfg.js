
let common = system.getScript("/common");

let pmic_devices = [
    {
        name        : "TPS65036xx",
        type        : "I2C",
        instance    : "I2C0",
        deviceType  : "PMIC_DEV_BB_TPS65036X",
        instType    : "PMIC_MAIN_INST",
        commMode    : "PMIC_INTF_I2C",
    },
];

function getConfigArr() {
    return pmic_devices;
}

exports = {
    getConfigArr,
};