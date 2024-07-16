let common   = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/epwm/soc/epwm_${common.getSocName()}`);
let epwmModule = "/drivers/epwm/epwm"

let config = [];
let epwmInstLen = soc.getStaticConfigArr().length;

function getAddedInstances(moduleName){
    let instAdded = [];
    let modAdded = common.getModuleForCore(moduleName, common.getSelfSysCfgCoreName());
    // console.log(modAdded)
    if ((modAdded != null) && (modAdded != undefined)){
        for (let instance of modAdded.$instances){
            let solution = instance[modAdded.getInterfaceName(instance)].$solution;
            if(solution != null){
                instAdded.push(solution.peripheralName)
            }
        }
    }
    instAdded.sort()
    // console.log(instAdded)
    return instAdded
}

let tbClkConfig = [];
tbClkConfig = tbClkConfig.concat([
    {
    name : "tbclkSyncCtrlEn",
    displayName : "Enable TBCLK Sync Controls",
    options : ()=>{
        let opt = []
        for(let epwmInst of getAddedInstances(epwmModule)){
            opt.push({
                name : epwmInst, displayName : epwmInst
            })
        }
        return opt
    },
    onChange :  (inst, ui)=>{
        for (let epwmInst = 0; epwmInst < epwmInstLen; epwmInst++){
            ui["tbClkSyncDisable"+epwmInst.toString()].hidden = true
        }
        // console.log(inst.tbclkSyncCtrlEn)
        for(let epwmInst of inst.tbclkSyncCtrlEn){
            ui["tbClkSyncDisable"+epwmInst.replace("EPWM", "")].hidden = false
        }
    },
    default : [],
    minSelections : 0,
    }
])

for (let epwmInst = 0; epwmInst < epwmInstLen; epwmInst++){
    tbClkConfig = tbClkConfig.concat([
        {
            name : "tbClkSyncDisable"+epwmInst.toString(),
            displayName : "Disable TBCLK Sync for EPWM"+epwmInst.toString(),
            description : "Disables TBCLK Sync for EPWM for configurations but not re-enables if checked ",
            default : false,
            hidden : true,
        }
    ])
}

let haltConfig = [];
haltConfig = haltConfig.concat([
    {
        name : "haltCtrlEn",
        displayName : "Enable Halt Controls",
        options : ()=>{
            let opt = []
            for(let epwmInst of getAddedInstances(epwmModule)){
                opt.push({
                    name : epwmInst, displayName : epwmInst
                })
            }
            return opt
        },
        onChange :  (inst, ui)=>{
            for (let epwmInst = 0; epwmInst < epwmInstLen; epwmInst++){
                ui["haltDisable"+epwmInst.toString()].hidden = true
            }
            for(let epwmInst of inst.haltCtrlEn){
                ui["haltDisable"+epwmInst.replace("EPWM", "")].hidden = false
            }
        },
        default : [],
        minSelections : 0,
        }
])
for (let epwmInst = 0; epwmInst < epwmInstLen; epwmInst++){
    haltConfig = haltConfig.concat([
        {
            name : "haltDisable"+epwmInst.toString(),
            displayName : "Disable Halt for EPWM"+epwmInst.toString()+" for CPU "+common.getSelfSysCfgCoreName(),
            default : false,
            hidden : true,
        }
    ])
}

config = config.concat([
    {
        name : "tbClkSyncGrp",
        displayName : "TBCLK Sync Controls",
        config : tbClkConfig,
        collapsed : false,
    },
    {
        name : "haltGrp",
        displayName : "Halt Controls",
        config : haltConfig,
        collapsed : false,
    },
])
let soc_ctrl_sub = {
    name : "soc_ctrl_epwm",
    displayName : "SOC Control Module for EPWM",
    defaultInstanceName : "soc_ctrl_epwm",
    maxInstances : 1,
    config : config,
    collapse: true,
    templates: {
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
    epwmInstLen,
    getAddedInstances
}

exports  = soc_ctrl_sub;