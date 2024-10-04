
let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");

function getInterfaceName(inst, peripheralName)
{
    let device = common.getDeviceName();
    if(device === "am263px-cc")
    {
        return "PRU-ICSS";
    }
    //assuming default device as am263x
    //NOTE: when am261x is supported, logic should be changed
    return inst.instance;
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
        resources: resources,
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
            default: "ICSSM",
            options: [
                {
                    name: "ICSSM",
                    displayName:"ICSSM0"
                },
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
                    displayName: "GP mode",
                    description: "General purpose input/output mode"
                },
                {
                    name: "1",
                    displayName: "3 channel peripheral interface mode",
                    description: "3 channel peripheral interface mode"
                },
                {
                    name: "2",
                    displayName: "MII mode",
                    description: "Media interface mode"
                },
                {
                    name: "3",
                    displayName: "SD mode",
                    description: "Sigma delta mode"
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
                    displayName: "GP mode",
                    description: "General purpose input/output mode"
                },
                {
                    name: "1",
                    displayName: "3 channel peripheral interface mode",
                    description: "3 channel peripheral interface mode"
                },
                {
                    name: "2",
                    displayName: "MII mode",
                    description: "Media interface mode"
                },
                {
                    name: "3",
                    displayName: "SD mode",
                    description: "Sigma delta mode"
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
