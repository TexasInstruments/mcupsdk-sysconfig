let common = system.getScript("/common");

const esm_events_main = [
	{
		name		: "SDL_ESM_INTR_LEVEL_EFC_ERROR",
		eventNum	: 0,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_EFS_AUTOLOAD_ERROR",
		eventNum	: 1,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_MCANSS0_ECC_CORR_LVL_INT",
		eventNum	: 2,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_MCANSS0_ECC_UNCORR_LVL_INT",
		eventNum	: 3,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_MCANSS1_ECC_CORR_LVL_INT",
		eventNum	: 4,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_MCANSS1_ECC_UNCORR_LVL_INT",
		eventNum	: 5,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_SOC_ECCAGG_CORR_LEVEL",
		eventNum	: 6,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_SOC_ECCAGG_UNCORR_LEVEL",
		eventNum	: 7,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_DCC0_ERR",
		eventNum	: 8,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_DCC1_ERR",
		eventNum	: 9,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_DCC2_ERR",
		eventNum	: 10,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_DCC3_ERR",
		eventNum	: 11,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_PLL_CORE_LOCKLOSS",
		eventNum	: 12,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_PLL_ETH_LOCKLOSS",
		eventNum	: 13,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_PLL_PER_LOCKLOSS",
		eventNum	: 14,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_RCREF_CLK_LOSS_DETECT",
		eventNum	: 15,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_HSM_ESM_HIGH_INTR",
		eventNum	: 16,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_HSM_ESM_LOW_INTR",
		eventNum	: 17,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_CRYSTAL_CLOCKLOSS",
		eventNum	: 18,
	},    
	{
		name		: "SDL_ESM_INTR_LEVEL_AGGREGATED_VBUSP_ERROR_H",
		eventNum	: 19,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_AGGREGATED_VBUSM_ERROR_H",
		eventNum	: 20,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_AGGREGATED_VBUSM_ERROR_L",
		eventNum	: 21,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_FOTA_STAT_ERR_INTR",
		eventNum	: 22,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_FSS_VBUSM_TIMEOUT",
		eventNum	: 23,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_OTFA_ERROR",
		eventNum	: 24,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_OSPI_ECC_CORR_LVL_INT",
		eventNum	: 25,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_OSPI_ECC_UNCORR_LVL_INT",
		eventNum	: 26,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_FSAS_ECC_INTR",
		eventNum	: 27,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_VOLTAGE_MONITOR_ERR_H",
		eventNum	: 28,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_VOLTAGE_MONITOR_ERR_L",
		eventNum	: 29,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_THERMAL_MONITOR_CRITICAL",
		eventNum	: 30,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_CPSW_ECC_SEC_PEND_INTR",
		eventNum	: 31,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_CPSW_ECC_DED_PEND_INTR",
		eventNum	: 32,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_LIVELOCK_0",
		eventNum	: 33,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_LIVELOCK_1",
		eventNum	: 34,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU0_TCM_ADDR_ERR",
		eventNum	: 35,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU1_TCM_ADDR_ERR",
		eventNum	: 36,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU0_ECC_CORRECTED_LEVEL",
		eventNum	: 37,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU0_ECC_UNCORRECTED_LEVEL",
		eventNum	: 38,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU1_ECC_CORRECTED_LEVEL",
		eventNum	: 39,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_CPU1_ECC_UNCORRECTED_LEVEL",
		eventNum	: 40,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_ECC_DE_TO_ESM_0",
		eventNum	: 41,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_ECC_DE_TO_ESM_1",
		eventNum	: 42,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_ECC_SE_TO_ESM_0",
		eventNum	: 43,
	},
    {
		name		: "SDL_ESM_INTR_LEVEL_R5SS0_ECC_SE_TO_ESM_1",
		eventNum	: 44,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_TPCC0_ERR_INTAGG",
		eventNum	: 45,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_OSPI1_ECC_CORR_LVL_INT",
		eventNum	: 46,
	},
	{
		name		: "SDL_ESM_INTR_LEVEL_OSPI1_ECC_UNCORR_LVL_INT",
		eventNum	: 47,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_RTI0_WWD_NMI",
		eventNum	: 64,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_RTI1_WWD_NMI",
		eventNum	: 65,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_TPCC_ERRINT",
		eventNum	: 66,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_BUS_MONITOR_ERR_PULSE",
		eventNum	: 67,
	},
    {
		name		: "SDL_ESM_INTR_PULSE_R5SS0_BUS_MONITOR_ERR_PULSE",
		eventNum	: 68,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_VIM_COMPARE_ERR_PULSE",
		eventNum	: 69,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU_MISCOMPARE_PULSE",
		eventNum	: 70,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_TMU_COMP_ERR",
		eventNum	: 71,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU0_TMU_PARITY_ERR",
		eventNum	: 72,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU1_TMU_PARITY_ERR",
		eventNum	: 73,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_RL2_COMP_ERR",
		eventNum	: 74,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_PR0_ECC_DED_ERR_REQ",
		eventNum	: 75,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_PR0_ECC_SEC_ERR_REQ",
		eventNum	: 76,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_PR1_ECC_DED_ERR_REQ",
		eventNum	: 77,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_PR1_ECC_SEC_ERR_REQ",
		eventNum	: 78,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_SRAM0_ECC_UNCORR_LEVEL",
		eventNum	: 79,
	},
    {
		name		: "SDL_ESM_INTR_PULSE_SRAM1_ECC_UNCORR_LEVEL",
		eventNum	: 80,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_SRAM2_ECC_UNCORR_LEVEL",
		eventNum	: 81,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_CCM_0_SELFTEST_ERR",
		eventNum	: 82,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_CCM_0_LOCKSTEP_COMPARE_ERR",
		eventNum	: 83,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_ADC_SAFETY_CHECKEVENT0",
		eventNum	: 84,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_ADC_SAFETY_CHECKEVENT1",
		eventNum	: 85,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_ADC_SAFETY_CHECKEVENT2",
		eventNum	: 86,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_ADC_SAFETY_CHECKEVENT3",
		eventNum	: 87,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_FOTA_ECC_UNCORR",
		eventNum	: 88,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_FOTA_ECC_CORR",
		eventNum	: 89,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU0_RL2_ECC_UNCORR",
		eventNum	: 90,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU0_RL2_ECC_CORR",
		eventNum	: 91,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU1_RL2_ECC_UNCORR",
		eventNum	: 92,
	},
	{
		name		: "SDL_ESM_INTR_PULSE_R5SS0_CPU1_RL2_ECC_CORR",
		eventNum	: 93,
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
