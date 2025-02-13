
let common = system.getScript("/common");
let soc = system.getScript(`/board/ioexp/ioexp_${common.getSocName()}`);

function getInstanceConfig(moduleInstance) {
    let configArr = soc.getConfigArr();
    let config = configArr.find(o => o.i2cAddress === moduleInstance.i2cAddress);

    return {
        ...config,
        ...moduleInstance,
    };
};

function getConfigurables() {
    /* get 'CPU enable' configurables */
    let config = [];
    let staticConfig = soc.getConfigArr();

    config.push(
        {
            ...common.ui.makeConfig(staticConfig, "name", "IO Expander")
        },
        {
            name : "i2cAddress",
            displayName : "I2C Target Address",
            options : ()=>{
                let opt = [];
                for (let cfg of staticConfig){
                    opt.push(
                        {name : cfg.i2cAddress, displayName : "0x"+(cfg.i2cAddress).toString(16)}
                    )
                }
                return opt
            },
            onChange : onChangeIoExp,
            default : 0x20,
        },
    );
    let ioexp_cfg = [];
    for(let cfg of staticConfig){
        for(let pin of cfg.pinSet){
            let pinName_filtered = pin.pinName.replace(".","_").replace("/","_");
            let element_name = cfg.name+"_"+"port"+pin.portNumber+"_"+"pin"+pinName_filtered;
            ioexp_cfg.push(
                {
                    name : element_name,
                    displayName : pin.pinName+" Configurations",
                    config : [
                        {
                            name : element_name+"_mode",
                            displayName : pin.pinName+" Mode",
                            options : [
                                { name : 0, displayName : "Output"},
                                { name : 1, displayName : "Input"},
                            ],
                            default : 1,
                            onChange : (inst, ui)=>{
                                if (inst[element_name+"_mode"] == 1){
                                    //input
                                    ui[element_name+"_state"].hidden = true
                                }else{
                                    ui[element_name+"_state"].hidden = false
                                }
                            },
                            hidden : !(cfg.i2cAddress == 0x20),
                        },
                        {
                            name : element_name+"_state",
                            displayName : pin.pinName+" State",
                            options : [
                                { name : 0, displayName : "LOW"},
                                { name : 1, displayName : "HIGH"},
                            ],
                            default : 0,
                            hidden : true,
                        }
                    ] 
                }
            )
        }
    }
    config = config.concat([
        {
            name : "ioExpConfigGrp",
            displayName : "IO Expander Configurations",
            config : ioexp_cfg,
        }
    ]);
    return config;
}

function onChangeIoExp(inst, ui){
    let staticConfig = soc.getConfigArr();
    for(let cfg of staticConfig){
        for(let pin of cfg.pinSet){
            let pinName_filtered = pin.pinName.replace(".","_").replace("/","_");
                    let element_name = cfg.name+"_"+"port"+pin.portNumber+"_"+"pin"+pinName_filtered;
            ui[element_name+"_mode"].hidden = !(inst["i2cAddress"] == cfg.i2cAddress)
            ui[element_name+"_state"].hidden = (!(inst["i2cAddress"] == cfg.i2cAddress) || (inst[element_name+"_mode"] == 1))
        }
    }
}

function onValidate(inst, validation){

    let addedInstances = []

    for(let instance of inst.$module.$instances){
        addedInstances.push("0x"+(instance.i2cAddress).toString(16));
    }
    let duplicatesResult = common.findDuplicates(addedInstances)
    if (duplicatesResult.duplicates.length != 0)
    {
        let allDuplicates = "";
        for (let duplicateNamesIndex in duplicatesResult.duplicates)
        {
            allDuplicates = allDuplicates + common.stringOrEmpty(allDuplicates, ", ")
                            + duplicatesResult.duplicates[duplicateNamesIndex];
        }
        validation.logError(
            "The I2C Addresses is used. Duplicated address " + allDuplicates,
            inst, "i2cAddress");
    }

    let staticConfig = soc.getConfigArr();
    let all_i2cAddresses = []

    for(let cfg of staticConfig){
        all_i2cAddresses.push(cfg.i2cAddress)
    }

    if(!(all_i2cAddresses.includes(inst.i2cAddress))){
        validation.logError("Invalid I2C Peripheral address for the IO Expander", inst, "i2cAddress");
    }

}

let ioexp_module_name = "/board/ioexp/ioexp";

let ioexp_module = {
    displayName: "IO Expander",

    templates: {
        "/board/board/board_open_close.c.xdt": {
            board_open: "/board/ioexp/templates/ioexp_open.c.xdt",
            board_open_close_config: "/board/ioexp/templates/ioexp_open_close.c.xdt",
        },
        "/board/board/board_open_close.h.xdt": {
            board_open_close_config: "/board/ioexp/templates/ioexp_open_close.h.xdt",
        },
        "/board/board/board_config.h.xdt": {
            board_config: "/board/ioexp/templates/ioexp.h.xdt",
        },

    },
    defaultInstanceName: "CONFIG_IOEXP",
    config: getConfigurables(),
    moduleStatic: {
        modules: function(instance) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    validate: onValidate,
    maxInstances: soc.getConfigArr().length,
    sharedModuleInstances: moduleInstances,
    getInstanceConfig,
};

function moduleInstances(instance) {
    let modInstances = new Array();
    let configArr = soc.getConfigArr();
    let config = configArr.find(o => o.name === instance.name);

    if(config.type == "I2C") {
        modInstances.push({
            name: "peripheralDriver",
            displayName: "I2C Configuration",
            moduleName: '/drivers/i2c/i2c',
            requiredArgs: {
                I2C : {
                    $assign : config.instance
                }
            }
        });
    }

    return (modInstances);
}

exports = ioexp_module;
