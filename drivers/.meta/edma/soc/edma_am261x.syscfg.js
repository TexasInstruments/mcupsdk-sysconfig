let common = system.getScript("/common");
let xbarSoc = system.getScript(`/xbar/soc/xbar_${common.getSocName()}`);

function getIntrMacro() {
    return "CSLR_R5FSS0_CORE0_INTR_TPCC0_INT_" + getDefaultRegion();
}

const edma_config = [
    {
        name: "EDMA0",
        baseAddr: "CSL_TPCC0_U_BASE",
        compIntrNumber: getIntrMacro(),
        errIntrNumber: "CSLR_R5FSS0_CORE0_INTR_TPCC0_ERRAGGR",
        intrAggEnableAddr: "CSL_MSS_CTRL_U_BASE + CSL_MSS_CTRL_TPCC0_INTAGG_MASK",
        intrAggStatusAddr: "CSL_MSS_CTRL_U_BASE + CSL_MSS_CTRL_TPCC0_INTAGG_STATUS",
        errIntrAggEnableAddr: "CSL_MSS_CTRL_U_BASE + CSL_MSS_CTRL_TPCC0_ERRAGG_MASK",
        errIntrAggStatusAddr: "CSL_MSS_CTRL_U_BASE + CSL_MSS_CTRL_TPCC0_ERRAGG_STATUS",
        /* Below mask enables all errors in the aggregated interrupt */
        errIntrAggEnable: "0x707001F",
        maxDmaChannels: "64",
        maxTcc: "64",
        maxPaRAM: "256",
        maxRegions: "8",
        maxQueue: "2",
        /* This instance can be shared between the 4 R5 Cores. */
        defaultOwnDmaChannelStart_r5fss0_0: "0",
        defaultOwnDmaChannelEnd_r5fss0_0: "39",
        defaultOwnDmaChannelStart_r5fss0_1: "40",
        defaultOwnDmaChannelEnd_r5fss0_1: "63",

        defaultOwnQdmaChannelStart_r5fss0_0: "0",
        defaultOwnQdmaChannelEnd_r5fss0_0: "5",
        defaultOwnQdmaChannelStart_r5fss0_1: "6",
        defaultOwnQdmaChannelEnd_r5fss0_1: "7",

        defaultOwnTccStart_r5fss0_0: "0",
        defaultOwnTccEnd_r5fss0_0: "39",
        defaultOwnTccStart_r5fss0_1: "40",
        defaultOwnTccEnd_r5fss0_1: "63",

        defaultOwnParamStart_r5fss0_0: "0",
        defaultOwnParamEnd_r5fss0_0: "234",
        defaultOwnParamStart_r5fss0_1: "235",
        defaultOwnParamEnd_r5fss0_1: "255",

    },
];

const internal_list = [];

function getConfigArr() {
    return edma_config;
}

function getDefaultRegion() {
    let selfCoreName = common.getSelfSysCfgCoreName();
    let defRegion = 0;
    if (selfCoreName == "r5fss0-1") {
        defRegion = 1;
    }
    return defRegion;
}

let xbarProperties = {
    masterXbarList: ["dma_trig_xbar"],
    duplicatesPresent: false,
    moduleString: "edma_module",
}

function getOptionList(calledBy) {
    return xbarSoc.getOptionListSoc(calledBy, xbarProperties, internal_list);
}

function isReservedChannelSupported() {
    return false;
}

function isChannelTriggerXbarSupported() {
    return true;
}

function supportXbarConfig(outputSelected, instance) {
    return xbarSoc.supportXbarConfigSoc(outputSelected, instance, xbarProperties);
}

exports = {
    getConfigArr,
    getDefaultRegion,
    isReservedChannelSupported,
    getOptionList,
    supportXbarConfig,
    isChannelTriggerXbarSupported,
};
