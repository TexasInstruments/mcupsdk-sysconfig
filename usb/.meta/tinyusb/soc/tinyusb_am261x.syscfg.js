let common = system.getScript("/common");

let usb_input_clk_freq = 960000000;

const tinyusb_config = [
    {
        name            : "USB0",
        baseAddr        : "CSL_FLASH_CONFIG_REG8_U_BASE",
        dataBaseAddr    : "CSL_FLASH_DATA_REG0_U_BASE",
        inputClkFreq    : usb_input_clk_freq,
        intrNum         : 116,
        clockIds        : [ "SOC_RcmPeripheralId_USB0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_USB0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_CORE_HSDIV0_CLKOUT0",
                clkRate : usb_input_clk_freq,
            },
        ],
    },
];

function getConfigArr() {
    return tinyusb_config;
}

const usb_speeds = [
    {
        name        : "High Speed"
    },
    {
        name        : "Full Speed"
    },
    {
        name        : "Low Speed"
    }
];

function getUsbSpeedArray() {
    return usb_speeds;
}

const usb_class = [
    {
        name        : "CDC",
    },
    {
        name        : "DFU",
    },
    {
        name        : "NCM",
    }
];

function getUsbClassArray() {
    return usb_class;
}

exports = {
    getConfigArr,
    getUsbSpeedArray,
    getUsbClassArray,
};
