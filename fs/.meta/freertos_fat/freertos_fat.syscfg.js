let common = system.getScript("/common");

let freertos_fat_module_name = "/fs/freertos_fat/freertos_fat";

let freertos_fat_module = {
	displayName: "FreeRTOS FAT",
	templates: {
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/fs/freertos_fat/templates/freertos_fat.h.xdt",
        },
	    "/drivers/system/drivers_open_close.c.xdt": {
	        driver_open_close_config: "/fs/freertos_fat/templates/freertos_fat_open_close_config.c.xdt",
	        driver_open: "/fs/freertos_fat/templates/freertos_fat_open.c.xdt",
	        driver_close: "/fs/freertos_fat/templates/freertos_fat_close.c.xdt",
	    },
	    "/drivers/system/drivers_open_close.h.xdt": {
	        driver_open_close_config: "/fs/freertos_fat/templates/freertos_fat_open_close.h.xdt",
	    },
	},
	defaultInstanceName: "CONFIG_FREERTOS_FAT",
	config: [
		{
			name: "media",
			displayName: "Select Media",
			description: "Select the media which is to be used underneath the virtual file system provided by FreeRTOS FAT",
			default: (common.getSocName() == "am261x") ? "EMMC" : "SD",
			options: () => { 
							return ((common.getSocName() == "am261x") ? 
							[ {name: "EMMC" }] :
							[ { name: "SD" },{ name: "EMMC" }])
						}
		},
	],
	moduleInstances: moduleInstances,
	validate: onValidate,
};

function moduleInstances(inst) {

    let modInstances = new Array();
    let moduleSelectName = "";

    switch(inst.media) {
    	case "SD":
            moduleSelectName = "MMC1";
            if ((common.getSocName() == "am263x") || (common.getSocName() == "am263px") || (common.getSocName() == "am65x"))
            {
                moduleSelectName = "MMC";
            }
    		modInstances.push({
    		    name: "peripheralDriver",
    		    displayName: "MMCSD Configuration",
    		    moduleName: '/drivers/mmcsd/mmcsd',
    		    useArray: false,
    		    requiredArgs: {
    		        moduleSelect: moduleSelectName,
                    cardType : "SD",
    		    },
    		});
    		break;
    	case "EMMC":
            moduleSelectName = "MMC0";
            if ((common.getSocName() == "am263x") || (common.getSocName() == "am263px") || (common.getSocName() == "am261x") || (common.getSocName() == "am65x"))
            {
                moduleSelectName = "MMC";
            }
    		modInstances.push({
    		    name: "peripheralDriver",
    		    displayName: "MMCSD Configuration",
    		    moduleName: '/drivers/mmcsd/mmcsd',
    		    useArray: false,
    		    requiredArgs: {
    		        moduleSelect: moduleSelectName,
                    cardType : "EMMC",
    		    },
    		});
    		break;
    }

    return (modInstances);
}


function onValidate(inst, report){

	let valid_media_options_across_socs = ["SD", "EMMC"]

	if( !(valid_media_options_across_socs.includes(inst.media)) ){
		report.logError("Invalid Freertos media option!", inst, "media")
	}
}

exports = freertos_fat_module;