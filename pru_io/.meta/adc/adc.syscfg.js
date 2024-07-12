// This module shows the basic configurable types that are supported for ADC.
//
let common = system.getScript("/common");

const baseDirName = "/pru_io/adc/"

/*
    ADCs List with reference to their implementation syscfg files
*/
const adcList = {
    "ADS8598H": {
        "AM64xAdapterBoard": baseDirName + "ads85x8/adc_phi_pru_evm_adapter",
        "TandMAdapterBoard": baseDirName + "ads85x8/t_and_m_adapter",
    },
    "ADS8598S": {
        "AM64xAdapterBoard": baseDirName + "ads85x8/adc_phi_pru_evm_adapter",
        "TandMAdapterBoard": baseDirName + "ads85x8/t_and_m_adapter",
    },
    "ADS8588H": {
        "AM64xAdapterBoard": baseDirName + "ads85x8/adc_phi_pru_evm_adapter",
        "TandMAdapterBoard": baseDirName + "ads85x8/t_and_m_adapter",
    },
    "ADS8588S": {
        "AM64xAdapterBoard": baseDirName + "ads85x8/adc_phi_pru_evm_adapter",
        "TandMAdapterBoard": baseDirName + "ads85x8/t_and_m_adapter",
    },
    "ADS127L11": {
        "AM64xAdapterBoard": baseDirName + "ads127/adc_phi_pru_evm_adapter",
    },
    "ADS131M08": {
        "AM64xAdapterBoard": baseDirName + "ads131/adc_phi_pru_evm_adapter",
    },
}

function modifyAdcConfigOptions(inst) {
    for (let adc of Object.keys(adcList)) {
        for (option of Object.keys(adcList[inst.adcIC])) {
            inst.adapter.readOnly = true;
        };
    };
}

function getInstanceConfig(moduleInstance) {
    return {
        ...moduleInstance
    }
}

function onValidate(inst, report) {
    if((common.getSelfSysCfgCoreName().includes('pru')))
    {
        let r5f_core = inst["r5fCore"], found = 0 ;
        if((_.keys(system.contexts).includes(r5f_core)) && system.contexts[r5f_core].system.modules["/pru_io/adc/adc"]){
            /* Going through all pru adc module instances of selected r5fcore */
            let r5f_adc_module = system.contexts[r5f_core].system.modules["/pru_io/adc/adc"];
            for(let iterator = 0; iterator<r5f_adc_module.$instances.length;  iterator++)
            {
                let r5f_instance = r5f_adc_module.$instances[iterator];
                if((r5f_instance.adcConfig[0].interface == inst.adcConfig[0].interface) && (r5f_instance["adcIC"] == inst["adcIC"]) && (r5f_adc_module.getAdcPruIcssInstance(r5f_instance) == getAdcPruIcssInstance(inst)) && (r5f_adc_module.getAdcPruCore(r5f_instance) == getAdcPruCore(inst)))
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
            report.logError("No PRU ADC module found with selected configurations in R5F core context",inst);       
        }
    }
}

function getSubmodulePath(instance) {
    return adcList[`${instance.adcIC}`][`${instance.adapter}`];
}

function getAdcOptions() {
    let options = [];
    for (let adc of Object.keys(adcList)){
        let option = { name: adc };
        options.push(option);
    }
    return options;
}

function getDisabledAdapterOptions(instance) {
    return [];
}

function moduleInstances(instance) {
    let modInstances = new Array();

    modInstances.push({
        name: "adcConfig",
        displayName: "ADC Configuration",
        moduleName: getSubmodulePath(instance),
        useArray: true,
        minInstanceCount : 1,
        defaultInstanceCount: 1,
        maxInstanceCount : 1,
        requiredArgs: {
            icssInstance: getAdcPruIcssInstance(instance),
        },
        collapsed: false,
    });

    return (modInstances);
}

function getAdcPruCore(instance) {
    let pruCore = instance.adcConfig[0].PRU_ICSSG0_PRU?.$solution.peripheralName.substring(11) ||
                  instance.adcConfig[0].PRU_ICSSG1_PRU?.$solution.peripheralName.substring(11);
    if((common.getSelfSysCfgCoreName().includes('pru')) && (common.getSelfSysCfgCoreName().substring(8) == "pru0"))
    {
        pruCore = "PRU0";
    }
    else if((common.getSelfSysCfgCoreName().includes('pru')) && (common.getSelfSysCfgCoreName().substring(8) == "pru1"))
    {
        pruCore = "PRU1";   
    }
    return  pruCore;
}

function getAdcPruIcssInstance(instance)
{
    let icssInstance = instance.icssInstance;
    if((common.getSelfSysCfgCoreName().includes('pru')) && (common.getSelfSysCfgCoreName().substring(5,7) == "g0"))
    {
        icssInstance = "ICSSG0";
    }
    else if ((common.getSelfSysCfgCoreName().includes('pru')) && (common.getSelfSysCfgCoreName().substring(5,7) == "g1"))
    {
        icssInstance = "ICSSG1";
    }
    return icssInstance;
}

let adc_top_module_name = "/pru_io/adc/adc";

let pru_adc_top_module = {
    displayName: "ADC",
    
    templates: {
        "/pru_io/common/pru_io_config.inc.xdt": {
            pru_io_config: "/pru_io/adc/templates_pru/adc_config.inc.xdt",
            moduleName: adc_top_module_name,
        },
    },

    defaultInstanceName: "CONFIG_ADC",
    
    config: [
         {
            name: "adcIC",
            displayName: "ADC IC",
            options: getAdcOptions(),
            default: "ADS8598H",
            onChange: (inst, ui) => {
                if(inst.adcIC === "ADS127L11" || inst.adcIC === "ADS131M08"){
                    inst.adapter = "AM64xAdapterBoard";
                    ui.adapter.readOnly = true;
                } else {
                    ui.adapter.readOnly = false;
                }
            },
        },
        {
            name: "adapter",  
            displayName: "Adapter Card",
            options: [{
                name: "AM64xAdapterBoard",
                displayName: "ADC-PHI-PRU-EVM Adapter Board",
            },
            ],
            default: "AM64xAdapterBoard",
            getDisabledOptions: getDisabledAdapterOptions
        },
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
    validatePinmux: onValidate,
    moduleInstances,
    getInstanceConfig,
    getAdcPruCore,
    getAdcPruIcssInstance
};

let r5f_adc_top_module = {
    displayName: "ADC",

    templates: {

        "/drivers/system/system_config.h.xdt": {
            driver_config: "/pru_io/adc/templates_r5f/pru_adc.h.xdt",
            moduleName: adc_top_module_name,
        },
    },
    defaultInstanceName: "CONFIG_ADC",
    config: [
        {
            name: "adcIC",
            displayName: "ADC IC",
            options: getAdcOptions(),
            default: "ADS8598H",
            onChange: (inst, ui) => {
                if(inst.adcIC === "ADS127L11" || inst.adcIC === "ADS131M08"){
                    inst.adapter = "AM64xAdapterBoard";
                    ui.adapter.readOnly = true;
                } else {
                    ui.adapter.readOnly = false;
                }
            },
        },
        {
            name: "adapter", 
            displayName: "Adapter Card",
            options: [{
                name: "AM64xAdapterBoard",
                displayName: "ADC-PHI-PRU-EVM Adapter Board",
            }],
            default: "AM64xAdapterBoard",
            getDisabledOptions: getDisabledAdapterOptions,
        },
        {
            name: "icssInstance",
            displayName: "ICSSG Instance",
            default: "ICSSG0",
            options: [{
                name: "ICSSG0",
            },
            {
                name: "ICSSG1",
            }],
            getDisabledOptions: () => {
                return [{
                    name: "ICSSG1",
                    reason: "The Adapter Board only supports ICSSG0"
                }]
            },
        },
    ],
    validate: onValidate,
    moduleInstances,
    getInstanceConfig,
    getAdcPruCore,
    getAdcPruIcssInstance
};


exports = common.getSelfSysCfgCoreName().includes('pru')? pru_adc_top_module : r5f_adc_top_module;
