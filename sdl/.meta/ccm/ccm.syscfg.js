
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

function getModule() {

    let sdlVer = soc.getSdlVer("ccm");

    return system.getScript(`/sdl/ccm/${sdlVer}/sdl_ccm_${sdlVer}`);
}

exports = getModule();
