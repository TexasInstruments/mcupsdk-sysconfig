
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

function getModule() {

    let sdlVer = soc.getSdlVer("esm");

    return system.getScript(`/sdl/esm/${sdlVer}/sdl_esm_${sdlVer}`);
}

exports = getModule();
