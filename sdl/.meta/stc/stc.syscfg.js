
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

function getModule() {

    let sdlVer = soc.getSdlVer("stc");

    return system.getScript(`/sdl/stc/${sdlVer}/sdl_stc_${sdlVer}`);
}

exports = getModule();
