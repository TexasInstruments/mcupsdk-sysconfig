let common = system.getScript("/common");
let soc = system.getScript(`/board/soc/board_${common.getSocName()}`);

function getModule() {

    let ramDriverVer = soc.getDriverVer("serialRam");

    return system.getScript(`/board/ram/serialRam/${ramDriverVer}/serialram_${ramDriverVer}`);
}

exports = getModule();