let common = system.getScript("/common");
let soc = system.getScript(`/sdl/ecc/soc/sdl_ecc_${common.getSocName()}`);

function getConfigArr() {
    return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === moduleInstance.instance);

     return {
        ...config,
        ...moduleInstance,
     };
};

function getConfigurables()
{
    let config = [];

    config.push(/* Endpt attributes */
        {
            name: "endptNum",
            hidden: true,
            default: 0,
        },
        {
            name: "ena_dis",
            hidden: false,
            displayName: "Enable/Disable",
            default: false,
            description: "Enable or Disable the ECC error reporting for this endpoint. Enabling the event will trigger an inerrupt and the associated ESM event callback to be called when the event occurs.",
        },
    );
    return config;
}

let ecc_endpt_module_name = "/sdl/ecc/v1/sdl_ecc_v1_endpt";

let ecc_endpt_module = {
    displayName: "ECC Endpoint/RAMID Configuration",
    defaultInstanceName: "CONFIG_ECC_ENDPT",
    config: getConfigurables(),
    validate : validate,
    getInstanceConfig,
};

/*
 *  ======== validate ========
 */
function validate(inst, report) {
  
}

exports = ecc_endpt_module;

