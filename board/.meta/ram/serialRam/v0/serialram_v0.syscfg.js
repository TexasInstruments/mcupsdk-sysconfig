let common = system.getScript("/common");
let soc = system.getScript(`/board/ram/serialRam/soc/serialram_${common.getSocName()}`);

function getDriver(drvName) {
    return system.getScript(`/drivers/${drvName}/${drvName}`);
}

function getInstanceConfig(moduleInstance) {

    return {
        ...moduleInstance,
    };
};
let defaultDevice = soc.getDefaultDevice();

let serialRam_module = {
    displayName: defaultDevice,
    collapsed: false,
    config : getConfigurables(),
    moduleStatic: {
        modules: function(inst) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    validate: validate,
    moduleInstances: moduleInstances,
    getInstanceConfig,
};

function getConfigurables(){
    let config = [];

    config.push(
        {
            name: "sramName",
            displayName: defaultDevice + " Name",
            default: soc.getDefaultPsramName(),
            placeholder: "Type your psram name here",
        },
        {
            name: "sramSize",
            displayName: defaultDevice + " Size In Bytes",
            default: soc.getDefaultPsramConfig().ramSize,
            displayFormat: "dec",
        },
        {
            name: "sramDevcfg",
            displayName: defaultDevice + " Configuration",
            collapsed: true,
            config : [
                {
                    name: "sramDevId",
                    displayName: defaultDevice + " Device ID",
                    default: soc.getDefaultPsramConfig().deviceId,
                },
                {
                    name: "sramManfId",
                    displayName: defaultDevice + " Manufacturer ID",
                    default: soc.getDefaultPsramConfig().manufacturerId,
                },
                {
                    name: "sramCmdRd",
                    displayName: defaultDevice + " Read Command",
                    default: soc.getDefaultPsramConfig().cmdRd,
                },
                {
                    name: "sramCmdWr",
                    displayName: defaultDevice + " Write Command",
                    default: soc.getDefaultPsramConfig().cmdWr,
                },
                {
                    name: "sramCmdReset",
                    displayName: defaultDevice + " Reset Command",
                    default: soc.getDefaultPsramConfig().cmdReset,
                },
                {
                    name: "sramCmdRegRd",
                    displayName: defaultDevice + " Register Read Command",
                    default: soc.getDefaultPsramConfig().cmdRegRd,
                },
                {
                    name: "sramCmdRegWr",
                    displayName: defaultDevice + " Register Write Command",
                    default: soc.getDefaultPsramConfig().cmdRegWr,
                },
                {
                    name: "sramDummyClksRd",
                    displayName: defaultDevice + " Read Dummy Cycles",
                    default: soc.getDefaultPsramConfig().dummyClksRd,
                },
                {
                    name: "sramDummyClksWr",
                    displayName: defaultDevice + " Write Dummy Cycles",
                    default: soc.getDefaultPsramConfig().dummyClksWr,
                },
                {
                    name: "sramDummyClksCmd",
                    displayName: defaultDevice + " Command Dummy Cycles",
                    default: soc.getDefaultPsramConfig().dummyClksCmd,
                },
            ],
        },

    );
    return config;
}

function validate(inst, report) {
    common.validate.checkSameFieldName(inst, "device", report);
}

function moduleInstances(inst) {

    let modInstances = new Array();

    modInstances.push({
        name: "peripheralDriver",
        displayName: "OSPI Driver Configuration",
        moduleName: "/drivers/ospi/ospi",
        useArray: false,
    });

    return (modInstances);
}

exports = serialRam_module;