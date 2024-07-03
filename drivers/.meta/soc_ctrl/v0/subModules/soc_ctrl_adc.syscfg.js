let common   = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/adc/soc/adc_${common.getSocName()}`);
let adcModule = '/drivers/adc/adc';
let adcRModule = '/drivers/adc/adc_r';

let thisModule = '/drivers/soc_ctrl/v0/subModules/soc_ctrl_adc'

let config = []

let adcStaticConfigArray = soc.getStaticConfigArr()

let refBufList = [];
for (let element of adcStaticConfigArray){
    if ((element.refBuf != undefined) && !(element.refBuf in refBufList)){
        refBufList.push(element.refBuf)
    }
}

function getAddedInstances(moduleName){
    let instAdded = [];
    let modAdded = common.getModuleForCore(moduleName, common.getSelfSysCfgCoreName());
    // console.log(modAdded.$instances)
    if ((modAdded != null) && (modAdded != undefined)){
    for (let instance of modAdded.$instances){
            let solution = instance[modAdded.getInterfaceName(instance)].$solution;
            if(solution != null){
                instAdded.push(solution.peripheralName)
            }
        }
    }
    return instAdded.sort()
}

let coreList = [];

for (let core of common.getSysCfgCoreNames()){
    if(core.includes("r5f")){
        if (core === common.getSelfSysCfgCoreName()){
            coreList.push(
                {
                    name : core, displayName : "This Core"
                }
            )
        }
        else
        {
            coreList.push(
                {
                    name : core, displayName : core
                }
            )
        }
    }
}
// console.log(coreList)
let cfgCoreConfig = [
    {
        name : "cfgCore",
        displayName : "Core to Configure",
        description : "This option migrates the generated code from this Core to selected core if any.",
        options : coreList,
        default : common.getSelfSysCfgCoreName(),
        onChange : (inst, ui)=>{
            ui.adcLoopBackEn.readOnly = !(inst.cfgCore === common.getSelfSysCfgCoreName())
        },
        // TODO : add onChange
    }
]

let listConfig = [
    {
        name : "enableAdcReferenceGui",
        displayName : "Enable Reference Controls",
        longDescription : "Enables Internal Reference Buffers for ADCs. Please make sure that ADCs that use same refernce buffer are configured similarly for the reference buffers across the cores.",
        options : (inst) => {

            // console.log(common.getModuleForCore(adcModule, common.getSelfSysCfgCoreName()))

            let options = []
            let adcInstancesAdded = getAddedInstances(adcModule).concat(getAddedInstances(adcRModule));
            let refBufListinThisCore = [];

            // console.log(adcInstancesAdded)

            for(let adcAdded of adcInstancesAdded){
                let adcCfg = adcStaticConfigArray.find(o => o.name === adcAdded);
                if (refBufListinThisCore.includes(adcCfg.refBuf)){
                    continue;
                }
                else
                {
                    refBufListinThisCore.push(adcCfg.refBuf)
                }
            }
            refBufListinThisCore.sort()
            // console.log(refBufListinThisCore)

            for (let refBufIndex in refBufListinThisCore){
                options[refBufIndex] = {
                    name : refBufListinThisCore[refBufIndex], displayName : "Reference Buffer "+refBufListinThisCore[refBufIndex]
                }
            }

            return options
        },
        default : [],
        minSelections : 0,
        onChange : (inst, ui)=>{
            // console.log(refBufList)
            // console.log(inst.enableAdcReferenceGui)
            for (let refBuf of refBufList) {
                ui["adc_ref"+refBuf+"_disable"].hidden = true
            }
            for(let optSel of inst.enableAdcReferenceGui){
                if(refBufList.includes(optSel)){
                    // console.log(optSel, inst.enableAdcReferenceGui)
                    ui["adc_ref"+optSel+"_disable"].hidden = false
                }
            }
        }
    }
]

let refBufConfig = [];
for (let refBuf of refBufList) {
    let adcList = "";
    for(let element of adcStaticConfigArray){
        if((element.refBuf != undefined) && (element.refBuf === refBuf)){
            adcList += element.instanceNumber+" ";
        }
    }
    refBufConfig = refBufConfig.concat([
        {
            name : "adc_ref"+refBuf+"_disable",
            displayName : "Disable Internal ADC RefBuf "+refBuf,
            default : false,
            description : "This Disables Internal Reference for ADC "+adcList+". Please Provide correct External Voltage for ADC Reference.",
            hidden : true,
        }
    ])
}

let loopBackConfig = [];

if(soc.isLoopBackAvailable()){
    loopBackConfig = [
        {
            name : "adcLoopBackEn",
            displayName : "Enable ADC Loop Back",
            readOnly : false,
            default : false,
            description : "Enables DAC loop back to ADC",
            longDescription : "DAC loop back will have higher impedence on the ADC CAL0 input. use only one ADC to sample the CAL Channel at once and have the sampling window increased for this use case.",
        }
    ]
}

refBufConfig = listConfig.concat(refBufConfig)

let gblFrcCfg = [];

if(soc.isLoopBackAvailable()){
    gblFrcCfg = [
        {
            name : "adcGlobalForceEn",
            displayName : "Enable ADC Global Forcing",
            options : ()=>{
                let opt = []
                for(let adcInst of getAddedInstances(adcModule).concat(getAddedInstances(adcRModule))){
                    let staticConfig = adcStaticConfigArray.find(o => o.name === adcInst);
                    if(staticConfig.instanceNumber){
                        opt.push({
                            name : staticConfig.instanceNumber, displayName : adcInst
                        })
                    }
                }
                return opt
            },
            default : [],
            minSelections : 0,
            description : "Enables ADC Global Forcing for selected ADCs",
            longDescription : "SOC_adcSocGlobalForce(uint32_t socNumber) API can be used to force socNumber SOC on the selected ADCs",
        }
    ]
}

let extChCfg = []

config = config.concat([
    {
        name : "adcReferneceGrp",
        displayName : "ADC Reference Buffer Controls",
        config : refBufConfig,
        collapsed : false,
    },
    {
        name : "adcLoopBacksGrp",
        displayName : "ADC Loop Back controls",
        config : loopBackConfig,
        collapsed : false,
    },
    {
        name : "adcGlobalForceGrp",
        displayName : "ADC Global Force Controls",
        config : gblFrcCfg,
        collapsed : false,
    }
])

config = cfgCoreConfig.concat(config)

let soc_ctrl_sub = {
    name : "soc_ctrl_adc",
    displayName : "SOC Control Module For ADC",
    defaultInstanceName : "soc_ctrl_adc",
    maxInstances : 1,
    config : config,
    validate : onValidate,
    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_init: "/drivers/soc_ctrl/templates/soc_ctrl_adc_config.c.xdt",
        },
            // "/drivers/system/system_config.h.xdt": {
        //     driver_config: "/drivers/sdfm/templates/sdfm.h.xdt",
        // },
        // "/drivers/system/drivers_open_close.h.xdt": {
        //     driver_open_close_config: "/drivers/sdfm/templates/sdfm_open_close_config.h.xdt",
        // },
        // "/drivers/system/drivers_open_close.c.xdt": {
        //     driver_open_close_config: "/drivers/sdfm/templates/sdfm_open_close_config.c.xdt",
        //     driver_open: "/drivers/sdfm/templates/sdfm_open.c.xdt",
        // },
        // "/drivers/pinmux/pinmux_config.c.xdt": {
        //     moduleName: sd_module_name,
        // },
        // "/drivers/system/power_clock_config.c.xdt": {
        //     moduleName: sd_module_name,
        // },
    },
    refBufList,
    getAddedInstances : getAddedInstances,
    usedModules : [adcModule, adcRModule],
    adcStaticConfigArray : adcStaticConfigArray,
}

function onValidate(inst, report){
    for (let refBuf of refBufList) {
        let thisCxtModule = common.getModuleForCore(thisModule, common.getSelfSysCfgCoreName())
        let thisCxtModuleObj = thisCxtModule.$instances[0]
        for(let core of common.getSysCfgCoreNames()){
            if(core != common.getSelfSysCfgCoreName()){
                let otherCxtModule = common.getModuleForCore(thisModule, core)
                if (otherCxtModule){
                    let otherCxtModuleObj = otherCxtModule.$instances[0]
                    if(thisCxtModuleObj["enableAdcReferenceGui"].includes(refBuf) && otherCxtModuleObj["enableAdcReferenceGui"].includes(refBuf)){
                        report.logWarning("Same Reference Buffer is configured in one core contexts!", inst, "adc_ref"+refBuf+"_disable")
                    }
                }
            }
        }
    }
}


exports  = soc_ctrl_sub;