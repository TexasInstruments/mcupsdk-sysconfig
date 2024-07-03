let CMPSS_STS = [
	{ name: "CMPSS_STS_HI_FILTOUT", displayName: "High digital filter output" },
	{ name: "CMPSS_STS_HI_LATCHFILTOUT", displayName: "Latched value of high digital filter output" },
	{ name: "CMPSS_STS_LO_FILTOUT", displayName: "Low digital filter output" },
	{ name: "CMPSS_STS_LO_LATCHFILTOUT", displayName: "Latched value of low digital filter output" },
]
function getInterfaceName(instance) {
    return "CMPSS";
}

let numberOfInstance = 20;
let CMPSS_INSTANCE = [
    { name: "CSL_CONTROLSS_CMPSSA0_U_BASE", displayName: "CMPSSA0"},
    { name: "CSL_CONTROLSS_CMPSSA1_U_BASE", displayName: "CMPSSA1"},
    { name: "CSL_CONTROLSS_CMPSSA2_U_BASE", displayName: "CMPSSA2"},
    { name: "CSL_CONTROLSS_CMPSSA3_U_BASE", displayName: "CMPSSA3"},
    { name: "CSL_CONTROLSS_CMPSSA4_U_BASE", displayName: "CMPSSA4"},
    { name: "CSL_CONTROLSS_CMPSSA5_U_BASE", displayName: "CMPSSA5"},
    { name: "CSL_CONTROLSS_CMPSSA6_U_BASE", displayName: "CMPSSA6"},
    { name: "CSL_CONTROLSS_CMPSSA7_U_BASE", displayName: "CMPSSA7"},
    { name: "CSL_CONTROLSS_CMPSSA8_U_BASE", displayName: "CMPSSA8"},
    { name: "CSL_CONTROLSS_CMPSSA9_U_BASE", displayName: "CMPSSA9"},
    { name: "CSL_CONTROLSS_CMPSSB0_U_BASE", displayName: "CMPSSB0"},
    { name: "CSL_CONTROLSS_CMPSSB1_U_BASE", displayName: "CMPSSB1"},
    { name: "CSL_CONTROLSS_CMPSSB2_U_BASE", displayName: "CMPSSB2"},
    { name: "CSL_CONTROLSS_CMPSSB3_U_BASE", displayName: "CMPSSB3"},
    { name: "CSL_CONTROLSS_CMPSSB4_U_BASE", displayName: "CMPSSB4"},
    { name: "CSL_CONTROLSS_CMPSSB5_U_BASE", displayName: "CMPSSB5"},
    { name: "CSL_CONTROLSS_CMPSSB6_U_BASE", displayName: "CMPSSB6"},
    { name: "CSL_CONTROLSS_CMPSSB7_U_BASE", displayName: "CMPSSB7"},
    { name: "CSL_CONTROLSS_CMPSSB8_U_BASE", displayName: "CMPSSB8"},
    { name: "CSL_CONTROLSS_CMPSSB9_U_BASE", displayName: "CMPSSB9"},
]

function isLoopBackAvailable(){
    return true;
}

exports = {
	CMPSS_STS: CMPSS_STS,
    getInterfaceName,
    numberOfInstance,
    CMPSS_INSTANCE,
    isLoopBackAvailable,
}
