let ADC_ClkPrescale = [
	{ name: "ADC_CLK_DIV_1_0", displayName: "ADCCLK = (input clock) / 1.0" },
	{ name: "ADC_CLK_DIV_2_0", displayName: "ADCCLK = (input clock) / 2.0" },
	{ name: "ADC_CLK_DIV_2_5", displayName: "ADCCLK = (input clock) / 2.5" },
	{ name: "ADC_CLK_DIV_3_0", displayName: "ADCCLK = (input clock) / 3.0" },
	{ name: "ADC_CLK_DIV_3_5", displayName: "ADCCLK = (input clock) / 3.5" },
	{ name: "ADC_CLK_DIV_4_0", displayName: "ADCCLK = (input clock) / 4.0" },
	{ name: "ADC_CLK_DIV_4_5", displayName: "ADCCLK = (input clock) / 4.5" },
	{ name: "ADC_CLK_DIV_5_0", displayName: "ADCCLK = (input clock) / 5.0" },
	{ name: "ADC_CLK_DIV_5_5", displayName: "ADCCLK = (input clock) / 5.5" },
	{ name: "ADC_CLK_DIV_6_0", displayName: "ADCCLK = (input clock) / 6.0" },
	{ name: "ADC_CLK_DIV_6_5", displayName: "ADCCLK = (input clock) / 6.5" },
	{ name: "ADC_CLK_DIV_7_0", displayName: "ADCCLK = (input clock) / 7.0" },
	{ name: "ADC_CLK_DIV_7_5", displayName: "ADCCLK = (input clock) / 7.5" },
	{ name: "ADC_CLK_DIV_8_0", displayName: "ADCCLK = (input clock) / 8.0" },
	{ name: "ADC_CLK_DIV_8_5", displayName: "ADCCLK = (input clock) / 8.5" },
]
let ADC_Resolution = [
	{ name: "ADC_RESOLUTION_12BIT", displayName: "12-bit conversion resolution" },
]
let ADC_SignalMode = [
	{ name: "ADC_MODE_SINGLE_ENDED", displayName: "Sample on single pin with VREFLO" },
	{ name: "ADC_MODE_DIFFERENTIAL", displayName: "Sample on pair of pins" },
]
let ADC_Trigger = [
    { name: "ADC_TRIGGER_SW_ONLY", displayName: "Software only" },
    { name: "ADC_TRIGGER_RTI0", displayName: "RTI Timer 0" },
    { name: "ADC_TRIGGER_RTI1", displayName: "RTI Timer 1" },
    { name: "ADC_TRIGGER_RTI2", displayName: "RTI Timer 2" },
    { name: "ADC_TRIGGER_RTI3", displayName: "RTI Timer 3" },
    { name: "ADC_TRIGGER_INPUT_XBAR_OUT5", displayName: "InputXBar.Out[5]" },
    { name: "ADC_TRIGGER_EPWM0_SOCA", displayName: "ePWM0, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM0_SOCB", displayName: "ePWM0, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM1_SOCA", displayName: "ePWM1, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM1_SOCB", displayName: "ePWM1, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM2_SOCA", displayName: "ePWM2, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM2_SOCB", displayName: "ePWM2, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM3_SOCA", displayName: "ePWM3, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM3_SOCB", displayName: "ePWM3, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM4_SOCA", displayName: "ePWM4, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM4_SOCB", displayName: "ePWM4, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM5_SOCA", displayName: "ePWM5, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM5_SOCB", displayName: "ePWM5, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM6_SOCA", displayName: "ePWM6, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM6_SOCB", displayName: "ePWM6, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM7_SOCA", displayName: "ePWM7, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM7_SOCB", displayName: "ePWM7, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM8_SOCA", displayName: "ePWM8, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM8_SOCB", displayName: "ePWM8, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM9_SOCA", displayName: "ePWM9, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM9_SOCB", displayName: "ePWM9, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM10_SOCA", displayName: "ePWM10, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM10_SOCB", displayName: "ePWM10, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM11_SOCA", displayName: "ePWM11, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM11_SOCB", displayName: "ePWM11, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM12_SOCA", displayName: "ePWM12, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM12_SOCB", displayName: "ePWM12, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM13_SOCA", displayName: "ePWM13, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM13_SOCB", displayName: "ePWM13, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM14_SOCA", displayName: "ePWM14, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM14_SOCB", displayName: "ePWM14, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM15_SOCA", displayName: "ePWM15, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM15_SOCB", displayName: "ePWM15, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM16_SOCA", displayName: "ePWM16, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM16_SOCB", displayName: "ePWM16, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM17_SOCA", displayName: "ePWM17, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM17_SOCB", displayName: "ePWM17, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM18_SOCA", displayName: "ePWM18, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM18_SOCB", displayName: "ePWM18, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM19_SOCA", displayName: "ePWM19, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM19_SOCB", displayName: "ePWM19, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM20_SOCA", displayName: "ePWM20, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM20_SOCB", displayName: "ePWM20, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM21_SOCA", displayName: "ePWM21, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM21_SOCB", displayName: "ePWM21, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM22_SOCA", displayName: "ePWM22, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM22_SOCB", displayName: "ePWM22, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM23_SOCA", displayName: "ePWM23, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM23_SOCB", displayName: "ePWM23, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM24_SOCA", displayName: "ePWM24, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM24_SOCB", displayName: "ePWM24, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM25_SOCA", displayName: "ePWM25, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM25_SOCB", displayName: "ePWM25, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM26_SOCA", displayName: "ePWM26, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM26_SOCB", displayName: "ePWM26, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM27_SOCA", displayName: "ePWM27, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM27_SOCB", displayName: "ePWM27, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM28_SOCA", displayName: "ePWM28, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM28_SOCB", displayName: "ePWM28, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM29_SOCA", displayName: "ePWM29, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM29_SOCB", displayName: "ePWM29, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM30_SOCA", displayName: "ePWM30, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM30_SOCB", displayName: "ePWM30, ADCSOCB" },
    { name: "ADC_TRIGGER_EPWM31_SOCA", displayName: "ePWM31, ADCSOCA" },
    { name: "ADC_TRIGGER_EPWM31_SOCB", displayName: "ePWM31, ADCSOCB" },
    { name: "ADC_TRIGGER_ECAP0_SOCEVT", displayName: "eCAP0, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP1_SOCEVT", displayName: "eCAP1, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP2_SOCEVT", displayName: "eCAP2, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP3_SOCEVT", displayName: "eCAP3, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP4_SOCEVT", displayName: "eCAP4, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP5_SOCEVT", displayName: "eCAP5, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP6_SOCEVT", displayName: "eCAP6, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP7_SOCEVT", displayName: "eCAP7, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP8_SOCEVT", displayName: "eCAP8, SOCEVT" },
    { name: "ADC_TRIGGER_ECAP9_SOCEVT", displayName: "eCAP9, SOCEVT" },
]
let ADC_Channel = [
	{ name: "ADC_CH_ADCIN0", displayName: "single-ended, ADCIN0" },
	{ name: "ADC_CH_ADCIN1", displayName: "single-ended, ADCIN1" },
	{ name: "ADC_CH_ADCIN2", displayName: "single-ended, ADCIN2" },
	{ name: "ADC_CH_ADCIN3", displayName: "single-ended, ADCIN3" },
	{ name: "ADC_CH_ADCIN4", displayName: "single-ended, ADCIN4" },
	{ name: "ADC_CH_ADCIN5", displayName: "single-ended, ADCIN5" },
	{ name: "ADC_CH_ADCIN0_ADCIN1", displayName: "differential, ADCIN0 and ADCIN1" },
	{ name: "ADC_CH_ADCIN1_ADCIN0", displayName: "differential, ADCIN1 and ADCIN0" },
	{ name: "ADC_CH_ADCIN2_ADCIN3", displayName: "differential, ADCIN2 and ADCIN3" },
	{ name: "ADC_CH_ADCIN3_ADCIN2", displayName: "differential, ADCIN3 and ADCIN2" },
	{ name: "ADC_CH_ADCIN4_ADCIN5", displayName: "differential, ADCIN4 and ADCIN5" },
    { name: "ADC_CH_ADCIN5_ADCIN4", displayName: "differential, ADCIN5 and ADCIN4" },

]
let ADC_PulseMode = [
	{ name: "ADC_PULSE_END_OF_ACQ_WIN", displayName: "Occurs at the end of the acquisition window" },
	{ name: "ADC_PULSE_END_OF_CONV", displayName: "Occurs at the end of the conversion" },
]
let ADC_IntNumber = [
	{ name: "ADC_INT_NUMBER1", displayName: "ADCINT1 Interrupt" },
	{ name: "ADC_INT_NUMBER2", displayName: "ADCINT2 Interrupt" },
	{ name: "ADC_INT_NUMBER3", displayName: "ADCINT3 Interrupt" },
	{ name: "ADC_INT_NUMBER4", displayName: "ADCINT4 Interrupt" },
]
let ADC_PPBNumber = [
	{ name: "ADC_PPB_NUMBER1", displayName: "Post-processing block 1" },
	{ name: "ADC_PPB_NUMBER2", displayName: "Post-processing block 2" },
	{ name: "ADC_PPB_NUMBER3", displayName: "Post-processing block 3" },
	{ name: "ADC_PPB_NUMBER4", displayName: "Post-processing block 4" },
]
let ADC_SOCNumber = [
	{ name: "ADC_SOC_NUMBER0", displayName: "SOC/EOC number 0" },
	{ name: "ADC_SOC_NUMBER1", displayName: "SOC/EOC number 1" },
	{ name: "ADC_SOC_NUMBER2", displayName: "SOC/EOC number 2" },
	{ name: "ADC_SOC_NUMBER3", displayName: "SOC/EOC number 3" },
	{ name: "ADC_SOC_NUMBER4", displayName: "SOC/EOC number 4" },
	{ name: "ADC_SOC_NUMBER5", displayName: "SOC/EOC number 5" },
	{ name: "ADC_SOC_NUMBER6", displayName: "SOC/EOC number 6" },
	{ name: "ADC_SOC_NUMBER7", displayName: "SOC/EOC number 7" },
	{ name: "ADC_SOC_NUMBER8", displayName: "SOC/EOC number 8" },
	{ name: "ADC_SOC_NUMBER9", displayName: "SOC/EOC number 9" },
	{ name: "ADC_SOC_NUMBER10", displayName: "SOC/EOC number 10" },
	{ name: "ADC_SOC_NUMBER11", displayName: "SOC/EOC number 11" },
	{ name: "ADC_SOC_NUMBER12", displayName: "SOC/EOC number 12" },
	{ name: "ADC_SOC_NUMBER13", displayName: "SOC/EOC number 13" },
	{ name: "ADC_SOC_NUMBER14", displayName: "SOC/EOC number 14" },
	{ name: "ADC_SOC_NUMBER15", displayName: "SOC/EOC number 15" },
]
let ADC_IntSOCTrigger = [
	{ name: "ADC_INT_SOC_TRIGGER_NONE", displayName: "No ADCINT will trigger the SOC" },
	{ name: "ADC_INT_SOC_TRIGGER_ADCINT1", displayName: "ADCINT1 will trigger the SOC" },
	{ name: "ADC_INT_SOC_TRIGGER_ADCINT2", displayName: "ADCINT2 will trigger the SOC" },
]
let ADC_PriorityMode = [
	{ name: "ADC_PRI_ALL_ROUND_ROBIN", displayName: "Round robin mode is used for all" },
	{ name: "ADC_PRI_SOC0_HIPRI", displayName: "SOC 0 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC1_HIPRI", displayName: "SOC 0-1 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC2_HIPRI", displayName: "SOC 0-2 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC3_HIPRI", displayName: "SOC 0-3 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC4_HIPRI", displayName: "SOC 0-4 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC5_HIPRI", displayName: "SOC 0-5 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC6_HIPRI", displayName: "SOC 0-6 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC7_HIPRI", displayName: "SOC 0-7 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC8_HIPRI", displayName: "SOC 0-8 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC9_HIPRI", displayName: "SOC 0-9 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC10_HIPRI", displayName: "SOC 0-10 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC11_HIPRI", displayName: "SOC 0-11 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC12_HIPRI", displayName: "SOC 0-12 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC13_HIPRI", displayName: "SOC 0-13 hi pri, others in round robin" },
	{ name: "ADC_PRI_THRU_SOC14_HIPRI", displayName: "SOC 0-14 hi pri, SOC15 in round robin" },
	{ name: "ADC_PRI_ALL_HIPRI", displayName: "All priorities based on SOC number" },
]
let ADC_EVT = [
	{ name: "ADC_EVT_TRIPHI", displayName: "Trip High Event" },
	{ name: "ADC_EVT_TRIPLO", displayName: "Trip Low Event" },
	{ name: "ADC_EVT_ZERO", displayName: "Zero Crossing Event" },
]
let ADC_FORCE = [
	{ name: "ADC_FORCE_SOC0", displayName: "SW trigger ADC SOC 0" },
	{ name: "ADC_FORCE_SOC1", displayName: "SW trigger ADC SOC 1" },
	{ name: "ADC_FORCE_SOC2", displayName: "SW trigger ADC SOC 2" },
	{ name: "ADC_FORCE_SOC3", displayName: "SW trigger ADC SOC 3" },
	{ name: "ADC_FORCE_SOC4", displayName: "SW trigger ADC SOC 4" },
	{ name: "ADC_FORCE_SOC5", displayName: "SW trigger ADC SOC 5" },
	{ name: "ADC_FORCE_SOC6", displayName: "SW trigger ADC SOC 6" },
	{ name: "ADC_FORCE_SOC7", displayName: "SW trigger ADC SOC 7" },
	{ name: "ADC_FORCE_SOC8", displayName: "SW trigger ADC SOC 8" },
	{ name: "ADC_FORCE_SOC9", displayName: "SW trigger ADC SOC 9" },
	{ name: "ADC_FORCE_SOC10", displayName: "SW trigger ADC SOC 10" },
	{ name: "ADC_FORCE_SOC11", displayName: "SW trigger ADC SOC 11" },
	{ name: "ADC_FORCE_SOC12", displayName: "SW trigger ADC SOC 12" },
	{ name: "ADC_FORCE_SOC13", displayName: "SW trigger ADC SOC 13" },
	{ name: "ADC_FORCE_SOC14", displayName: "SW trigger ADC SOC 14" },
	{ name: "ADC_FORCE_SOC15", displayName: "SW trigger ADC SOC 15" },
]
let ADC_Sysclk_Mhz = 200
function getInterfaceName(instance) {
    return "ADC";
}
const staticConfig = [
    {
        name: "ADC0",
        baseAddr: "CSL_CONTROLSS_ADC0_U_BASE",
        resultBaseAddr : "CSL_CONTROLSS_ADC0_RESULT_U_BASE",
        instanceNumber : "0",
        refBuf         : "0",
    },
    {
        name: "ADC1",
        baseAddr: "CSL_CONTROLSS_ADC1_U_BASE",
        resultBaseAddr : "CSL_CONTROLSS_ADC1_RESULT_U_BASE",
        instanceNumber : "1",
        refBuf         : "1",
    },
    {
        name: "ADC2",
        baseAddr: "CSL_CONTROLSS_ADC2_U_BASE",
        resultBaseAddr : "CSL_CONTROLSS_ADC2_RESULT_U_BASE",
        instanceNumber : "2",
        refBuf         : "1",
    },
    {
        name: "ADC3",
        baseAddr: "CSL_CONTROLSS_ADC3_U_BASE",
        resultBaseAddr : "CSL_CONTROLSS_ADC3_RESULT_U_BASE",
        instanceNumber : "3",
        refBuf         : "2",
    },
    {
        name: "ADC4",
        baseAddr: "CSL_CONTROLSS_ADC4_U_BASE",
        resultBaseAddr : "CSL_CONTROLSS_ADC4_RESULT_U_BASE",
        instanceNumber : "4",
        refBuf         : "2",
    },
];
function getStaticConfigArr() {
    return staticConfig;
}

function isLoopBackAvailable(){
    return false
}

function isGlobalForceAvailable(){
    return false
}

exports = {
	ADC_ClkPrescale: ADC_ClkPrescale,
	ADC_Resolution: ADC_Resolution,
	ADC_SignalMode: ADC_SignalMode,
	ADC_Trigger: ADC_Trigger,
	ADC_Channel: ADC_Channel,
	ADC_PulseMode: ADC_PulseMode,
	ADC_IntNumber: ADC_IntNumber,
	ADC_PPBNumber: ADC_PPBNumber,
	ADC_SOCNumber: ADC_SOCNumber,
	ADC_IntSOCTrigger: ADC_IntSOCTrigger,
	ADC_PriorityMode: ADC_PriorityMode,
	ADC_EVT: ADC_EVT,
	ADC_FORCE: ADC_FORCE,
    ADC_Sysclk_Mhz: ADC_Sysclk_Mhz,
    getInterfaceName,
    getStaticConfigArr,
    isLoopBackAvailable,
    isGlobalForceAvailable,
}
