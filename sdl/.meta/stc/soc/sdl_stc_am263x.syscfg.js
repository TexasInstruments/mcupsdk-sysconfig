let common = system.getScript("/common");

const stc_config = [
    {
        name    : "MAIN R5F0",
        stcInst : "SDL_STC_INST_MAINR5F0",
    },
    {
        name    : "MAIN R5F1",
        stcInst : "SDL_STC_INST_MAINR5F1",
    },
];

function getConfigArr() {
    return stc_config;
}

exports = {
    getConfigArr,
};
