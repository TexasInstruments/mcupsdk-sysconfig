
let common = system.getScript("/common");
let soc = system.getScript(`/usb/soc/usb_${common.getSocName()}`);

exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
    displayName: "USB",
    topModules: soc.getTopModules(),
};
