let common = system.getScript("/common");

let topModules = [
    "/fs/freertos_fat/freertos_fat",
];

const topModulesNull = [
];

function getTopModules() {
    const fsSocList = ["am64x", "am243x", "am263x", "am263px", "am65x"];
    const lfsSocList = ["am64x", "am243x"];
    const lfsPath = "/fs/littlefs/littlefs"
    if(lfsSocList.includes(common.getSocName())){
        topModules.push(lfsPath);
    }

	if(fsSocList.includes(common.getSocName()) &&
    !common.getSelfSysCfgCoreName().includes("hsm")) {
		return topModules;
	} else {
		return topModulesNull;
	}
}

exports = common.getSelfSysCfgCoreName().includes('pru') ? {} : {
    displayName: "File System",
    topModules: getTopModules(),
};
