let common   = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/soc/drivers_${common.getSocName()}`);

let driverVer = soc.getDriverVer("soc_ctrl");


let submodulesComponentsList = [
    "soc_ctrl_adc",
    "soc_ctrl_epwm",
    "soc_ctrl_cmpss",
    "soc_ctrl_sdfm",
    // "soc_ctrl_sub2",
    // "soc_ctrl_sub3",
]

let submodulesComponents = []

for (let submodulesComponentsListIter of submodulesComponentsList){
    submodulesComponents = submodulesComponents.concat(
        {
            moduleName: "/drivers/soc_ctrl/"+driverVer+"/subModules/"+submodulesComponentsListIter+".syscfg.js",
            name: "soc_ctrl_sub"+driverVer,
            displayName:"soc_ctrl_sub"+driverVer,
            description:"soc_ctrl_sub"+driverVer,
            // templates : templates,
        }
    )
}

let config = []
for (let submoduleComponent of submodulesComponents)
{
    let submodule = system.getScript(submoduleComponent.moduleName)
    config = config.concat([
        {
            name: "GROUP_" + submodule.defaultInstanceName,
            displayName: submodule.displayName,
            longDescription: submodule.description,
            description: "",
            config: submodule.config,
            // templates : submodule.moduleStatic.config.templates,
        },
    ])
}

function getSocCtrlSubModulePath(submoduleName){
    // console.log(submoduleName)
    for(let submoduleComponent of submodulesComponentsList){
        // console.log("/drivers/soc_ctrl/"+driverVer+"/subModules/"+submoduleName+".syscfg.js")
        if (submoduleName === submoduleComponent)
        {
            let retString = "/drivers/soc_ctrl/"+driverVer+"/subModules/"+submoduleName+".syscfg.js";
            // console.log(retString)
            return retString;
        }
    }
}

let soc_ctrl = {
    name : "soc_ctrl",
    defaultInstanceName : "soc_ctrl",
    displayName : "SOC Control Module",
    maxInstances : 1,
    config : [],
    moduleStatic : {
        sharedModuleInstances : (inst)=>{
            let modules = [];
            for (let submoduleComponent of submodulesComponents){
                let submodule = system.getScript(submoduleComponent.moduleName)
                modules.push(
                    {
                        moduleName: submoduleComponent.moduleName,
                        name: submodule.name,
                        displayName: submodule.displayName,
                        collapsed : true,
                    }
                )
            }

            return modules
        },
    },
    // validate : (instance, report) => {
    //         common.validate.checkSameFieldNameOnAllCores('/drivers/soc_ctrl/soc_ctrl', instance, "name", report);
    // },
    getSocCtrlSubModulePath,
}



exports  = soc_ctrl;