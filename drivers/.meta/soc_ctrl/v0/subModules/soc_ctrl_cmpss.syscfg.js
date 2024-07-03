let common   = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/cmpss/soc/cmpss_${common.getSocName()}`);
let cmpssModule = "/drivers/cmpss/cmpss"

let config = []

let cmpssStaticConfigArray = soc.CMPSS_INSTANCE     // different from ADC and EPWM
let cmpssInstList = [];
for (let i of cmpssStaticConfigArray){
    cmpssInstList.push(i.displayName)
}
// console.log(cmpssStaticConfigArray);

function getAddedInstances(moduleName){
    let instAdded = [];
    let modAdded = common.getModuleForCore(moduleName, common.getSelfSysCfgCoreName());
    if ((modAdded != null) && (modAdded != undefined)){
        for (let instance of modAdded.$instances){
            let solution = cmpssStaticConfigArray.find(o => o.name === instance["cmpssBase"]).displayName; // different implementation for CMPSS
            if(solution != null){
                instAdded.push(solution)
            }
        }
    }
    return instAdded.sort()
}

let loopBackCfg = [];
let loopBackEnCfg = [];
if (soc.isLoopBackAvailable()){
    loopBackEnCfg = [
        {
            name : "loopBackEn",
            displayName : "Enable Loop Back Controls",
            default : [],
            minSelections : 0,
            options : ()=>{
                let opt = [];
                for(let cmpssInst of getAddedInstances(cmpssModule)){
                    opt.push({
                        name : cmpssInst, displayName : cmpssInst
                    })
                }
                return opt
            },
            onChange : (inst, ui)=>{
                for(let cmpssInst of cmpssStaticConfigArray){
                    ui[cmpssInst.displayName.toLowerCase()+"HloopBackCfgEn"].hidden = true
                    ui[cmpssInst.displayName.toLowerCase()+"LloopBackCfgEn"].hidden = true
                }
                for(let cmpssInst of inst["loopBackEn"]){
                    ui[cmpssInst.toLowerCase()+"HloopBackCfgEn"].hidden = false
                    ui[cmpssInst.toLowerCase()+"LloopBackCfgEn"].hidden = false

                }
            }

        }
    ]
    for(let element of cmpssStaticConfigArray){
        loopBackCfg = loopBackCfg.concat([
            {
                name : element.displayName.toLowerCase()+"loopBackCfg",
                displayName : element.displayName.toUpperCase()+" Loop Back Configurations",
                config : [
                    {
                        name : element.displayName.toLowerCase()+"HloopBackCfgEn",
                        displayName : "Enable Loop Back for "+element.displayName.toUpperCase()+"High In",
                        default : false,
                        hidden : true,
                    },
                    {
                        name : element.displayName.toLowerCase()+"LloopBackCfgEn",
                        displayName : "Enable Loop Back for "+element.displayName.toUpperCase()+"Low In",
                        default : false,
                        hidden : true,
                    }
                ],
                collapsed : true,
            }
        ])
    }
    config = config.concat(loopBackEnCfg)
    config = config.concat([
        {
            name : "loopBackEnGrp",
            displayName : "CMPSS Loop Back Controls",
            config : loopBackCfg,
            collapsed : false
        }
    ])
}

let soc_ctrl_sub = {
    name : "soc_ctrl_cmpss",
    displayName : "SOC Control Module for CMPSS",
    defaultInstanceName : "soc_ctrl_cmpss",
    maxInstances : 1,
    config : config,
    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_init: "/drivers/soc_ctrl/templates/soc_ctrl_cmpss_config.c.xdt",
        },
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
    cmpssStaticConfigArray,
    getAddedInstances,
}

exports  = soc_ctrl_sub;