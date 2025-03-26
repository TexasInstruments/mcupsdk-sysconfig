let common = system.getScript("/common");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

function getModule() {

    let driverVer = soc.getDriverVer("mcu_lbist");

    return system.getScript(`/drivers/mcu_lbist/${driverVer}/mcu_lbist_${driverVer}`);
}

exports = getModule();
