
let common = system.getScript("/common");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

function getModule() {

    let driverVer = soc.getDriverVer("soc_ctrl");

    return system.getScript(`/drivers/soc_ctrl/${driverVer}/soc_ctrl_${driverVer}`);
}

exports = getModule();
