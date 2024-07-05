let common = system.getScript("/common");

let topModules = [
    "/fs/freertos_fat/freertos_fat",
];

const topModulesNull = [
];

function getTopModules() {
    const fsSocList = ["am64x", "am243x", "am263x", "am263px"];
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

exports = {
    displayName: "File System",
    topModules: getTopModules(),
};
