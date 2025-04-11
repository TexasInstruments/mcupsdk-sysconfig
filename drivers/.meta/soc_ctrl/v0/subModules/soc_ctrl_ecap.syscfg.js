let common   = system.getScript("/common");
let soc = system.getScript(`/drivers/ecap/soc/ecap_${common.getSocName()}`);
let ecapModule = "/drivers/ecap/ecap"

let config = []

let ecapStaticConfigArray = soc.ECAP_INSTANCE     // different from ADC and ECAP
let ecapInstLen = ecapStaticConfigArray.length;
let ecapInstList = [];
for (let i of ecapStaticConfigArray){
    ecapInstList.push(i.displayName)
}

function getAddedInstances(moduleName){
    let instAdded = [];
    let modAdded = common.getModuleForCore(moduleName, common.getSelfSysCfgCoreName());
    if ((modAdded != null) && (modAdded != undefined)){
        for (let instance of modAdded.$instances){
            let solution = ecapStaticConfigArray.find(o => o.name === instance["ecapBase"]).displayName; // different implementation for ECAP
            if(solution != null){
                instAdded.push(solution)
            }
        }
    }
    return instAdded.sort()
}


let haltConfig = [];
haltConfig = haltConfig.concat([
    {
        name : "haltCtrlEn",
        displayName : "Enable Halt Controls",
        options : ()=>{
            let opt = []
            for(let ecapInst of getAddedInstances(ecapModule)){
                if(ecapInst != undefined)
                {
                    opt.push({
                        name : ecapInst, displayName : ecapInst
                    })
                }
            }
            return opt
        },
        onChange :  (inst, ui)=>{
            for (let ecapInst = 0; ecapInst < ecapInstLen; ecapInst++){
                if(ecapInst != undefined){
                    ui["haltDisable"+ecapInst.toString()].hidden = true
                }
            }
            for(let ecapInst of inst.haltCtrlEn){
                if(inst["haltDisable"+ecapInst.replace("ECAP", "")] != undefined){
                    ui["haltDisable"+ecapInst.replace("ECAP", "")].hidden = false
                }
            }
        },
        default : [],
        minSelections : 0,
        }
])
for (let ecapInst = 0; ecapInst < ecapInstLen; ecapInst++){
    haltConfig = haltConfig.concat([
        {
            name : "haltDisable"+ecapInst.toString(),
            displayName : "Disable Halt For ECAP"+ecapInst.toString()+" On "+(common.getSelfSysCfgCoreName()).toUpperCase(),
            default : false,
            hidden : true,
        }
    ])
}

let soc_ctrl_sub = {
    name : "soc_ctrl_ecap",
    displayName : "SOC Control Module for ECAP",
    defaultInstanceName : "soc_ctrl_ecap",
    maxInstances : 1,
    config : haltConfig,
    templates: {},
    ecapStaticConfigArray,
    getAddedInstances,
}

exports  = soc_ctrl_sub;