
let common = system.getScript("/common");
let soc = system.getScript(`/optiflash/soc/optiflash_${common.getSocName()}`);

function getModule()
{
    let driverVer = soc.getDriverVer("fota");
    return system.getScript(`/optiflash/fota/${driverVer}/fota_${driverVer}`);
}

exports = getModule();