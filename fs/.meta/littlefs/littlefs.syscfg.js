let common = system.getScript("/common");
let littlefs_module_name = "/fs/littlefs/littlefs";
let flash_module = system.getScript("/board/flash/flash");
let soc_flash_module = system.getScript(`/board/flash/flash_${common.getSocName()}`);

let littlefs_module = {
	displayName: "LittleFS",
    templates: {
        "/board/board/board_config.h.xdt": {
            board_config: "/fs/littlefs/templates/littlefs.h.xdt",
        },
	    "/board/board/board_open_close.c.xdt": {
	        board_open_close_config: "/fs/littlefs/templates/littlefs_open_close_config.c.xdt",
	        board_open: "/fs/littlefs/templates/littlefs_open.c.xdt",
	        board_close: "/fs/littlefs/templates/littlefs_close.c.xdt",
	    },
	    "/board/board/board_open_close.h.xdt": {
	        board_open_close_config: "/fs/littlefs/templates/littlefs_open_close.h.xdt",
	    },
	},
	defaultInstanceName: "CONFIG_LITTLEFS",
    validate: validate,
	config: [
		{
			name: "media",
			displayName: "Select Media",
			description: "Select the media which is to be used underneath the virtual file system provided by LittleFS",
			default: "FLASH",
		    options: [
				{ name: "FLASH" },
			]
		},
        {
            name: "flashOffset",
            displayName: "Flash Offset",
            description: "Offset of the Flash memory used by LittleFS",
            default: "0x1000000",
            hidden: false,
        },
        {
            name: "blockCount",
            displayName: "Block Count",
            description: "Number of erasable blocks on the device.",
            default: 64,
            hidden: false,
        },
        {
            name: "blockCycles",
            displayName: "Block Cycles",
            description: "Number of erase cycles before littlefs evicts metadata logs and moves the metadata to another block",
            default: 500,
            hidden: false,
        },
        {
            name: "readSize",
            displayName: "Read Size",
            description: "Minimum size of a block read in bytes. All read operations will be a multiple of this value.",
            default: soc_flash_module.getDefaultFlashConfig().flashSectorSize,
            hidden: false,
        },
        {
            name: "progSize",
            displayName: "Program/Write Size",
            description: "Minimum size of a block write in bytes. All write operations will be a multiple of this value.",
            default: soc_flash_module.getDefaultFlashConfig().flashSectorSize,
            hidden: false,
        },
        {
            name: "cacheSize",
            displayName: "Cache Buffer Size",
            description: "Size of block caches in bytes. Each cache buffers a portion of a block in RAM.",
            default: soc_flash_module.getDefaultFlashConfig().flashSectorSize,
            hidden: false,
        },
        {
            name: "lookaheadSize",
            displayName: "Lookahead Buffer Size",
            description: "Size of the lookahead buffer in bytes.",
            default: soc_flash_module.getDefaultFlashConfig().flashSectorSize,
            hidden: false,
        },
        {
            name: "maxFileNameSize",
            displayName: "Maximum File Name Size",
            description: "Maximum size a file name can have",
            default: 255,
            hidden: false,
        },
        {
            name: "maxFileSize",
            displayName: "Maximum File Size",
            description: "Maximum size a file can have",
            default: 16384,
            hidden: false,
        },
	],
    maxInstances: 1,
	moduleInstances: moduleInstances,

};

function moduleInstances(inst) {

    let modInstances = new Array();
    let moduleSelectName = "";

    switch(inst.media) {
    	case "FLASH":
            moduleSelectName = "FLASH";

    		modInstances.push({
    		    name: "peripheralDriver",
    		    displayName: "Flash Configuration",
    		    moduleName: '/board/flash/flash',
    		    useArray: false,
    		    requiredArgs: {

    		    },
    		});
    		break;
    }

    return (modInstances);
}

function hexValidate(myStr) {
    var hexNum = parseInt(myStr,16);
    return (hexNum.toString(16) === myStr.toLowerCase())
}

function validate(inst, report) {
    if(inst.media == "FLASH"){
        let flashInstance = inst.peripheralDriver;
        let blockCount = inst.blockCount;
        let readSize = inst.readSize;
        let progSize = inst.progSize;
        let blockCycles = inst.blockCycles;
        let cacheSize = inst.cacheSize;
        let lookaheadSize = inst.lookaheadSize;
        let maxFileSize = inst.maxFileSize;
        let maxFileNameSize = inst.maxFileNameSize;
        let possibleMaxBlockCount = Math.round((flashInstance.flashSize - inst.flashOffset)/flashInstance.flashBlockSize);
        let endFlashOffset = flashInstance.flashSize;
        let blockCyclesMax = 1000;
        let maxFileSizeValue = 16384;
        let maxFileNameSizeValue = 255;
        let minBlocks = 2;

        if(inst.flashOffset<0){
            report.logError("Flash Offset should be greater than or equal to 0x0",inst, "flashOffset");
        }
        else if((inst.flashOffset).slice(0,2) != "0x" || hexValidate((inst.flashOffset).slice(2)) == false){
            report.logError("Flash Offset should be a hexadecimal number and should start with 0x",inst, "flashOffset");
        }
        else if(inst.flashOffset%flashInstance.flashBlockSize){
            report.logError("Flash Offset should be aligned with block size 0x"+(flashInstance.flashBlockSize).toString(16)+"",inst, "flashOffset");
        }
        else{
            let moduleInstances = inst.$module.$instances;
            for(let i = 0; i < moduleInstances.length; i++){
                let lfsInst = moduleInstances[i];

                if(i>=1 && lfsInst==inst){
                    let prevLfsInst = moduleInstances[i-1];
                    if((inst.flashOffset < (prevLfsInst.flashOffset + prevLfsInst.blockCount))||(inst.flashOffset>(endFlashOffset-minBlocks*flashInstance.flashBlockSize))){

                        report.logError("Flash Offset should be greater than or equal to 0x"+(prevLfsInst.flashOffset + prevLfsInst.blockCount).toString(16)+" and less than or equal to 0x"+(endFlashOffset-minBlocks*flashInstance.flashBlockSize).toString(16)+"",inst, "flashOffset");
                    }
                    else{
                        if(i < moduleInstances.length - 1){
                            possibleMaxBlockCount = Math.round((moduleInstances[i+1].flashOffset  - inst.flashOffset)/flashInstance.flashBlockSize );
                        }
                        else{
                            possibleMaxBlockCount = Math.round((endFlashOffset - inst.flashOffset)/flashInstance.flashBlockSize);
                        }
                    }
                }
                else if(inst.flashOffset > (endFlashOffset - minBlocks*flashInstance.flashBlockSize)){
                    report.logError("Flash Offset should be less than or equal to 0x"+ (endFlashOffset - minBlocks*flashInstance.flashBlockSize).toString(16) +"",inst, "flashOffset");

                }
            }
        }

        if(possibleMaxBlockCount < minBlocks){
            report.logError("Cannot set block count due to invalid flash offset",inst,"blockCount");
        }
        else if(blockCount < minBlocks || blockCount > possibleMaxBlockCount){
            report.logError("Minimum block count is "+ minBlocks +" and cannot be more than "+ possibleMaxBlockCount +"",inst,"blockCount");
        }

        if(blockCycles <=0 || blockCycles > blockCyclesMax){
            report.logError("Block cycles must be non-zero and maximum value is " +blockCyclesMax+"",inst,"blockCycles");
        }

        if(readSize <flashInstance.flashPageSize || readSize>flashInstance.flashSectorSize){
            report.logError("Read size minimum value is "+flashInstance.flashPageSize+", maximum value is "+flashInstance.flashSectorSize+"",inst,"readSize");
        }
        else if(readSize%flashInstance.flashPageSize){
            report.logError("Read size should be multiple of "+flashInstance.flashPageSize+"",inst,"readSize");
        }

        if(progSize <flashInstance.flashPageSize || progSize>flashInstance.flashSectorSize){
            report.logError("Write size minimum value is "+flashInstance.flashPageSize+", maximum value is "+flashInstance.flashSectorSize+"",inst,"progSize");
        }
        else if(progSize%flashInstance.flashPageSize){
            report.logError("Write size should be multiple of "+flashInstance.flashPageSize+"",inst,"progSize");
        }

        if(cacheSize <flashInstance.flashPageSize || cacheSize>flashInstance.flashSectorSize){
            report.logError("Cache size minimum value is "+flashInstance.flashPageSize+", maximum value is "+flashInstance.flashSectorSize+"",inst,"cacheSize");
        }
        else if(cacheSize%flashInstance.flashPageSize){
            report.logError("Cache size should be multiple of "+flashInstance.flashPageSize+"",inst,"cacheSize");
        }

        if(lookaheadSize <flashInstance.flashPageSize || lookaheadSize>flashInstance.flashSectorSize){
            report.logError("Lookahead size minimum value is "+flashInstance.flashPageSize+", maximum value is "+flashInstance.flashSectorSize+"",inst,"lookaheadSize");
        }
        else if(lookaheadSize%flashInstance.flashPageSize){
            report.logError("Lookahead size should be multiple of "+flashInstance.flashPageSize+"",inst,"lookaheadSize");
        }

        if(maxFileSize <=0 || maxFileSize > maxFileSizeValue){
            report.logError("Maximum File Size must be non-zero and maximum value is "+maxFileSizeValue+"",inst,"maxFileSize");
        }

        if(maxFileNameSize <=0 || maxFileNameSize > maxFileNameSizeValue){
            report.logError("Maximum File Name Size must be non-zero and maximum value is "+maxFileNameSizeValue+"",inst,"maxFileNameSize");
        }

        if(cacheSize%readSize){
            report.logError("Cache size must be a multiple of read size",inst,"cacheSize");
        }

        if(cacheSize%progSize){
            report.logError("Cache size must be a multiple of write size",inst,"cacheSize");
        }
    }
}

exports = littlefs_module;