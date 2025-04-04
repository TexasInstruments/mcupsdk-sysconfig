let common = system.getScript("/common");

let topModules = [
];

const topModulesNull = [
];

function getTopModules() {
    const fsSocList = ["am64x", "am243x", "am263x", "am263px", "am65x","am261x"];
    const lfsSocList = ["am64x", "am243x","am263px","am263x", "am273x","am261x"];
    const lfsPath = "/fs/littlefs/littlefs";
    const fsPath = "/fs/freertos_fat/freertos_fat";

    if(fsSocList.includes(common.getSocName())){
        topModules.push(fsPath);
    }

    if(lfsSocList.includes(common.getSocName())){
        topModules.push(lfsPath);
    }

	if((fsSocList.includes(common.getSocName()) || lfsSocList.includes(common.getSocName())) &&
    !(common.getSelfSysCfgCoreName().includes("hsm") || (common.getSelfSysCfgCoreName() == "m4fss0-1"))) {
		return topModules;
	} else {
		return topModulesNull;
	}
}

exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
    displayName: "File System",
    topModules: getTopModules(),
};
