
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");

let device = common.getDeviceName();
let is_am263x_soc = (device === "am263x-cc") ? true : false;
let is_am263px_soc = (device === "am263px-cc") ? true : false;
let is_am261x_soc = (device === "am261x-lp" || device === "am261x-som") ? true : false;

function getInterfaceName(inst, peripheralName)
{
    if(is_am263px_soc)
    {
        return "PRU-ICSS";
    }
    else if(is_am261x_soc)
    {
        if(inst.instance == "ICSSM0")
        {
            return "PRU-ICSS0"
        }
        if(inst.instance == "ICSSM1")
        {
            return "PRU-ICSS1"
        }
    }
    //assuming default device as am263x
    //NOTE: when new device is supported, logic should be changed
    return "ICSSM";
}

function getPru0MuxMode(inst)
{
    return inst.pru0MuxMode;
}

function getPru1MuxMode(inst)
{
    return inst.pru1MuxMode;
}

function getInterfacePinList(inst, peripheralName)
{
    let interfaceName = getInterfaceName(inst, peripheralName);
    let pinList = [];

    pinList = pinmux.getInterfacePinList(interfaceName);

    return pinList;
}

function getPeripheralRequirements(inst, peripheralName)
{
    let interfaceName = getInterfaceName(inst, peripheralName);
    let pinList = getInterfacePinList(inst, peripheralName);
    let resources = [];
    let device = common.getDeviceName();

    for(let pin of pinList)
    {
        let pinResource = pinmux.getPinRequirements(interfaceName, pin);

        /* make all pins as "tx" and then override to make "rx" as false as needed  */
        pinmux.setConfigurableDefault( pinResource, "rx", false );

        if(pinResource.name!=="PR0_MDIO_MDC" && pinResource.name!=="PR0_MDIO_MDIO" && pinResource.name!=="PR0_ECAP0_APWM_OUT"){
            resources.push( pinResource );
        }

        /* Disable all the pins. */
        pinResource.used=false;

    }

    let peripheralRequirements = {
        name: interfaceName,
        displayName: interfaceName,
        interfaceName: interfaceName,
        resources: resources
    };

    return peripheralRequirements;
}

function pinmuxRequirements(inst) {
    let pru = getPeripheralRequirements(inst, "PRU");
    return [pru];
}

function getInterfaceNameList(inst) {

    return [
        getInterfaceName(inst, "PRU"),
    ];
}

function getPeripheralPinNames(inst)
{
    let pinList = [];
    pinList = pinList.concat(getInterfacePinList(inst, "PRU"));
    return pinList;
}

let pruicss_top_module_name = "/drivers/pruicss/m_v0/pruicss_m_v0_gpio_gp";

let pruicss_top_module = {
    displayName: "PRU (ICSS) GPIO",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: pruicss_top_module_name,
        },
    },

    defaultInstanceName: "CONFIG_PRU_ICSS_GPIO",
    config: [
        {
            name: "instance",
            displayName: "Instance",
            default: "ICSSM0",
            options: [
                {
                    name: "ICSSM0",
                    displayName:"ICSSM0"
                },
                {
                    name: "ICSSM1",
                    displayName:"ICSSM1"
                }
            ],
        },
        {
            name: "pru0MuxMode",
            displayName: "PRU0 Mux Mode",
            default: "0",
            description: "PRU ICSS level mux configuration",
            options: [
                {
                    name: "0",
                    displayName: "GP Mode",
                    description: "General Purpose Input/Output Mode"
                },
                {
                    name: "1",
                    displayName: "3 Channel Peripheral Interface Mode",
                    description: "3 Channel Peripheral Interface Mode"
                },
                {
                    name: "2",
                    displayName: "MII mode",
                    description: "Media Interface Mode"
                },
                {
                    name: "3",
                    displayName: "SD mode",
                    description: "Sigma Delta Mode"
                }
            ]
        },
        {
            name: "pru1MuxMode",
            displayName: "PRU1 Mux Mode",
            default: "0",
            description: "PRU ICSS level mux configuration",
            options: [
                {
                    name: "0",
                    displayName: "GP Mode",
                    description: "General Purpose Input/Output Mode"
                },
                {
                    name: "1",
                    displayName: "3 Channel Peripheral Interface Mode",
                    description: "3 Channel Peripheral Interface Mode"
                },
                {
                    name: "2",
                    displayName: "MII mode",
                    description: "Media Interface Mode"
                },
                {
                    name: "3",
                    displayName: "SD mode",
                    description: "Sigma Delta Mode"
                }
            ]
        }
    ],
    pinmuxRequirements,
    getInterfaceNameList,
    getPeripheralPinNames,
    getPru0MuxMode,
    getPru1MuxMode
};

function validate(inst, report) {
    common.validate.checkSameInstanceName(inst, report);
}

exports = pruicss_top_module;
