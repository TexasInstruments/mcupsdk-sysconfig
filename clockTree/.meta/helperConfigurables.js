const clockConnectivity = system.deviceData.clockTree.connectivity
const clockIpInstances = system.deviceData.clockTree.ipInstances
const helperScript = system.getScript(`/clockTree/helperScript_configs.js`);


/*
    These configurables are not displayed anywhere in the clocktree and their purpose is to 
    help provide information about a unit in a clocktree. For eg: which mux line is selected for a
    peripheral instance, or what divider is connected to a peripheral instance etc.
    These configurables are used inside the helperScript.js which in turn runs some logic over it to 
    return the information.
*/

exports = {
    displayName: "Prev Entity Information",
    config: [
        {
            name: "inputSignal",
            default: "",
            getValue: (inst) => helperScript.helperGetInputSignal(inst),
            hidden: true
        },
        {
            name: "prevEntityName",
            default: "",
            getValue: (inst) => helperScript.helperGetPrevEntityName(inst),
            hidden: true
        },
        {
            name: "prevEntityType",
            default: "",
            getValue: (inst) => helperScript.helperGetPrevEntityType(inst),
            hidden: true
        }
    ]

}