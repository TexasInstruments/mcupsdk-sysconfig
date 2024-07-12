let common = system.getScript("/common");
let soc = system.getScript(`/drivers/pruicss/soc/icss_intc_${common.getSocName()}`);

function getInstanceConfig(moduleInstance) {
    return {
        ...moduleInstance
    }
}

function defaultRxIntcMap(icssInstance, pruCore) {
    if(icssInstance === "ICSSG0")
    {
        if(pruCore === "PRU0")
            return "16";
        else if(pruCore === "PRU1")
            return "17";
    }
    else if(icssInstance === "ICSSG1")
    {
        if(pruCore === "PRU0")
            return "18";
        else if(pruCore === "PRU1")
            return "19";
    }
    return "20";
}

function defaultTxIntcMap(icssInstance, pruCore) {
    if(icssInstance === "ICSSG0")
    {
        if(pruCore === "PRU0")
            return "31";
        else if(pruCore === "PRU1")
            return "30";
    }
    else if(icssInstance === "ICSSG1")
    {
        if(pruCore === "PRU0")
            return "29";
        else if(pruCore === "PRU1")
            return "28";
    }
    return "27";
}

function moduleInstances(instance) {
    let modInstances = new Array();

    // Interrupt Mapping:
    if (instance.interruptRx) {
        // only enable options that are used for PRU IPC
        let allEventOptions = soc.getEventConfigOptions(instance.icssInstance);
        let options = soc.getDisabledOptionsMtoN(allEventOptions, 0, 15, 'Not compatible');
        options.push(...soc.getDisabledOptionsMtoN(allEventOptions, 32, 154, 'Not compatible'));
        let eventDisabledOptions = JSON.stringify(options);

        let allHostOptions = soc.getHostConfigOptions();
        options = soc.getDisabledOptionsMtoN(allHostOptions, 0, 1, 'Not compatible');
        options.push(...soc.getDisabledOptionsMtoN(allHostOptions, 10, 19, 'Not compatible'));
        let hostDisabledOptions = JSON.stringify(options);

        let submodule = "/drivers/pruicss/icss_intc/";
        if(instance.icssInstance === "ICSSG0")
            submodule += "icss0_intc_mapping";
        else if(instance.icssInstance === "ICSSG1")
            submodule += "icss1_intc_mapping";
        modInstances.push({
            name: "rxIntcMapping",
            displayName: instance.icssInstance + " INTC For Interrupt From PRU",
            moduleName: submodule,
            collapsed: false,
            args :{
                event: defaultRxIntcMap(instance.icssInstance, instance.pruCore),
            },
            requiredArgs: {
                eventDisabledOptions,
                hostDisabledOptions,
            },
        });
    }
    if (instance.interruptTx) {
        // only enable options that are used for PRU IPC
        let allHostOptions = soc.getHostConfigOptions();
        let options = soc.getDisabledOptionsMtoN(allHostOptions, 2, 19, 'Not compatible');
        let hostDisabledOptions = JSON.stringify(options, null, 4);

        let submodule = "/drivers/pruicss/icss_intc/";
        if(instance.icssInstance === "ICSSG0")
            submodule += "icss0_intc_mapping";
        else if(instance.icssInstance === "ICSSG1")
            submodule += "icss1_intc_mapping";
        modInstances.push({
            name: "txIntcMapping",
            displayName: instance.icssInstance + " INTC For Interrupt To PRU",
            moduleName: submodule,
            collapsed: false,
            args: {
                event: defaultTxIntcMap(instance.icssInstance, instance.pruCore),
                channel: "0",
            },
            requiredArgs: {
                hostDisabledOptions,
            },
        });
    }

    return (modInstances);
}

function getIcssInstance()
{
    if(common.getSelfSysCfgCoreName().substring(5,7) == "g0")
    {
            return "ICSSG0";
    }
    else
    {
            return "ICSSG1";
    } 
}

function getPruCore()
{

    let cpu = common.getSelfSysCfgCoreName();

    if(cpu.match(/rtu_pru0/))
    {
        return "RTU_PRU0";  
    }
    if(cpu.match(/rtu_pru1/))
    {
        return "RTU_PRU1";  
    }
    if(cpu.match(/tx_pru0/))
    {
        return "TX_PRU0";  
    }
    if(cpu.match(/tx_pru1/))
    {
        return "TX_PRU1";  
    }
    if(cpu.match(/pru0/))
    {
        return "PRU0";    
    }
    if(cpu.match(/pru1/))
    {
        return "PRU1";  
    }
}

let r5f_pru_ipc_top_module_name = "/pru_io/pru_ipc/pru_ipc";

let pru_ipc_top_module = {
    displayName: "PRU IPC",
    
    templates: {
        "/pru_io/common/pru_io_config.inc.xdt": {
            pru_io_config: "/pru_io/pru_ipc/templates_pru/pru_ipc_config.inc.xdt",
            moduleName: r5f_pru_ipc_top_module_name,
        },
    },

    defaultInstanceName: "CONFIG_PRU_IPC",

    longDescription: "IPC configuration between R5F and PRU core is handled on R5F sysconfig, use system project to generate constants required by PRU",

    config : [
        {
            name: "r5fCore",
            displayName: "R5F Core",
            default: "r5fss0-0",
            description: "Select r5fcore syconfig context where ipc configuration of current pru core is configured",
            options: [
                {
                    name: "r5fss0-0",
                },
                {
                    name: "r5fss0-1",
                },
                {
                    name: "r5fss1-0",
                },
                {
                    name: "r5fss1-1",
                }
            ],
        },
    ],
    validate,
    getIcssInstance,
    getPruCore
}

let r5f_ipc_top_module = {
    displayName: "PRU IPC",

    templates: {
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/pru_io/pru_ipc/templates_r5f/pru_ipc.h.xdt",
            moduleName: r5f_pru_ipc_top_module_name,
        },
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/pru_io/pru_ipc/templates_r5f/pru_ipc_config.c.xdt",
            moduleName: r5f_pru_ipc_top_module_name,
        },
    },

    defaultInstanceName: "CONFIG_PRU_IPC",
    longDescription: "PRU IPC module to configure APIs for transferring data between specified PRU core and current R5F core",
    config: [
        {
            name: "icssInstance",
            displayName: "ICSSG Instance",
            default: "ICSSG0",
            options: [
                {
                    name: "ICSSG0",
                },
                {
                    name: "ICSSG1",
                },
            ],
        },
        {
            name: "pruCore",
            displayName: "PRU Core",
            default: "PRU0",
            options: [
                {
                    name: "PRU0",
                },
                {
                    name: "PRU1",
                },
                {
                    name: "RTU_PRU0",
                },
                {
                    name: "RTU_PRU1",
                },
                {
                    name: "TX_PRU0",
                },
                {
                    name: "TX_PRU1",
                },
            ],
        },
        {
            name: "dataSize",
            displayName: "Data Packet Size",
            description: "Size of data packets in bytes",
            default: "4",
            options: [
                {
                    name: "1",
                },
                {
                    name: "2",
                },
                {
                    name: "4",
                },
            ],
        },
        {
            name: "blockSize",
            displayName: "Block Size",
            description: "Size of each Block in terms of data packets",
            default: 32,
        },
        {
            name: "noOfBlocks",
            displayName: "No Of Blocks",
            description: "Total Blocks per Buffer",
            default: 4,
        },
        {
            name: "noOfBuffers",
            displayName: "No Of Buffers",
            description: "Total Buffers to reserve for shared memory",
            default: 1,
        },
        {
            name: "interruptRx",
            displayName: "Enable Interrupt On Data Receive",
            default: true,
        },
        {
            name: "interruptTx",
            displayName: "Enable Interrupt To PRU On Data Send",
            default: false,
        },
    ],
    validate,
    getInstanceConfig,
    moduleInstances,
    getIcssInstance,
    getPruCore
};

function validate(inst, report) {
    if((common.getSelfSysCfgCoreName().includes('pru')))
    {
        let r5f_core = inst["r5fCore"], found = 0 ;
        if((_.keys(system.contexts).includes(r5f_core)) && system.contexts[r5f_core].system.modules["/pru_io/pru_ipc/pru_ipc"]){
            /* Go through all pru adc module instances of selected r5fcore */
            let r5f_adc_module = system.contexts[r5f_core].system.modules["/pru_io/pru_ipc/pru_ipc"];
            for(let iterator = 0; iterator<r5f_adc_module.$instances.length;  iterator++)
            {
                let r5f_instance = r5f_adc_module.$instances[iterator];
                if((r5f_instance["pruCore"] == getPruCore()) && (r5f_instance["icssInstance"] == getIcssInstance()))
                {
                    found = 1;
                }
            }
        }else
        {
            report.logError("Selected R5F core context is not found in system project",inst)
        }

        if(found == 0)
        {
            report.logError("No pru adc module found with selected configurations in r5f core context",inst);       
        }
    }
    else{
        common.validate.checkSameFieldName(inst, "pruCore", report);
    }
}

exports = common.getSelfSysCfgCoreName().includes('pru')? pru_ipc_top_module : r5f_ipc_top_module;
