
let common = system.getScript("/common");
let soc = system.getScript(`/usb/soc/usb_${common.getSocName()}`);

function getModule() {

    let driverVer = soc.getDriverVer();

    return system.getScript(`/usb/tinyusb/${driverVer}/tinyusb_${driverVer}`);
}

exports = getModule();
