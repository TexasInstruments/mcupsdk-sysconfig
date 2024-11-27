
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

function getModule() {

    let sdlVer = soc.getSdlVer("ecc");

    return system.getScript(`/sdl/ecc/${sdlVer}/sdl_ecc_${sdlVer}`);
}

exports = getModule();
