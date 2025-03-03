
let common = system.getScript("/common");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

function getModule() {

    let driverVer = soc.getDriverVer("mcu_pbist");

    return system.getScript(`/drivers/mcu_pbist/${driverVer}/mcu_pbist_${driverVer}`);
}

exports = getModule();
