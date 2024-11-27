let common = system.getScript("/common");

const ccm_config_r5 = [
    {
        name          : "SDL_R5SS0_CCM",
        ccmInst       : "SDL_R5SS0_CCM",
        esmInst       : "MAIN_ESM",
        esmEvtBUSMON  : "SDL_ESM_INTR_PULSE_R5SS0_BUS_MONITOR_ERR_PULSE",
        esmEvtCMP     : "SDL_ESM_INTR_PULSE_R5SS0_COMPARE_ERR_PULSE",
        esmEvtCPUMis  : "SDL_ESM_INTR_PULSE_R5SS0_CPU_MISCOMPARE_PULSE",
        esmEvtVIM     : "SDL_ESM_INTR_PULSE_R5SS0_VIM_COMPARE_ERR_PULSE",
        esmEvtTMU     : "SDL_ESM_INTR_PULSE_R5SS0_TMU_COMP_ERR",
        esmEvtRL2     : "SDL_ESM_INTR_PULSE_R5SS0_RL2_COMP_ERR",
        esmEvtSTEST   : "SDL_ESM_INTR_PULSE_CCM_0_SELFTEST_ERR",
        esmEvtLSCMP   : "SDL_ESM_INTR_PULSE_CCM_0_LOCKSTEP_COMPARE_ERR",
    }
];

function getConfigArr() {
    let ccm_config;

    if(common.getSelfSysCfgCoreName().includes("r5f"))
    {
        ccm_config = ccm_config_r5;
    }

    return ccm_config;
}

exports = {
    getConfigArr,
};
