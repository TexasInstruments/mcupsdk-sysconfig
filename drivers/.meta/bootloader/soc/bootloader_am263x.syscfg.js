let common = system.getScript("/common");

const bootloader_config_r5fss = [
    {
        name            : "BOOTLOADER0",
    },
];

const bootloader_bootmedia = [

    { name: "FLASH", displayName: "Flash" },
    { name: "MEM", displayName: "SOC Memory" },
    { name: "BUFIO", displayName: "Buffered IO Device (UART)"},
];

const bootloader_operatingmode = [

    { name: "Lockstep", displayName: "Lockstep" },
    { name: "Standalone", displayName: "Standalone" },
];

const image_format = [
    { name: "RPRC", displayName: "RPRC Image"},
    { name: "MCELF", displayName: "Multicore ELF"},
];

function getDefaultConfig()
{
    return bootloader_config_r5fss[0];
}

function getConfigArr() {

    return bootloader_config_r5fss;
}

function getBootMediaArr() {

	return bootloader_bootmedia;
}

function getOperatingMode(){
    return bootloader_operatingmode;
}

function getImageFormat(){
    return image_format;
}

exports = {
    getDefaultConfig,
    getConfigArr,
    getBootMediaArr,
    getOperatingMode,
    getImageFormat,
};



