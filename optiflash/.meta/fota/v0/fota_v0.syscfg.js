let common = system.getScript("/common");
let soc = system.getScript(`/optiflash/fota/soc/fota_${common.getSocName()}`);

function validate(inst, report)
{

}

exports =
{
    displayName: "Firmware Over-The-Air (fota)",
    defaultInstanceName: "fota",
    config:
    [
        {
            name: "enable",
            displayName: "Enable",
            default: true
        },
        {
            name: "flash_size",
            displayName: "Flash Size (B)",
            default: 0x2000000,
            displayFormat: "hex",
            description: "Size fo flash"
        },
    ],
    validate: validate,
    templates:
    {
        
        "/drivers/system/system_config.h.xdt":
        {
            driver_config: "/optiflash/fota/templates/fota.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt":
        {
            driver_open_close_config: "/optiflash/fota/templates/fota_open_close_config.c.xdt",
            driver_open: "/optiflash/fota/templates/fota_open.c.xdt",
            driver_close: "/optiflash/fota/templates/fota_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt":
        {
            driver_open_close_config: "/optiflash/fota/templates/fota_open_close.h.xdt",
        }
    }
};