
let common = system.getScript("/common");
let soc = system.getScript(`/sdl/soc/sdl_${common.getSocName()}`);

function getModule() {

    let sdlVer = soc.getSdlVer("dcc");

    return system.getScript(`/sdl/dcc/${sdlVer}/sdl_dcc_${sdlVer}`);
}

exports = getModule();
