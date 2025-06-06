/*
 *This script is used to extract information from various units in the clock tree.
*/

/*  
    If we pass peripheral instance name say ADC0, EPWM1, UART2, this function will 
    return the mux selected input.
    It continuously traverses the tree backwards from this peripheral until the mux is reached and returns the selected input.
*/

function getMuxSelectIn(instanceName){

    let currentInstance = system.clockTree[instanceName];
    if(currentInstance === undefined)    
        return "XXX"

    let type = ""

    while(type !== "mux"){
        let prevInstance = currentInstance.prevEntityName;
        type = (currentInstance.prevEntityType).toLowerCase();
        currentInstance = system.clockTree[prevInstance];
    }

    let muxSelectedIn = currentInstance.inputSelect;
    if(muxSelectedIn === "SYSCLK")
        return "SYS_CLK"
    else if(muxSelectedIn === "XTAL_CLK")
        return "XTALCLK"
    return muxSelectedIn
}

/*  
    If we pass peripheral instance name say ADC0, EPWM1, UART2, this function will 
    return the name of the divider.
    It continuously traverses the tree backwards from this peripheral until the divider is reached.
*/
function getDividerName(instanceName){

    let currentInstance = system.clockTree[instanceName];
    if(currentInstance === undefined)    
        return "XXX"
    let type = ""

    while(type !== "divider"){
        let prevInstance = currentInstance.prevEntityName;
        type = (currentInstance.prevEntityType).toLowerCase();
        currentInstance = system.clockTree[prevInstance];
    }

    return currentInstance.$name
}

/*  
    If we pass peripheral instance name say ADC0, EPWM1, UART2, this function will 
    return the name of the original source clock: either the oscillator XTALCLK or the pinfunction (the clock sources under the Clock group).
    It continuously traverses the tree backwards from this peripheral until its source is reached.
*/

function getPinfunctionName(instanceName){

    let currentInstance = system.clockTree[instanceName];
    if(currentInstance === undefined)    
        return "XXX"

    let type = ""
    let prevInstance = ""

    while(type.toLowerCase() !== "pinfunction"){

        prevInstance = currentInstance.prevEntityName;
        if( prevInstance === "XTALCLK")
            break;
        type = (currentInstance.prevEntityType).toLowerCase();

        if( ["pinfunction"].includes(type.toLowerCase() ))
            type = "pinFunction"

        if( type.toLowerCase() === "oscillator")
            break;

        currentInstance = system.clockTree[prevInstance];
    }

    return currentInstance.$name
}

/*  
    If we pass peripheral instance name say ADC0, EPWM1, UART2, this function will 
    return all the inputs to its mux.
    It continuously traverses the tree backwards from this peripheral until the mux is reached and returns the list of input lines.
*/

function getMuxInputs(instanceName){

    let currentInstance = system.clockTree[instanceName];
    if(currentInstance === undefined)    
        return "XXX"
    let type = ""

    while(type !== "mux"){
        let prevInstance = currentInstance.prevEntityName;
        type = (currentInstance.prevEntityType).toLowerCase();
        currentInstance = system.clockTree[prevInstance];
    }

    let muxSelectionLines = system.clockTree[currentInstance.$name].inPins ;
    return muxSelectionLines
}

/*
    It returns the value of a connection. A connection not a real Ip instance in the clocktree but is
    rendered as a lable on a line or as a node with frequency inside it.
    Eg: ADC0_CLK, SYSCLK.
*/

function getOutputValue(namedConnection){
    let val = (system.clockTree[namedConnection].out[0]) * 1000000;
    return Math.trunc(val);
}


exports = {
    helperMux: getMuxSelectIn,
    helperDivider: getDividerName,
    helperPinFunction: getPinfunctionName,
    helperMuxInputs: getMuxInputs,
    helperGetFrequencyNamedConnection: getOutputValue,
}