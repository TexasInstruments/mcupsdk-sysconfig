let common = system.getScript("/common");
let xbarSoc = system.getScript(`/xbar/soc/xbar_${common.getSocName()}`);

const internal_list = [
    {  name: "EPWM0_SYNCOUT", displayName: "EPWM0_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM1_SYNCOUT", displayName: "EPWM1_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM2_SYNCOUT", displayName: "EPWM2_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM3_SYNCOUT", displayName: "EPWM3_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM4_SYNCOUT", displayName: "EPWM4_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM5_SYNCOUT", displayName: "EPWM5_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM6_SYNCOUT", displayName: "EPWM6_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM7_SYNCOUT", displayName: "EPWM7_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM8_SYNCOUT", displayName: "EPWM8_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "EPWM9_SYNCOUT", displayName: "EPWM9_SYNCOUT", path: "epwm_syncout_xbar", group: 0 },
    {  name: "ECAP0_SYNCOUT", displayName: "ECAP0_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP1_SYNCOUT", displayName: "ECAP1_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP2_SYNCOUT", displayName: "ECAP2_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP3_SYNCOUT", displayName: "ECAP3_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP4_SYNCOUT", displayName: "ECAP4_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP5_SYNCOUT", displayName: "ECAP5_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP6_SYNCOUT", displayName: "ECAP6_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
    {  name: "ECAP7_SYNCOUT", displayName: "ECAP7_SYNCOUT", path: "epwm_syncout_xbar", group: 1 },
];

let xbarProperties = {
    masterXbarList: [],
    outputInstanceList: [
        { name: "EPWM_SYNCOUT_XBAR", count: 4},
    ],
    duplicatesPresent: false,
    moduleString: "epwm_syncout_xbar",
}

function getOptionList(calledBy) {
    return xbarSoc.getOptionListSoc(calledBy, xbarProperties, internal_list);
}

function getConfigArr() {
    return xbarSoc.getXbarInstanceConfig(xbarProperties);
}

exports = {
    getConfigArr,
    getOptionList,
};
