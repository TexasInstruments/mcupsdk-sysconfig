let common = system.getScript("/common");

const ccm_config_r5 = [
    {
        name          : "SDL_R5SS0_CCM",
        ccmInst       : "SDL_R5SS0_CCM",
        esmInst       : "MAIN_ESM",
        esmEvtBUSMON  : "SDL_ESM0_R5FSS0_R5FSS0_BUS_MONITOR_ERR_PULSE_0",
        esmEvtCMP     : "SDL_ESM0_R5FSS0_R5FSS0_COMPARE_ERR_PULSE_0",
        esmEvtCPUMis  : "SDL_ESM0_R5FSS0_R5FSS0_CPU_MISCOMPARE_PULSE_0",
        esmEvtVIM     : "SDL_ESM0_R5FSS0_R5FSS0_VIM_COMPARE_ERR_PULSE_0",
        esmEvtTMU     : "SDL_ESM0_R5FSS0_TMU_COMPARE_ERR",
        esmEvtRL2     : "SDL_ESM0_R5FSS0_RL2_COMPARE_ERR",
        esmEvtSTEST   : "SDL_ESM0_CCM_0_SELFTEST_ERR",
        esmEvtLSCMP   : "SDL_ESM0_CCM_0_LOCKSTEP_COMPARE_ERR",
    },
    {
        name          : "SDL_R5SS1_CCM",
        ccmInst       : "SDL_R5SS1_CCM",
        esmInst       : "MAIN_ESM",
        esmEvtBUSMON  : "SDL_ESM0_R5FSS1_R5FSS1_BUS_MONITOR_ERR_PULSE_0",
        esmEvtCMP     : "SDL_ESM0_R5FSS1_R5FSS1_COMPARE_ERR_PULSE_0",
        esmEvtCPUMis  : "SDL_ESM0_R5FSS1_R5FSS1_CPU_MISCOMPARE_PULSE_0",
        esmEvtVIM     : "SDL_ESM0_R5FSS1_R5FSS1_VIM_COMPARE_ERR_PULSE_0",
        esmEvtTMU     : "SDL_ESM0_R5FSS1_TMU_COMPARE_ERR",
        esmEvtRL2     : "SDL_ESM0_R5FSS1_RL2_COMPARE_ERR",
        esmEvtSTEST   : "SDL_ESM0_CCM_1_SELFTEST_ERR",
        esmEvtLSCMP   : "SDL_ESM0_CCM_1_LOCKSTEP_COMPARE_ERR",
    },
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
