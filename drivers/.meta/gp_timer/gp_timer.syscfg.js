
let common = system.getScript("/common");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

function getModule() {

    let driverVer = soc.getDriverVer("gp_timer");

    return system.getScript(`/drivers/gp_timer/${driverVer}/gp_timer_${driverVer}`);
}

exports = getModule();
