let common = system.getScript("/common");
let xbarSoc = system.getScript(`/xbar/soc/xbar_${common.getSocName()}`);

const internal_list = [
    {  name: "EPWM0_SOCA", displayName: "EPWM0_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM1_SOCA", displayName: "EPWM1_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM2_SOCA", displayName: "EPWM2_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM3_SOCA", displayName: "EPWM3_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM4_SOCA", displayName: "EPWM4_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM5_SOCA", displayName: "EPWM5_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM6_SOCA", displayName: "EPWM6_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM7_SOCA", displayName: "EPWM7_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM8_SOCA", displayName: "EPWM8_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM9_SOCA", displayName: "EPWM9_SOCA", path: "dma_xbar", group: 0 },
    {  name: "EPWM0_SOCB", displayName: "EPWM0_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM1_SOCB", displayName: "EPWM1_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM2_SOCB", displayName: "EPWM2_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM3_SOCB", displayName: "EPWM3_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM4_SOCB", displayName: "EPWM4_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM5_SOCB", displayName: "EPWM5_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM6_SOCB", displayName: "EPWM6_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM7_SOCB", displayName: "EPWM7_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM8_SOCB", displayName: "EPWM8_SOCB", path: "dma_xbar", group: 1 },
    {  name: "EPWM9_SOCB", displayName: "EPWM9_SOCB", path: "dma_xbar", group: 1 },
    {  name: "ADC0_INT1", displayName: "ADC0_INT1", path: "dma_xbar", group: 2 },
    {  name: "ADC0_INT2", displayName: "ADC0_INT2", path: "dma_xbar", group: 2 },
    {  name: "ADC0_INT3", displayName: "ADC0_INT3", path: "dma_xbar", group: 2 },
    {  name: "ADC0_INT4", displayName: "ADC0_INT4", path: "dma_xbar", group: 2 },
    {  name: "ADC0_EVTINT", displayName: "ADC0_EVTINT", path: "dma_xbar", group: 2 },
    {  name: "ADC1_INT1", displayName: "ADC1_INT1", path: "dma_xbar", group: 2 },
    {  name: "ADC1_INT2", displayName: "ADC1_INT2", path: "dma_xbar", group: 2 },
    {  name: "ADC1_INT3", displayName: "ADC1_INT3", path: "dma_xbar", group: 2 },
    {  name: "ADC1_INT4", displayName: "ADC1_INT4", path: "dma_xbar", group: 2 },
    {  name: "ADC1_EVTINT", displayName: "ADC1_EVTINT", path: "dma_xbar", group: 2 },
    {  name: "ADC2_INT1", displayName: "ADC2_INT1", path: "dma_xbar", group: 2 },
    {  name: "ADC2_INT2", displayName: "ADC2_INT2", path: "dma_xbar", group: 2 },
    {  name: "ADC2_INT3", displayName: "ADC2_INT3", path: "dma_xbar", group: 2 },
    {  name: "ADC2_INT4", displayName: "ADC2_INT4", path: "dma_xbar", group: 2 },
    {  name: "ADC2_EVTINT", displayName: "ADC2_EVTINT", path: "dma_xbar", group: 2 },
    {  name: "FSI0_RX_DMA_EVT", displayName: "FSI0_RX_DMA_EVT", path: "dma_xbar", group: 3 },
    {  name: "FSI0_DMA_TRIG1", displayName: "FSI0_DMA_TRIG1", path: "dma_xbar", group: 3 },
    {  name: "FSI0_DMA_TRIG2", displayName: "FSI0_DMA_TRIG2", path: "dma_xbar", group: 3 },
    {  name: "SD0_FILT0_DRINT", displayName: "SD0_FILT0_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD0_FILT1_DRINT", displayName: "SD0_FILT1_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD0_FILT2_DRINT", displayName: "SD0_FILT2_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD0_FILT3_DRINT", displayName: "SD0_FILT3_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD1_FILT0_DRINT", displayName: "SD1_FILT0_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD1_FILT1_DRINT", displayName: "SD1_FILT1_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD1_FILT2_DRINT", displayName: "SD1_FILT2_DRINT", path: "dma_xbar", group: 4 },
    {  name: "SD1_FILT3_DRINT", displayName: "SD1_FILT3_DRINT", path: "dma_xbar", group: 4 },
    {  name: "ECAP0_DMA_INT", displayName: "ECAP0_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP1_DMA_INT", displayName: "ECAP1_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP2_DMA_INT", displayName: "ECAP2_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP3_DMA_INT", displayName: "ECAP3_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP4_DMA_INT", displayName: "ECAP4_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP5_DMA_INT", displayName: "ECAP5_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP6_DMA_INT", displayName: "ECAP6_DMA_INT", path: "dma_xbar", group: 5 },
    {  name: "ECAP7_DMA_INT", displayName: "ECAP7_DMA_INT", path: "dma_xbar", group: 5 },
];

let xbarProperties = {
    masterXbarList: [],
    outputInstanceList: [
        { name: "DMA_XBAR_DMA_TRIG_XBAR", count: 16},
    ],
    duplicatesPresent: false,
    moduleString: "dma_xbar",
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
