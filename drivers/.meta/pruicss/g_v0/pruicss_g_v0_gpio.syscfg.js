
let common = system.getScript("/common");

let pruicss_top_module_name = "/drivers/pruicss/g_v0/pruicss_g_v0_gpio";

let pruicss_top_module = {
    displayName: "PRU (ICSS) IO Settings",
    defaultInstanceName: "CONFIG_PRU_ICSS_IO",
    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: pruicss_top_module_name,
        },
    },
    config:[
        {
            name: "instance",
            hidden: true,
            default: "ICSSG0",
            options: [
                {
                    name: "ICSSG0",
                },
                {
                    name: "ICSSG1",
                }
            ],
        }
    ],
    moduleInstances,
};

function validate(inst, report) {
    common.validate.checkSameInstanceName(inst, report);
}

function moduleInstances(instance) {
    let device = common.getDeviceName();
    let modInstances = new Array();
    if((device === "am64x-evm") || (device === "am243x-evm") || (device === "am243x-lp"))
    {
        modInstances.push({
            name: "PruGPIO",
            displayName: "PRU (ICSS) GPIO",
            moduleName: '/drivers/pruicss/g_v0/pruicss_g_v0_gpio_gp',
            useArray: true,
            requiredArgs: {
                instance: instance["instance"],
            },
            minInstanceCount: 0,
            defaultInstanceCount: 0,
        });
        modInstances.push({
            name: "PruIepIO",
            displayName: "PRU (ICSS) IEP",
            moduleName: '/drivers/pruicss/g_v0/pruicss_g_v0_gpio_iep',
            useArray: true,
            requiredArgs: {
                instance: instance["instance"],
            },
            minInstanceCount: 0,
            defaultInstanceCount: 0,
        });
        modInstances.push({
            name: "PruEcapIO",
            displayName: "PRU (ICSS) ECAP",
            moduleName: '/drivers/pruicss/g_v0/pruicss_g_v0_gpio_ecap',
            useArray: true,
            requiredArgs: {
                instance: instance["instance"],
            },
            minInstanceCount: 0,
            defaultInstanceCount: 0,
        });
        modInstances.push({
            name: "PruMii_g_rtIO",
            displayName: "PRU (ICSS) MII_G_RT",
            moduleName: '/drivers/pruicss/g_v0/pruicss_g_v0_gpio_mii_g_rt',
            useArray: true,
            requiredArgs: {
                instance: instance["instance"],
            },
            minInstanceCount: 0,
            defaultInstanceCount: 0,
        });
    }

    return (modInstances);
}

exports = pruicss_top_module;