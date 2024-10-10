
let common = system.getScript("/common");

let pmic_devices = [
    {
        name        : "TPS653860xx",
        device      : "BLACKBIRD",
        type        : "MCSPI",
        instance    : "SPI1",
        deviceType  : "PMIC_DEV_BB_TPS65386X",
        instType    : "PMIC_MAIN_INST",
        commMode    : "PMIC_INTF_SPI",
    },
    {
        name        : "TPS65036xx",
        device      : "DERBY",
        type        : "I2C",
        instance    : "I2C0",
        deviceType  : "PMIC_TPS65036X",
        instType    : "PMIC_DEV_MAIN_INST",
        commMode    : "PMIC_INTF_I2C",
        i2cAddr     : "0x60",
    },
];

function getConfigArr() {
    return pmic_devices;
}

exports = {
    getConfigArr,
};