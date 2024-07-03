let common   = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/sdfm/soc/sdfm_${common.getSocName()}`);
let sdfmModule = "/drivers/sdfm/sdfm";

let config = [];

let sdfmCfgArray = soc.getStaticConfigArr();
let sdfmClkNumber = 4;

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

let loopBackCfgEn = [];
if(soc.isClkLoopBackAvailable()){
    loopBackCfgEn = loopBackCfgEn.concat([
        {
            name : "sdfmClkLoopBackCfgEn",
            displayName : "Enable Controls For SDFM Loop Back",
            minSelections :0,
            default : [],
            options : ()=>{
                let opt = [];
                for (let sdfmInst of getAddedInstances(sdfmModule)){
                    if (sdfmInst){
                        opt.push({
                            name : sdfmInst, displayName : sdfmInst
                        })
                    }
                }
                return opt
            },
            onChange : (inst, ui)=>{
                for (let clkInst = 0; clkInst < sdfmClkNumber; clkInst++ ){
                    for (let sdfmInst = 0; sdfmInst < sdfmCfgArray.length; sdfmInst++){
                        let sdfmInstStr = sdfmInst.toString()
                        let clkInstStr = clkInst.toString()
                        ui["sdfm"+sdfmInstStr+"clk"+clkInstStr].hidden = true
                        if(inst["sdfmClkLoopBackCfgEn"]){
                            for (let sdfmInst of inst["sdfmClkLoopBackCfgEn"]){
                                ui[sdfmInst.toLowerCase()+"clk"+clkInstStr].hidden = false
                            }
                        }
                    }
                }
            },
        }
    ])
}
let loopBackCfg = [];
if(soc.isClkLoopBackAvailable()){
    for(let sdfmInst = 0; sdfmInst < sdfmCfgArray.length; sdfmInst++){
        for (let clkInst = 0; clkInst < sdfmClkNumber; clkInst++ ){
            let sdfmInstStr = sdfmInst.toString()
            let clkInstStr = clkInst.toString()
            loopBackCfg = loopBackCfg.concat([
                {
                    name : "sdfm"+sdfmInstStr+"clk"+clkInstStr,
                    displayName : "SDFM "+sdfmInstStr+" Clock "+clkInstStr+" Loop Back Option",
                    options : [
                        {
                            name : "default", displayName : "Use Default Loop Back Clock"
                        },
                        {
                            name : "alternate", displayName : "Use Alternate Loop Back Clock"
                        }
                    ],
                    default : "default",
                    hidden : true,
                }
            ])
        }
    }
}

config = config.concat([
    {
        name : "sdfmLoopBackCfgGrp",
        displayName : "Clock Loop Back Controls for SDFM",
        config : [].concat(loopBackCfgEn).concat(loopBackCfg)
    }
])

let soc_ctrl_sdfm = {
    name : "soc_ctrl_sdfm",
    defaultInstanceName : "soc_ctrl_sdfm",
    displayName : "SOC Control Module For SDFM",
    description : "SOC Control Configurations like Clock Loop Back are found here",
    maxInstances : 1,
    config : config,
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
        "/drivers/system/power_clock_config.c.xdt": {
            clock_config : "/drivers/soc_ctrl/templates/soc_ctrl_sdfm_clock.c.xdt",
            moduleName: "/drivers/soc_ctrl/v0/subModules/soc_ctrl_sdfm",
        },
    },
    sdfmCfgArray,
    sdfmClkNumber,
    getAddedInstances,
}

exports  = soc_ctrl_sdfm;