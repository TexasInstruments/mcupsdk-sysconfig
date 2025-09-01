
let common = system.getScript("/common");

let pruicss_top_module_name = "/drivers/pruicss/m_v0/pruicss_m_v0_gpio";

let device = common.getDeviceName();
let is_am263x_soc = (device === "am263x-cc") ? true : false;
let is_am263px_soc = (device === "am263px-cc") ? true : false;
let is_am261x_soc = (device === "am261x-lp" || device === "am261x-som") ? true : false;

let pruicss_top_module = {
    displayName: "PRU (ICSS) IO Settings",

    templates: {
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: pruicss_top_module_name,
        },
    },

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
            hidden:true
        },
    ],

    defaultInstanceName: "CONFIG_PRU_ICSS_IO",
    moduleInstances,
};

function validate(inst, report) {
    common.validate.checkSameInstanceName(inst, report);
}

function moduleInstances(instance) {
    let modInstances = new Array();
    if(is_am263x_soc || is_am263px_soc || is_am261x_soc){
        modInstances.push({
            name: "PruGPIO",
            displayName: "PRU (ICSS) GPIO",
            moduleName: '/drivers/pruicss/m_v0/pruicss_m_v0_gpio_gp',
            useArray: true,
            minInstanceCount: 0,
            defaultInstanceCount: 0,
            requiredArgs: {
                instance: instance["instance"],
            }
        });
        modInstances.push({
            name: "PruIepIO",
            displayName: "PRU (ICSS) IEP",
            moduleName: '/drivers/pruicss/m_v0/pruicss_m_v0_gpio_iep',
            useArray: true,
            minInstanceCount: 0,
            defaultInstanceCount: 0,
            requiredArgs: {
                instance: instance["instance"],
            }
        });
        modInstances.push({
            name: "PruUartIO",
            displayName: "PRU (ICSS) UART",
            moduleName: '/drivers/pruicss/m_v0/pruicss_m_v0_gpio_uart',
            useArray: true,
            minInstanceCount: 0,
            defaultInstanceCount: 0,
            requiredArgs: {
                instance: instance["instance"],
            }
        });
    }
    return (modInstances);
}

exports = pruicss_top_module;
