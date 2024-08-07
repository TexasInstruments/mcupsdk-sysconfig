let common = system.getScript("/common");
let xbarSoc = system.getScript(`/xbar/soc/xbar_${common.getSocName()}`);

const internal_list = [
    {  name: "MDL0_OUTA", displayName: "MDL0_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL1_OUTA", displayName: "MDL1_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL2_OUTA", displayName: "MDL2_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL3_OUTA", displayName: "MDL3_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL4_OUTA", displayName: "MDL4_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL5_OUTA", displayName: "MDL5_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL6_OUTA", displayName: "MDL6_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL7_OUTA", displayName: "MDL7_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL8_OUTA", displayName: "MDL8_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL9_OUTA", displayName: "MDL9_OUTA", path: "icl_xbar", group: 0 },
    {  name: "MDL0_OUTB", displayName: "MDL0_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL1_OUTB", displayName: "MDL1_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL2_OUTB", displayName: "MDL2_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL3_OUTB", displayName: "MDL3_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL4_OUTB", displayName: "MDL4_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL5_OUTB", displayName: "MDL5_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL6_OUTB", displayName: "MDL6_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL7_OUTB", displayName: "MDL7_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL8_OUTB", displayName: "MDL8_OUTB", path: "icl_xbar", group: 1 },
    {  name: "MDL9_OUTB", displayName: "MDL9_OUTB", path: "icl_xbar", group: 1 },
    {  name: "ICSSGPO0_PORT0", displayName: "ICSSGPO0_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO1_PORT0", displayName: "ICSSGPO1_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO2_PORT0", displayName: "ICSSGPO2_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO3_PORT0", displayName: "ICSSGPO3_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO4_PORT0", displayName: "ICSSGPO4_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO5_PORT0", displayName: "ICSSGPO5_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO6_PORT0", displayName: "ICSSGPO6_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO7_PORT0", displayName: "ICSSGPO7_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO8_PORT0", displayName: "ICSSGPO8_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO9_PORT0", displayName: "ICSSGPO9_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO10_PORT0", displayName: "ICSSGPO10_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO11_PORT0", displayName: "ICSSGPO11_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO12_PORT0", displayName: "ICSSGPO12_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO13_PORT0", displayName: "ICSSGPO13_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO14_PORT0", displayName: "ICSSGPO14_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO15_PORT0", displayName: "ICSSGPO15_PORT0", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO0_PORT1", displayName: "ICSSGPO0_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO1_PORT1", displayName: "ICSSGPO1_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO2_PORT1", displayName: "ICSSGPO2_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO3_PORT1", displayName: "ICSSGPO3_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO4_PORT1", displayName: "ICSSGPO4_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO5_PORT1", displayName: "ICSSGPO5_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO6_PORT1", displayName: "ICSSGPO6_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO7_PORT1", displayName: "ICSSGPO7_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO8_PORT1", displayName: "ICSSGPO8_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO9_PORT1", displayName: "ICSSGPO9_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO10_PORT1", displayName: "ICSSGPO10_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO11_PORT1", displayName: "ICSSGPO11_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO12_PORT1", displayName: "ICSSGPO12_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO13_PORT1", displayName: "ICSSGPO13_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO14_PORT1", displayName: "ICSSGPO14_PORT1", path: "icl_xbar", group: 2 },
    {  name: "ICSSGPO15_PORT1", displayName: "ICSSGPO15_PORT1", path: "icl_xbar", group: 2 },
];

let xbarProperties = {
    masterXbarList: [],
    outputInstanceList: [
        { name: "ICL_XBAR", count: 16},
    ],
    duplicatesPresent: false,
    moduleString: "icl_xbar",
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
