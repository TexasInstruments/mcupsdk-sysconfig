
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/usb/tinyusb/soc/tinyusb_${common.getSocName()}`);

const MAX_ALTERNATE_SETTINGS = 8;

function getConfigArr() {
    return system.getScript(`/usb/tinyusb/soc/tinyusb_${common.getSocName()}`).getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === solution.peripheralName);

    return {
        ...config,
        ...moduleInstance,
    };
};

function pinmuxRequirements(instance) {
    let interfaceName = getInterfaceName(instance);

    let resources = [];

    resources.push( pinmux.getPinRequirements(interfaceName, "USB0_DM", "USB0_DM"));
    resources.push( pinmux.getPinRequirements(interfaceName, "USB0_DP", "USB0_DP"));
    resources.push( pinmux.getPinRequirements(interfaceName, "USB0_DRVVBUS", "USB0_DRVVBUS"));

    let peripheral = {
        name          : interfaceName,
        displayName   : "USB",
        interfaceName : interfaceName,
        resources     : resources,
    };

    return [peripheral];
}

function getClockEnableIds(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockIds;
}

function getClockFrequencies(inst) {

    let instConfig = getInstanceConfig(inst);

    return instConfig.clockFrequencies;
}

function getInterfaceName(instance) {
    return "USB0";
}

function getPeripheralPinNames(instance) {
    return [ "USB0_DM" , "USB0_DP", "USB0_DRVVBUS"];
}

let tinyusb_module_name = "/usb/tinyusb/tinyusb";

let tinyusb_module = {
    displayName: "TinyUSB",
    templates: {
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/usb/tinyusb/templates/tinyusb_open_close_config.c.xdt",
            driver_open: "/usb/tinyusb/templates/tinyusb_open.c.xdt",
            driver_close: "/usb/tinyusb/templates/tinyusb_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/usb/tinyusb/templates/tinyusb_open_close.h.xdt",
        },
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: tinyusb_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: tinyusb_module_name,
        },
        "/usb/usb/ti_usb_descriptors.c.xdt": {
            usb_descriptors: "/usb/tinyusb/templates/tinyusb_usb_descriptors.c.xdt",
        },
        "/usb/usb/ti_usb_config.h.xdt": {
            usb_config: "/usb/tinyusb/templates/tinyusb_usb_config.h.xdt",
        },
        
    },
    maxInstances: getConfigArr().length,
    defaultInstanceName: "CONFIG_TINYUSB",
    config: [
        {
            name: "usbMode",
            displayName: "USB Mode",
            default: soc.getUsbSpeedArray()[0].name,
            options: soc.getUsbSpeedArray(),
            description: "Select the USB mode to be used",
        },
        {
            name: "usbClass",
            displayName: "USB Class",
            default: soc.getUsbClassArray()[0].name,
            options: soc.getUsbClassArray(),
            description: "Select the USB class to be selected",
            onChange: onChangeUsbClass,
        },
        {
            name: "deviceDescriptors",
            displayName: "USB Device Descriptors",
            collapsed: false,
            config: 
            [
                {
                    name: "VID",
                    displayName: "Vendor ID (VID)",
                    default: "0x0451",
                    description: "Vendor ID to be used in USB descriptors",
                },
                {
                    name: "PID",
                    displayName: "Product ID (PID)",
                    default: "0x6165",
                    description: "Product ID to be used in USB descriptors",
                },
                {
                    name: "bcdDevice",
                    displayName: "Device Version (BCD)",
                    default: "0x0100",
                    description: "Device version in BCD format to be used in USB descriptors",
                },
                {
                    name: "numConfigurations",
                    displayName: "Number of Configurations",
                    default: 1,
                    description: "Number of configurations to be used in USB descriptors",
                },
            ]
        },
        {
            name: "stringDescriptors",
            displayName: "USB String Descriptors",
            collapsed: false,
            config: 
            [
                {
                    name: "manufacturerName",
                    displayName: "Manufacturer",
                    default: "Texas Instruments, Inc.",
                    description: "Manufacturer name to be used in USB descriptors",
                },
                {
                    name: "serialString",
                    displayName: "Serial Number",
                    default: "01.00.00.01",
                    description: "Serial Number to be used in USB descriptors",
                },
                {
                    name: "productName",
                    displayName: "Product Name",
                    default: "AM261x",
                    description: "Product name to be used in USB descriptors",
                },
            ]
        },
        {
            name: "configDescriptors",
            displayName: "USB Configuration Descriptors",
            collapsed: false,
            config: 
            [
                {
                    name: "numInterfaces",
                    displayName: "Number of Interfaces",
                    default: 1,
                    description: "Number of interfaces to be used in USB configuration descriptors",
                    hidden: true,
                },
                {
                    name: "maxPower",
                    displayName: "Max Power (mA)",
                    default: 100,
                    description: "Maximum power consumption in mA for the USB device",
                    hidden: true,
                },
                {
                    name: "selfPowered",
                    displayName: "Self Powered",
                    default: false,
                    description: "Indicates if the USB device is self-powered or bus-powered",
                    hidden: true,
                },
                {
                    name: "numAlternateSettings",
                    displayName: "Number of Alternate Settings",
                    default: 1,
                    description: "Number of alternate settings for the USB configuration",
                    hidden: true,
                    onChange: onChnagedNumAltSettings(),
                }
            ]
        },
        {
            name: "interfaceDescriptors",
            displayName: "USB Interface Descriptors",
            collapsed: false,
            config: [
                {
                    name: "deviceInterfaceName",
                    displayName: "Interface Name",
                    default: "CDC device",
                    description: "String descriptors for CDC device interface",
                    hidden: false,
                },
                ...generateAlternateSettings(),
                {
                    name: "macAddress",
                    displayName: "MAC Address",
                    default: "02:02:84:6a:96:00",
                    description: "MAC address for NCM class",
                    longDescription: "The first byte should remain as 0x02 to indicate a link-local address",
                    hidden: true,
                },
            ]
        },
    ],
    validate: validate,
    moduleStatic: {
        modules: function(inst) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    getInstanceConfig,
    pinmuxRequirements,
    getInterfaceName,
    getPeripheralPinNames,
    // getClockEnableIds,
    // getClockFrequencies,
    getAlternateSettingsArray,
};

function onChnagedNumAltSettings() {
    return function (instance, ui) {
        if ((instance.numAlternateSettings > 0) && (instance.numAlternateSettings <= 8) && (instance.usbClass == "DFU")) {
            for (let i = 0; i < MAX_ALTERNATE_SETTINGS; i++) {
                if (i < instance.numAlternateSettings) {
                    ui[`alternateSettings${i}`].hidden = false;
                }
                else {
                    ui[`alternateSettings${i}`].hidden = true;
                }
            }
        }
    };
}

function onChangeUsbClass(instance, ui) {
    let usbClass = instance.usbClass;
    if (usbClass === "CDC") {
        instance.deviceInterfaceName = "CDC device";
        instance.numInterfaces = 1;
        hideConfigurationDescriptors(ui, true);
        hideAltSettingsDescriptors(instance, ui, true);
        ui.deviceInterfaceName.hidden = false;
        ui.macAddress.hidden = true;
     }
    else if (usbClass === "DFU") {
        instance.numInterfaces = 1;
        hideConfigurationDescriptors(ui, false);
        hideAltSettingsDescriptors(instance, ui, false);
        ui.deviceInterfaceName.hidden = true;
        ui.macAddress.hidden = true;
    }
    else if (usbClass === "NCM") {
        instance.numInterfaces = 2;
        instance.deviceInterfaceName = "NCM device";
        hideConfigurationDescriptors(ui, false);
        hideAltSettingsDescriptors(instance, ui, true);
        ui.deviceInterfaceName.hidden = false;
        ui.macAddress.hidden = false;
    }
    else {
        hideConfigurationDescriptors(ui, true);
        hideAltSettingsDescriptors(instance, ui, true);
        ui.deviceInterfaceName.hidden = true;
        ui.macAddress.hidden = true;
    }
}

function hideConfigurationDescriptors(ui, state) {
    ui.numInterfaces.hidden = state;
    ui.maxPower.hidden = state;
    ui.selfPowered.hidden = state;
    ui.numAlternateSettings.hidden = state;
}

function hideAltSettingsDescriptors(instance, ui, state) {
    for (let i = 0; i < MAX_ALTERNATE_SETTINGS; i++) {
        if((state) || (i >= instance.numAlternateSettings)) {
            ui[`alternateSettings${i}`].hidden = true;
        }
        else {
            ui[`alternateSettings${i}`].hidden = false;
        }
    }
}

function getAlternateSettingsArray(instance) {
    let alternateSettings = [];
    for (let i = 0; i < MAX_ALTERNATE_SETTINGS; i++) {
        let settingName = `alternateSettings${i}`;
        if (instance[settingName] !== undefined) {
            alternateSettings.push(instance[settingName]);
        }
    }
    return alternateSettings;
}

function generateAlternateSettings() {
    let settings = [];
    for (let i = 0; i < MAX_ALTERNATE_SETTINGS; i++) {
        settings.push({
            name: `alternateSettings${i}`,
            displayName: `Alternate Settings ${i}`,
            default: `DFU Partition ${i}`,
            description: `String descriptors for Alternate settings`,
            hidden: true,
        });
    }
    return settings;
}
/*
 *  ======== validate ========
 */
function validate(instance, report) {
    common.validate.checkSameInstanceName(instance, report);

    if( instance.usbMode != "High Speed"){
        report.logError(`${instance.usbMode} not supported`, instance, "usbMode");
    }

    common.validate.checkNumberRange(instance, report, "numAlternateSettings", 1, MAX_ALTERNATE_SETTINGS, "dec");

    if (/^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/.test(instance.macAddress) == false){
        report.logError(`Invalid Mac Address Entry`, instance, "macAddress");
    }
}


exports = tinyusb_module;
