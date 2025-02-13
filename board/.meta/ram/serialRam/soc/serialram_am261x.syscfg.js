let common = system.getScript("/common");

let supported_serialRam_drivers = [
    {
        name: "ospi",
    },
];

let defaultPsramConfig = system.getScript("/board/ram/serialRam/APS12808L-OBMx.json");

function getDriverOptions()
{
    return supported_serialRam_drivers;
}

function getDefaultPsramName()
{
    return "APS12808LOBMx";
}

function getDefaultPsramConfig()
{
    return defaultPsramConfig;
}

function getDefaultDevice()
{
    return "PSRAM";
}
exports = {
    getDriverOptions,
    getDefaultPsramName,
    getDefaultPsramConfig,
    getDefaultDevice,
};