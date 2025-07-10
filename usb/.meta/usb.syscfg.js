let common = system.getScript("/common");
let soc = system.getScript(`/usb/soc/usb_${common.getSocName()}`);

exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
    displayName: "USB",
    templates : [
        {
            name: "/usb/usb/ti_usb_descriptors.c.xdt",
            outputPath: "ti_usb_descriptor.c",
            alwaysRun: true,
        },
        {
            name: "/usb/usb/ti_usb_config.h.xdt",
            outputPath: "ti_usb_config.h",
            alwaysRun: true,
        }
    ],
    topModules: soc.getTopModules(),
};
