let common = system.getScript("/common");

const ecc_endpts_0 = [
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV0_ECC_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV1_ECC_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV2_ECC_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV3_ECC_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MAILBOX_ECC_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_TPTC_A0_ECC_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_TPTC_A1_ECC_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV4_ECC_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_SOC_ECC_AGGR_MSS_L2_SLV5_ECC_RAM_ID",
                endptNum        : 8,
        },       
];

const ecc_endpts_1 = [
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_ITAG_RAM0_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_ITAG_RAM1_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_ITAG_RAM2_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_ITAG_RAM3_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_IDATA_BANK0_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_IDATA_BANK1_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_IDATA_BANK2_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_IDATA_BANK3_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DTAG_RAM0_RAM_ID",
                endptNum        : 8,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DTAG_RAM1_RAM_ID",
                endptNum        : 9,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DTAG_RAM2_RAM_ID",
                endptNum        : 10,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DTAG_RAM3_RAM_ID",
                endptNum        : 11,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDIRTY_RAM_RAM_ID",
                endptNum        : 12,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM0_RAM_ID",
                endptNum        : 13,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM1_RAM_ID",
                endptNum        : 14,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM2_RAM_ID",
                endptNum        : 15,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM3_RAM_ID",
                endptNum        : 16,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM4_RAM_ID",
                endptNum        : 17,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM5_RAM_ID",
                endptNum        : 18,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM6_RAM_ID",
                endptNum        : 19,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_DDATA_RAM7_RAM_ID",
                endptNum        : 20,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_ATCM0_BANK0_RAM_ID",
                endptNum        : 21,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_ATCM0_BANK1_RAM_ID",
                endptNum        : 22,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_B0TCM0_BANK0_RAM_ID",
                endptNum        : 23,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_B0TCM0_BANK1_RAM_ID",
                endptNum        : 24,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_B1TCM0_BANK0_RAM_ID",
                endptNum        : 25,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_PULSAR_SL_B1TCM0_BANK1_RAM_ID",
                endptNum        : 26,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_KS_VIM_RAMECC_RAM_ID",
                endptNum        : 27,
        },
        {
                name            : "SDL_R5FSS0_CORE0_ECC_AGGR_CPU0_KS_RL2_RAMECC_RAM_ID",
                endptNum        : 28,
        },
];

const ecc_endpts_2 = [
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_ITAG_RAM0_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_ITAG_RAM1_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_ITAG_RAM2_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_ITAG_RAM3_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_IDATA_BANK0_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_IDATA_BANK1_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_IDATA_BANK2_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_IDATA_BANK3_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DTAG_RAM0_RAM_ID",
                endptNum        : 8,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DTAG_RAM1_RAM_ID",
                endptNum        : 9,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DTAG_RAM2_RAM_ID",
                endptNum        : 10,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DTAG_RAM3_RAM_ID",
                endptNum        : 11,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDIRTY_RAM_RAM_ID",
                endptNum        : 12,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM0_RAM_ID",
                endptNum        : 13,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM1_RAM_ID",
                endptNum        : 14,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM2_RAM_ID",
                endptNum        : 15,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM3_RAM_ID",
                endptNum        : 16,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM4_RAM_ID",
                endptNum        : 17,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM5_RAM_ID",
                endptNum        : 18,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM6_RAM_ID",
                endptNum        : 19,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_DDATA_RAM7_RAM_ID",
                endptNum        : 20,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_ATCM1_BANK0_RAM_ID",
                endptNum        : 21,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_ATCM1_BANK1_RAM_ID",
                endptNum        : 22,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_B0TCM1_BANK0_RAM_ID",
                endptNum        : 23,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_B0TCM1_BANK1_RAM_ID",
                endptNum        : 24,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_B1TCM1_BANK0_RAM_ID",
                endptNum        : 25,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_PULSAR_SL_B1TCM1_BANK1_RAM_ID",
                endptNum        : 26,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_KS_VIM_RAMECC_RAM_ID",
                endptNum        : 27,
        },
        {
                name            : "SDL_R5FSS0_CORE1_ECC_AGGR_CPU1_KS_RL2_RAMECC_RAM_ID",
                endptNum        : 28,
        },
];

const ecc_endpts_3 = [
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_ITAG_RAM0_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_ITAG_RAM1_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_ITAG_RAM2_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_ITAG_RAM3_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_IDATA_BANK0_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_IDATA_BANK1_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_IDATA_BANK2_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_IDATA_BANK3_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DTAG_RAM0_RAM_ID",
                endptNum        : 8,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DTAG_RAM1_RAM_ID",
                endptNum        : 9,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DTAG_RAM2_RAM_ID",
                endptNum        : 10,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DTAG_RAM3_RAM_ID",
                endptNum        : 11,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDIRTY_RAM_RAM_ID",
                endptNum        : 12,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM0_RAM_ID",
                endptNum        : 13,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM1_RAM_ID",
                endptNum        : 14,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM2_RAM_ID",
                endptNum        : 15,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM3_RAM_ID",
                endptNum        : 16,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM4_RAM_ID",
                endptNum        : 17,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM5_RAM_ID",
                endptNum        : 18,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM6_RAM_ID",
                endptNum        : 19,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_DDATA_RAM7_RAM_ID",
                endptNum        : 20,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_ATCM0_BANK0_RAM_ID",
                endptNum        : 21,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_ATCM0_BANK1_RAM_ID",
                endptNum        : 22,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_B0TCM0_BANK0_RAM_ID",
                endptNum        : 23,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_B0TCM0_BANK1_RAM_ID",
                endptNum        : 24,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_B1TCM0_BANK0_RAM_ID",
                endptNum        : 25,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_PULSAR_SL_B1TCM0_BANK1_RAM_ID",
                endptNum        : 26,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_KS_VIM_RAMECC_RAM_ID",
                endptNum        : 27,
        },
        {
                name            : "SDL_R5FSS1_CORE0_ECC_AGGR_CPU0_KS_RL2_RAMECC_RAM_ID",
                endptNum        : 28,
        },
];

const ecc_endpts_4 = [
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_ITAG_RAM0_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_ITAG_RAM1_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_ITAG_RAM2_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_ITAG_RAM3_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_IDATA_BANK0_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_IDATA_BANK1_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_IDATA_BANK2_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_IDATA_BANK3_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DTAG_RAM0_RAM_ID",
                endptNum        : 8,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DTAG_RAM1_RAM_ID",
                endptNum        : 9,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DTAG_RAM2_RAM_ID",
                endptNum        : 10,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DTAG_RAM3_RAM_ID",
                endptNum        : 11,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDIRTY_RAM_RAM_ID",
                endptNum        : 12,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM0_RAM_ID",
                endptNum        : 13,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM1_RAM_ID",
                endptNum        : 14,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM2_RAM_ID",
                endptNum        : 15,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM3_RAM_ID",
                endptNum        : 16,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM4_RAM_ID",
                endptNum        : 17,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM5_RAM_ID",
                endptNum        : 18,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM6_RAM_ID",
                endptNum        : 19,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_DDATA_RAM7_RAM_ID",
                endptNum        : 20,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_ATCM1_BANK0_RAM_ID",
                endptNum        : 21,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_ATCM1_BANK1_RAM_ID",
                endptNum        : 22,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_B0TCM1_BANK0_RAM_ID",
                endptNum        : 23,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_B0TCM1_BANK1_RAM_ID",
                endptNum        : 24,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_B1TCM1_BANK0_RAM_ID",
                endptNum        : 25,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_PULSAR_SL_B1TCM1_BANK1_RAM_ID",
                endptNum        : 26,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_KS_VIM_RAMECC_RAM_ID",
                endptNum        : 27,
        },
        {
                name            : "SDL_R5FSS1_CORE1_ECC_AGGR_CPU1_KS_RL2_RAMECC_RAM_ID",
                endptNum        : 28,
        },
];

const ecc_endpts_5 = [
        {
                name            : "SDL_HSM_ECC_AGGR_RAMB0_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_RAMB1_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_RAMB2_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_RAMB3_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_SECUREB4_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_MBOX_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_SECURE_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_ROM_RAM_ID",
                endptNum        : 7,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_TPTC_A0_RAM_ID",
                endptNum        : 8,
        },
        {
                name            : "SDL_HSM_ECC_AGGR_TPTC_A1_RAM_ID",
                endptNum        : 9,
        },
];

const ecc_endpts_6 = [
        {
                name            : "SDL_PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR_ICSS_G_CORE_DRAM0_ECC_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR_ICSS_G_CORE_DRAM1_ECC_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR_ICSS_G_CORE_PR1_PDSP0_IRAM_ECC_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR_ICSS_G_CORE_PR1_PDSP1_IRAM_ECC_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR_ICSS_G_CORE_RAM_ECC_RAM_ID",
                endptNum        : 4,
        },
];

const ecc_endpts_7 = [
        {
                name            : "SDL_MCAN0_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_8 = [
        {
                name            : "SDL_MCAN1_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_9 = [
        {
                name            : "SDL_MCAN2_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_10 = [
        {
                name            : "SDL_MCAN3_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_11 = [
        {
                name            : "SDL_MCAN4_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_12 = [
        {
                name            : "SDL_MCAN5_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_13 = [
        {
                name            : "SDL_MCAN6_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_14 = [
        {
                name            : "SDL_MCAN7_MCANSS_MSGMEM_WRAP_ECC_AGGR_MCANSS_MSGMEM_WRAP_MSGMEM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_endpts_15 = [
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW3GCSS_ALE_RAM_ECC_RAM_ID",
                endptNum        : 0,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL1_ECC_RAM_ID",
                endptNum        : 1,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL2_ECC_RAM_ID",
                endptNum        : 2,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL3_ECC_RAM_ID",
                endptNum        : 3,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL4_ECC_RAM_ID",
                endptNum        : 4,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL5_ECC_RAM_ID",
                endptNum        : 5,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW_3GC_CORE_ECC_ECC_CTRL6_ECC_RAM_ID",
                endptNum        : 6,
        },
        {
                name            : "SDL_CPSW3GCSS_ECC_AGGR_CPSW3GCSS_EST_RAM_ECC_RAM_ID",
                endptNum        : 0,
        },
];

const ecc_config_main = [
    {
        name          : "SOC_ECC_AGGR",
        eccInst       : "SDL_SOC_ECC_AGGR",
        eccEndpts     : ecc_endpts_0,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_ECC_AGGREGATOR_SOC_ECCAGG_CORR_LEVEL",
        esmEvtUncor   : "SDL_ESM0_ECC_AGGREGATOR_SOC_ECCAGG_UNCORR_LEVEL",
    },
    {
        name          : "R5FSS0_CORE0_ECC_AGGR",
        eccInst       : "SDL_R5FSS0_CORE0_ECC_AGGR",
        eccEndpts     : ecc_endpts_1,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_R5FSS0_CORE0_R5FSS0_CORE0_ECC_CORRECTED_LEVEL_0",
        esmEvtUncor   : "SDL_ESM0_R5FSS0_CORE0_R5FSS0_CORE0_ECC_UNCORRECTED_LEVEL_0",
    },
    {
        name          : "R5FSS0_CORE1_ECC_AGGR",
        eccInst       : "SDL_R5FSS0_CORE1_ECC_AGGR",
        eccEndpts     : ecc_endpts_2,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_R5FSS0_CORE1_R5FSS0_CORE1_ECC_CORRECTED_LEVEL_0",
        esmEvtUncor   : "SDL_ESM0_R5FSS0_CORE1_R5FSS0_CORE1_ECC_UNCORRECTED_LEVEL_0",
    },
    {
        name          : "R5FSS1_CORE0_ECC_AGGR",
        eccInst       : "SDL_R5FSS1_CORE0_ECC_AGGR",
        eccEndpts     : ecc_endpts_3,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_R5FSS1_CORE0_R5FSS1_CORE0_ECC_CORRECTED_LEVEL_0",
        esmEvtUncor   : "SDL_ESM0_R5FSS1_CORE0_R5FSS1_CORE0_ECC_UNCORRECTED_LEVEL_0",
    },
    {
        name          : "R5FSS1_CORE1_ECC_AGGR",
        eccInst       : "SDL_R5FSS1_CORE1_ECC_AGGR",
        eccEndpts     : ecc_endpts_4,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_R5FSS1_CORE1_R5FSS1_CORE1_ECC_CORRECTED_LEVEL_0",
        esmEvtUncor   : "SDL_ESM0_R5FSS1_CORE1_R5FSS1_CORE1_ECC_UNCORRECTED_LEVEL_0",
    },
    {
        name          : "HSM_ECC_AGGR",
        eccInst       : "SDL_HSM_ECC_AGGR",
        eccEndpts     : ecc_endpts_5,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_HSM_ESM_LOW_INTR",
        esmEvtUncor   : "SDL_ESM0_HSM_ESM_HIGH_INTR",
    },
    {
        name          : "PRU_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR",
        eccInst       : "SDL_ICSSM_ICSS_G_CORE_BORG_ECC_AGGR",
        eccEndpts     : ecc_endpts_6,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_PRU_ICSSM0_PR1_ECC_DED_ERR_REQ",
        esmEvtUncor   : "SDL_ESM0_PRU_ICSSM0_PR1_ECC_SEC_ERR_REQ",
    },
    {
        name          : "MCAN0_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN0_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_7,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN0_MCAN0_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN0_MCAN0_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN1_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN1_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_8,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN1_MCAN1_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN1_MCAN1_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN2_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN2_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_9,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN2_MCAN2_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN2_MCAN2_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN3_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN3_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_10,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN3_MCAN3_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN3_MCAN3_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN4_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN4_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_11,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN4_MCAN4_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN4_MCAN4_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN5_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN5_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_12,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN5_MCAN5_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN5_MCAN5_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN6_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN6_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_13,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN6_MCAN6_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN6_MCAN6_ECC_UNCORR_LVL_INT",
    },
    {
        name          : "MCAN7_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccInst       : "SDL_MCAN7_MCANSS_MSGMEM_WRAP_ECC_AGGR",
        eccEndpts     : ecc_endpts_14,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_MCAN7_MCAN7_ECC_CORR_LVL_INT",
        esmEvtUncor   : "SDL_ESM0_MCAN7_MCAN7_ECC_UNCORR_LVL_INT",
    },
        {
        name          : "CPSW3GCSS_ECC_AGGR",
        eccInst       : "SDL_CPSW3GCSS_ECC_AGGR",
        eccEndpts     : ecc_endpts_11,
        esmInst       : "MAIN_ESM",
        esmEvtCor     : "SDL_ESM0_CPSW3G_CPSW_ECC_SEC_PEND_INTR",
        esmEvtUncor   : "SDL_ESM0_CPSW3G_CPSW_ECC_DED_PEND_INTR",
    },
];

function getConfigArr() {
    let ecc_config;

    if(common.getSelfSysCfgCoreName().includes("r5f"))
    {
        ecc_config = ecc_config_main;
    }

    return ecc_config;
}

exports = {
    getConfigArr,
};
