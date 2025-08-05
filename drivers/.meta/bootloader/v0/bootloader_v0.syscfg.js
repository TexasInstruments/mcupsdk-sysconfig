let common = system.getScript("/common");
let soc = system.getScript(`/drivers/bootloader/soc/bootloader_${common.getSocName()}`);

function getConfigArr() {
	return soc.getConfigArr();
}

let romPCIeCfgDesciption = `
If checked, will use the PCIE configuration as done by ROM, and SBL will not
reopen the driver (enable clocks, do link training). SBL will only be
configuring the ATU regions required to receive the application image.
On checking the box, will generate a macro that can be used in the SBL to
selectively compile PCIe reinitialization sections. Unchecking the box, will pull
in PCIe in EP (End Point) mode.
`

let bootloader_module_name = "/drivers/bootloader/bootloader";
function getConfig(){
    let cfg = [
        {
            name: "bootMedia",
            displayName: "Boot Media",
            default: getDefaultBootMedia(),
            options: soc.getBootMediaArr(),
            onChange: function (inst, ui) {
                /* appImageOffset applicable only for OSPI Flash boot */
                if(inst.bootMedia == "FLASH") {
                    ui.appImageOffset.hidden = false;
                }
                else {
                    ui.appImageOffset.hidden = true;
                }
                /* appImageBaseAddress applicable only for Memory boot */
                if(inst.bootMedia == "MEM") {
                    ui.appImageBaseAddress.hidden = false;
                }
                else {
                    ui.appImageBaseAddress.hidden = true;
                }
                /* EMMCAppImageOffset applicable only for EMMC boot */
                if(inst.bootMedia == "EMMC") {
                    ui.EMMCAppImageOffset.hidden = false;
                }
                else {
                    ui.EMMCAppImageOffset.hidden = true;
                }
                /* romPCIeCfg applicabke only for PCIe boot */
                if(inst.bootMedia == "PCIE") {
                    ui.romPCIeCfg.hidden = false;
                }
                else {
                    ui.romPCIeCfg.hidden = true;
                }
            },

        },
        {
            name: "appImageOffset",
            displayName: "Boot Image Offset",
            description: "Offset of the Boot Image in Flash",
            default: "0x00000000",
            hidden: false,
        },
        {
            name: "appImageBaseAddress",
            displayName: "Boot Image Base Address",
            description: "Base address of the Boot Image in SOC memory",
            default: "0x00000000",
            hidden: true,
        },
        {
            name: "EMMCAppImageOffset",
            displayName: "Boot Image Offset",
            description: "Offset of Boot Image in EMMC",
            default: "0x00000000",
            hidden: true,
        },
        {
            name: "romPCIeCfg",
            displayName: "Use ROM PCIe Configuration",
            longDescription: romPCIeCfgDesciption,
            default: true,
            hidden: true,
        }
    ]
    if(["am263x", "am263px", "am261x"].includes(common.getSocName())) {
        cfg.push({
            name        : "hsmrtDecoupling",
            displayName : "Is Hsmrt Not A Part Of The Sbl",
            description : 'Whether or not HSMRT is decoupled from the SBL',
            hidden      : false,
            default     : false,
            onChange    : function(inst, ui) {
                if (inst.hsmrtDecoupling) {
                    ui.hsmrtImageOffset.hidden = false;
                    ui.hsmrtImageLoadAddress.hidden = false;
                }
                else {
                    ui.hsmrtImageOffset.hidden = true;
                    ui.hsmrtImageLoadAddress.hidden = true;

                }
            }
        });
        cfg.push({
            name: "hsmrtImageOffset",
            displayName: "HSM Runtime Image Offset",
            description: "Offset of the HSM Runtime Image in Flash",
            default: "0x00400000",
            hidden: true,
        });
        cfg.push({
            name: "hsmrtImageLoadAddress",
            displayName: "HSM Runtime RAM Load Address",
            description: "Starting location of HSM Runtime Image in RAM",
            default: "0x70100000",
            hidden: true,
        });
        cfg.push({
            name        : "secBootStreamLength",
            displayName : "Stream Length for Secure Boot",
            description : 'This is to determine the size of the stream for Secure Boot',
            hidden      : false,
            default     : 64,
        });
    }
    if(["am263x", "am263px"].includes(common.getSocName())) {
        cfg.push(
            {
                name: "R5FSS0operatingMode",
                displayName: "R5FSS0 Operating Mode",
                description: "Operating mode for the R5F Subsystem 0",
                default: "Lockstep",
                options: soc.getOperatingMode(),
            });
        cfg.push(
            {
                name: "R5FSS1operatingMode",
                displayName: "R5FSS1 Operating Mode",
                description: "Operating mode for the R5F Subsystem 1",
                default: "Lockstep",
                options: soc.getOperatingMode(),
            })
    }
    if(["am273x", "am261x"].includes(common.getSocName())) {
        cfg.push(
            {
                name: "R5FSS0operatingMode",
                displayName: "R5FSS0 Operating Mode",
                description: "Operating mode for the R5F Subsystem 0",
                default: "Lockstep",
                options: soc.getOperatingMode(),
            });
    }
    if(["am243x", "am64x"].includes(common.getSocName())) {
        cfg.push(
            {
                name: "isAppimageSigned",
                displayName: "Application Image Is X509 Signed",
                description: "SBL expects a signed image (appimage with x509 certificate concatenated) if this option is enabled, disable this if you are trying to boot an unsigned image",
                default: true,
                onChange: function(inst, ui) {
                    if(inst.isAppimageSigned) {
                        ui.disableAppImageAuth.hidden = false;
                    } else {
                        ui.disableAppImageAuth.hidden = true;
                        inst.disableAppImageAuth = true;
                    }
                }
            }
        )
        cfg.push(
            {
                name: "disableAppImageAuth",
                displayName: "Disable Auth For Application Image",
                description: "Selecting this would disable authentication for application images. Make sure that encryption is also turned off for the application image if you're disabling authentication. ",
                default: false,
                hidden: false,
            }
        );
    }
    if(["am243x", "am64x"].includes(common.getSocName())) {
        cfg.push(
            {
                name: "initICSSCores",
                displayName: "Initialize ICSS Cores",
                description: "Whether to initialize the ICSS cores in the bootloader or not",
                default: true,
            });
    }
    return cfg;
}

let templates = {
     "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/bootloader/templates/bootloader_config.c.xdt",
    },
    "/drivers/system/system_config.h.xdt": {
        driver_config: "/drivers/bootloader/templates/bootloader.h.xdt",
    },
}

if (["am263x", "am263px", "am261x"].includes(common.getSocName())){

    templates["/clockTree/templates/ti_clocktree_pll_config.c.xdt"] = {},
    templates["/clockTree/templates/ti_clocktree_pll_config.h.xdt"] = {}
}

let bootloader_module = {
    displayName: "BOOTLOADER",

    templates: templates,
    defaultInstanceName: "CONFIG_BOOTLOADER",
    validate: validate,
    moduleStatic: {
        modules: function(inst) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    config : getConfig(),
    sharedModuleInstances: moduleInstances,
};

function moduleInstances(instance){
    let modInstances = new Array();

    if(instance.bootMedia == "FLASH") {
        modInstances.push({
            name: "flashDriver",
            displayName: "Flash Driver Configuration",
            moduleName: '/board/flash/flash',
        });
    }

    if(instance.bootMedia == "EMMC") {
        modInstances.push({
            name: "MMCSDDriver",
            displayName: "EMMC Driver Configuration",
            moduleName: '/drivers/mmcsd/mmcsd',
            requiredArgs: {
                moduleSelect: "MMC0",
            },
        });
    }

    if(instance.bootMedia == "PCIE" && instance.romPCIeCfg != true) {
        modInstances.push({
            name: "PCIEDriver",
            displayName: "Pcie Driver Configuration",
            moduleName: '/drivers/pcie/pcie',
            requiredArgs: {
                operMode: "PCIE_EP_MODE",
                gen: "PCIE_GEN2",
            }
        });
    }

    return (modInstances);
}

function hexValidate(myStr){
    let re = /[0-9A-Fa-f]{1}/g;
    if(re.test(myStr)){
        return true;
    }
    else{
        return false;
    }
}

function validate(inst, report) {
    if(inst.bootMedia == "FLASH"){
        let offset = inst.appImageOffset;
        if(offset.slice(0,2) != "0x" || hexValidate(offset.slice(2)) == false) {
            report.logError("Boot Image Offset should be a hexadecimal number and should start with 0x",inst, "appImageOffset");
        }
        if(["am263x", "am263px", "am261x"].includes(common.getSocName())) {
            if(inst.hsmrtDecoupling){
                let hsmoffset = inst.hsmrtImageOffset;
                if(hsmoffset.slice(0,2) != "0x" || hexValidate(hsmoffset.slice(2)) == false) {
                    report.logError(" HSM Runtime Image Offset should be a hexadecimal number and should start with 0x",inst, "hsmrtImageOffset");
                }
                let hsmload = inst.hsmrtImageLoadAddress;
                if(hsmload.slice(0,2) != "0x" || hexValidate(hsmload.slice(2)) == false) {
                    report.logError(" HSM Runtime Image Load Address should be a hexadecimal number and should start with 0x",inst, "hsmrtImageLoadAddress");
                }
                if(["am263px"].includes(common.getSocName())) {
                    if((parseInt(hsmload, 16) < parseInt("0x70000000")) || (parseInt(hsmload, 16) > parseInt("0x702FFFFF")) ){
                        report.logError("HSM Runtime Image Load Address out of bounds (0x70000000, 0x702FFFFF)",inst, "hsmrtImageLoadAddress");                        
                    }
                }
                if(["am261x"].includes(common.getSocName())) {
                    if((parseInt(hsmload, 16) < parseInt("0x70000000")) || (parseInt(hsmload, 16) > parseInt("0x7017FFFF")) ){
                        report.logError("HSM Runtime Image Load Address out of bounds (0x70000000, 0x7017FFFF)",inst, "hsmrtImageLoadAddress");                        
                    }
                }
                if(["am263x"].includes(common.getSocName())) {
                    if((parseInt(hsmload, 16) < parseInt("0x70000000")) || (parseInt(hsmload, 16) > parseInt("0x701FFFFF")) ){
                        report.logError("HSM Runtime Image Load Address out of bounds (0x70000000, 0x701FFFFF)",inst, "hsmrtImageLoadAddress");
                    }
                }
            }
        }     

    }
    else if(inst.bootMedia == "MEMORY"){
        let baseAddr = inst.appImageBaseAddress;
        if(baseAddr.slice(0, 2) != "0x" || hexValidate(baseAddr.slice(2)) == false) {
            report.logError("Boot Image base address should be a hexadecimal number and should start with 0x",inst, "appImageBaseAddress");
        }
    }
    else if(inst.bootMedia == "EMMC"){
        let offset = inst.EMMCAppImageOffset;
        if(offset.slice(0,2) != "0x" || hexValidate(offset.slice(2)) == false) {
            report.logError("Boot Image Offset should be a hexadecimal number and should start with 0x",inst, "EMMCAppImageOffset");
        }
    }
}

function getDefaultBootMedia(){
    if(common.getSocName() == "am65x")
        return "MEM"
    else
        return "FLASH"
}

exports = bootloader_module;
