let common = system.getScript("/common");

const esm_events_main = [
	{
		name		: "SDL_ESM0_EFC_ERROR",
		eventNum	: 0,
	},
	{
		name		: "SDL_ESM0_EFUSE_EFS_AUTOLOAD_ERROR",
		eventNum	: 1,
	},
	{
		name		: "SDL_ESM0_MCAN0_MCAN0_ECC_CORR_LVL_INT",
		eventNum	: 2,
	},
	{
		name		: "SDL_ESM0_MCAN0_MCAN0_ECC_UNCORR_LVL_INT",
		eventNum	: 3,
	},
	{
		name		: "SDL_ESM0_MCAN1_MCAN1_ECC_CORR_LVL_INT",
		eventNum	: 4,
	},
	{
		name		: "SDL_ESM0_MCAN1_MCAN1_ECC_UNCORR_LVL_INT",
		eventNum	: 5,
	},
	{
		name		: "SDL_ESM0_MCAN2_MCAN2_ECC_CORR_LVL_INT",
		eventNum	: 6,
	},
	{
		name		: "SDL_ESM0_MCAN2_MCAN2_ECC_UNCORR_LVL_INT",
		eventNum	: 7,
	},
	{
		name		: "SDL_ESM0_MCAN3_MCAN3_ECC_CORR_LVL_INT",
		eventNum	: 8,
	},
	{
		name		: "SDL_ESM0_MCAN3_MCAN3_ECC_UNCORR_LVL_INT",
		eventNum	: 9,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_LIVELOCK_0",
		eventNum	: 10,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_LIVELOCK_1",
		eventNum	: 11,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE0_R5FSS1_LIVELOCK_0",
		eventNum	: 12,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE1_R5FSS1_LIVELOCK_1",
		eventNum	: 13,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_CORE0_TCMADDR_ERR",
		eventNum	: 14,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_CORE1_TCMADDR_ERR",
		eventNum	: 15,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE0_R5FSS1_CORE0_TCMADDR_ERR",
		eventNum	: 16,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE1_R5FSS1_CORE1_TCMADDR_ERR",
		eventNum	: 17,
	},
	{
		name		: "SDL_ESM0_ECC_AGGREGATOR_SOC_ECCAGG_CORR_LEVEL",
		eventNum	: 19,
	},
	{
		name		: "SDL_ESM0_ECC_AGGREGATOR_SOC_ECCAGG_UNCORR_LEVEL",
		eventNum	: 20,
	},
	{
		name		: "SDL_ESM0_DCC0_DCC0_ERR",
		eventNum	: 21,
	},
	{
		name		: "SDL_ESM0_DCC1_DCC1_ERR",
		eventNum	: 22,
	},
	{
		name		: "SDL_ESM0_DCC2_DCC2_ERR",
		eventNum	: 23,
	},
	{
		name		: "SDL_ESM0_DCC3_DCC3_ERR",
		eventNum	: 24,
	},
	{
		name		: "SDL_ESM0_CORE_PLL_PLL_CORE_LOCKLOSS",
		eventNum	: 25,
	},
	{
		name		: "SDL_ESM0_PERI_PLL_PLL_PER_LOCKLOSS",
		eventNum	: 26,
	},
	{
		name		: "SDL_ESM0_RCOSC_RCREF_CLK_LOSS_DETECT",
		eventNum	: 27,
	},
	{
		name		: "SDL_ESM0_HSM_ESM_HIGH_INTR",
		eventNum	: 28,
	},
	{
		name		: "SDL_ESM0_HSM_ESM_LOW_INTR",
		eventNum	: 29,
	},
	{
		name		: "SDL_ESM0_XTAL_CRYSTAL_CLOCKLOSS",
		eventNum	: 30,
	},
	{
		name		: "SDL_ESM0_AGGREGATED_VBUSP_ERROR_AGGREGATED_VBUSP_ERROR_H",
		eventNum	: 31,
	},
	{
		name		: "SDL_ESM0_AGGREGATED_VBUSM_RRROR_AGGREGATED_VBUSM_ERROR_H",
		eventNum	: 33,
	},
	{
		name		: "SDL_ESM0_AGGREGATED_VBUSM_RRROR_AGGREGATED_VBUSM_ERROR_L",
		eventNum	: 34,
	},
    {
		name		: "SDL_ESM0_OSPI_ECC_UNCORR",
		eventNum	: 39,
	},
    {
		name		: "SDL_ESM0_OSPI_ECC_CORR",
		eventNum	: 40,
	},
	{
		name		: "SDL_ESM0_VOLTAGE_MONITOR_ERR_H",
		eventNum	: 41,
	},
	{
		name		: "SDL_ESM0_VMON_VOLTAGE_MONITOR_ERR_L",
		eventNum	: 42,
	},
	{
		name		: "SDL_ESM0_THERMAL_MONITOR_CRITICAL",
		eventNum	: 44,
	},
	{
		name		: "SDL_ESM0_CPSW3G_CPSW_ECC_SEC_PEND_INTR",
		eventNum	: 45,
	},
	{
		name		: "SDL_ESM0_CPSW3G_CPSW_ECC_DED_PEND_INTR",
		eventNum	: 46,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_CORE0_ECC_CORRECTED_LEVEL_0",
		eventNum	: 47,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_CORE0_ECC_UNCORRECTED_LEVEL_0",
		eventNum	: 48,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_CORE1_ECC_CORRECTED_LEVEL_0",
		eventNum	: 49,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_CORE1_ECC_UNCORRECTED_LEVEL_0",
		eventNum	: 50,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_ECC_DE_TO_ESM_0_0",
		eventNum	: 51,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_ECC_DE_TO_ESM_1_0",
		eventNum	: 52,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS0_ECC_SE_TO_ESM_0_0",
		eventNum	: 53,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS0_ECC_SE_TO_ESM_1_0",
		eventNum	: 54,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE0_R5FSS1_CORE0_ECC_CORRECTED_LEVEL_0",
		eventNum	: 55,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE0_R5FSS1_CORE0_ECC_UNCORRECTED_LEVEL_0",
		eventNum	: 56,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE1_R5FSS1_CORE1_ECC_CORRECTED_LEVEL_0",
		eventNum	: 57,
	},
	{
		name		: "SDL_ESM0_R5FSS1_CORE1_R5FSS1_CORE1_ECC_UNCORRECTED_LEVEL_0",
		eventNum	: 58,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS1_ECC_DE_TO_ESM_0_0",
		eventNum	: 59,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS1_ECC_DE_TO_ESM_1_0",
		eventNum	: 60,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE0_R5FSS1_ECC_SE_TO_ESM_0_0",
		eventNum	: 61,
	},
	{
		name		: "SDL_ESM0_R5FSS0_CORE1_R5FSS1_ECC_SE_TO_ESM_1_0",
		eventNum	: 62,
	},
    {
		name		: "SDL_ESM0_EDMA0_TPCC_ERRINTAGG",
		eventNum	: 63,
	},
	{
		name		: "SDL_ESM0_RTI0_WWD_NMI",
		eventNum	: 64,
	},
	{
		name		: "SDL_ESM0_WWDT1_RTI1_WWD_NMI",
		eventNum	: 65,
	},
	{
		name		: "SDL_ESM0_WWDT2_RTI2_WWD_NMI",
		eventNum	: 66,
	},
	{
		name		: "SDL_ESM0_WWDT3_RTI3_WWD_NMI",
		eventNum	: 67,
	},
	{
		name		: "SDL_ESM0_EDMA0_TPCC_ERRINT",
		eventNum	: 68,
	},
	{
		name		: "SDL_ESM0_R5FSS0_R5FSS0_BUS_MONITOR_ERR_PULSE_0",
		eventNum	: 69,
	},
	{
		name		: "SDL_ESM0_R5FSS0_R5FSS0_COMPARE_ERR_PULSE_0",
		eventNum	: 70,
	},
	{
		name		: "SDL_ESM0_R5FSS0_R5FSS0_VIM_COMPARE_ERR_PULSE_0",
		eventNum	: 71,
	},
	{
		name		: "SDL_ESM0_R5FSS0_R5FSS0_CPU_MISCOMPARE_PULSE_0",
		eventNum	: 72,
	},
	{
		name		: "SDL_ESM0_R5FSS1_R5FSS1_BUS_MONITOR_ERR_PULSE_0",
		eventNum	: 73,
	},
	{
		name		: "SDL_ESM0_R5FSS1_R5FSS1_COMPARE_ERR_PULSE_0",
		eventNum	: 74,
	},
	{
		name		: "SDL_ESM0_R5FSS1_R5FSS1_VIM_COMPARE_ERR_PULSE_0",
		eventNum	: 75,
	},
	{
		name		: "SDL_ESM0_R5FSS1_R5FSS1_CPU_MISCOMPARE_PULSE_0",
		eventNum	: 76,
	},
	{
		name		: "SDL_ESM0_PRU_ICSSM0_PR1_ECC_DED_ERR_REQ",
		eventNum	: 77,
	},
	{
		name		: "SDL_ESM0_PRU_ICSSM0_PR1_ECC_SEC_ERR_REQ",
		eventNum	: 78,
	},
	{
		name		: "SDL_ESM0_SRAM_BANK_0_SRAM0_ECC_UNCORR_PULSE",
		eventNum	: 79,
	},
	{
		name		: "SDL_ESM0_SRAM_BANK_1_SRAM1_ECC_UNCORR_PULSE",
		eventNum	: 80,
	},
	{
		name		: "SDL_ESM0_SRAM_BANK_2_SRAM2_ECC_UNCORR_PULSE",
		eventNum	: 81,
	},
	{
		name		: "SDL_ESM0_SRAM_BANK_3_SRAM3_ECC_UNCORR_PULSE",
		eventNum	: 82,
	},
	{
		name		: "SDL_ESM0_CCM_0_SELFTEST_ERR",
		eventNum	: 83,
	},
	{
		name		: "SDL_ESM0_CCM_0_LOCKSTEP_COMPARE_ERR",
		eventNum	: 84,
	},
	{
		name		: "SDL_ESM0_CCM_1_SELFTEST_ERR",
		eventNum	: 85,
	},
	{
		name        : "SDL_ESM0_CCM_1_LOCKSTEP_COMPARE_ERR",
        eventNum    : 86,
	},
    {
		name        : "SDL_ESM0_R5FSS0_TMU_COMPARE_ERR",
        eventNum    : 87,
	},
	{
		name        : "SDL_ESM0_R5FSS0_CPU0_TMU_PARITY_ERR",
        eventNum    : 88,
	},
	{
		name        : "SDL_ESM0_R5FSS0_CPU2_TMU_PARITY_ERR",
        eventNum    : 89,
	},
	{
		name        : "SDL_ESM0_R5FSS1_TMU_COMPARE_ERR",
        eventNum    : 90,
	},
	{
		name        : "SDL_ESM0_R5FSS1_CPU0_TMU_PARITY_ERR",
        eventNum    : 91,
	},
	{
		name        : "SDL_ESM0_R5FSS1_CPU2_TMU_PARITY_ERR",
        eventNum    : 92,
	},
	{
		name        : "SDL_ESM0_R5FSS0_RL2_COMPARE_ERR",
        eventNum    : 93,
	},
	{
		name        : "SDL_ESM0_R5FSS1_RL2_COMPARE_ERR",
        eventNum    : 94,
	},
	{
		name        : "SDL_ESM0_ADC_SAFETY_CHECKEVENT0",
        eventNum    : 95,
	},
	{
		name        : "SDL_ESM0_ADC_SAFETY_CHECKEVENT1",
        eventNum    : 96,
	},
	{
		name        : "SDL_ESM0_ADC_SAFETY_CHECKEVENT2",
        eventNum    : 97,
	},
	{
		name        : "SDL_ESM0_ADC_SAFETY_CHECKEVENT3",
        eventNum    : 98,
	},
	{
		name        : "SDL_ESM0_OTFA_ECC_UNCORR",
        eventNum    : 99,
	},
	{
		name        : "SDL_ESM0_OTFA_ECC_CORR",
        eventNum    : 100,
	},
	{
		name        : "SDL_ESM0_SRAM_BANK_4_SRAM4_ECC_UNCORR_PULSE",
        eventNum    : 101,
	},
	{
		name        : "SDL_ESM0_SRAM_BANK_5_SRAM5_ECC_UNCORR_PULSE",
        eventNum    : 102,
	},
	{
		name        : "SDL_ESM0_MCAN4_MCAN4_ECC_CORR_PLS_INT",
        eventNum    : 103,
	},
	{
		name        : "SDL_ESM0_MCAN4_MCAN4_ECC_UNCORR_LVL_INT",
        eventNum    : 104,
	},
	{
		name        : "SDL_ESM0_MCAN5_MCAN5_ECC_CORR_LVL_INT",
        eventNum    : 105,
	},
	{
		name        : "SDL_ESM0_MCAN5_MCAN5_ECC_UNCORR_LVL_INT",
        eventNum    : 106,
	},
	{
		name        : "SDL_ESM0_MCAN6_MCAN6_ECC_CORR_LVL_INT",
        eventNum    : 107,
	},
	{
		name        : "SDL_ESM0_MCAN6_MCAN6_ECC_UNCORR_LVL_INT",
        eventNum    : 108,
	},
	{
		name        : "SDL_ESM0_MCAN7_MCAN7_ECC_CORR_LVL_INT",
        eventNum    : 109,
	},
	{
		name        : "SDL_ESM0_MCAN7_MCAN7_ECC_UNCORR_LVL_INT",
        eventNum    : 110,
	},
];

const esm_config_main = [
    {
        name                : "MAIN_ESM",
        esmInst             : "SDL_ESM_INST_MAIN_ESM0",
        esmIdx              : 0,
        esmEvents           : esm_events_main,
    },
];

function getConfigArr() {
    let esm_config;

    if(common.getSelfSysCfgCoreName().includes("r5f"))
    {
        esm_config = esm_config_main;
    }

    return esm_config;
}

exports = {
    getConfigArr,
};
