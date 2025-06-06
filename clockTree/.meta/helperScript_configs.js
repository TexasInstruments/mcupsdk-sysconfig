/*
* This is a helper script which returns value to the configurables defined inside the helperConfigurables.js.
* Those configurables in turn are used somewhere else to extract information from various units in the clock tree.
* Read comments inside helperConfigurables.js for more information.
*/

/*
    Given an instance (of a clocktree), what's the previous entity name.
    For eg: If instance is ADC0_CLK_GATE, the previous entity is "SYS_CLK_GCM_CLKDIV" (not the connection name SYSCLK).
    If instance is ADC0, the prev entity is "ADC0_CLK_GATE".
*/
function getPrevEntityName(inst) {

    let inputSignal = getInputSignal(inst)
    const val = _.find(system.deviceData.clockTree.connectivity, (c) => c.name === inputSignal || c.name === `${inputSignal}_out`)?.source?.instName
    return val ? val : ""
}

/*
    Given an instance (of a clocktree), what's the previous entity type.
    For eg: If instance is a gate ADC0_CLK_GATE, the previous entity is a "divider" (not the connection name SYSCLK).
    If instance is a peripheral ADC0, the prev entity is the "gate" ADC0_CLK_GATE.
*/

function getPrevEntityType(inst) {

    let prevEntityName = getPrevEntityName(inst)
    const val =  _.find(system.deviceData.clockTree.ipInstances, (ip) => ip.name === prevEntityName)?.type
    return val ? val : ""

}

/*
    Given an instance (of a clocktree), what's the signal coming to it.
    For eg: If instance is a gate ADC0_CLK_GATE, the input signal is SYSCLK (not the connection name SYSCLK).
    If instance is ADC0, the input signal is the ADC0_CLK.
*/

function getInputSignal(inst){

    const ipInstance = inst.$name
    const val = _.find(system.deviceData.clockTree.connectivity, (c) => _.some(c.targets, (t) => t.instName === ipInstance))?.name 
    return val ? val : ""

}

exports = {
    helperGetPrevEntityName: getPrevEntityName,
    helperGetPrevEntityType: getPrevEntityType,
    helperGetInputSignal: getInputSignal
}