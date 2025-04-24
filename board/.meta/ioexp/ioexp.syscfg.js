// Import required modules
const common = system.getScript("/common");
const soc = system.getScript(`/board/ioexp/ioexp_${common.getSocName()}`);

const DEFAULT_MODE = 1;  // Input
const DEFAULT_STATE = 0; // LOW

/******************************************************************************
 * Helper Functions
 ******************************************************************************/

function filterIoexpPinName(pinName) {
    return pinName.replace(/[./]/g, '_').replace(/#/g, '')
}

// Creates configuration for a single pin
const createPinConfig = (cfg, pin) => {
    // Clean up pin name by replacing . and / with _
    const staticConfig = soc.getConfigArr();
    const defaultConfig = staticConfig[0]
    const defaultI2cAddressName = `${defaultConfig.board} 0x${defaultConfig.i2cAddress.toString(16)}`

    const pinName_filtered = filterIoexpPinName(pin.pinName);
    
    // Create unique element name for this pin
    const element_name = `${cfg.name}_port${pin.portNumber}_pin${pinName_filtered}`;
    
    return {
        name: element_name,
        displayName: `${pin.pinName} Configurations`,
        config: [
            // Mode configuration (Input/Output)
            {
                name: `${element_name}_mode`,
                displayName: `${pin.pinName} Mode`,
                options: [
                    { name: 0, displayName: "Output" },
                    { name: 1, displayName: "Input" },
                ],
                default: DEFAULT_MODE,
                onChange: (inst, ui) => {
                    // Hide state option if mode is input
                    ui[`${element_name}_state`].hidden = (inst[`${element_name}_mode`] === 1);
                },
                hidden: !(defaultI2cAddressName === `${cfg.board} 0x${cfg.i2cAddress.toString(16)}`),
            },
            // State configuration (HIGH/LOW)
            {
                name: `${element_name}_state`,
                displayName: `${pin.pinName} State`,
                options: [
                    { name: 0, displayName: "LOW" },
                    { name: 1, displayName: "HIGH" },
                ],
                default: DEFAULT_STATE,
                hidden: true,
            }
        ]
    };
};

// Creates I2C address options for the configuration
const createI2CAddressOptions = (staticConfig) => {
    return staticConfig.map(cfg => ({
        name: `${cfg.board} 0x${cfg.i2cAddress.toString(16)}`,
        displayName: `${cfg.board} 0x${cfg.i2cAddress.toString(16)}`
    }));
};

/******************************************************************************
 * Main Configuration Functions
 ******************************************************************************/

// Get configuration for a specific instance
function getInstanceConfig(moduleInstance) {
    const configArr = soc.getConfigArr();
    const boardName = moduleInstance.i2cAddress.split(" 0x")[0];
    const i2cAddressName = parseInt(moduleInstance.i2cAddress.split("x")[1], 16);
    const config = configArr.find(o => (o.i2cAddress === i2cAddressName) && (o.board === boardName));

    return { ...config, ...moduleInstance };
}

// Get all configurable options
function getConfigurables() {
    const staticConfig = soc.getConfigArr();

    // Basic configuration options
    const baseConfig = [
        {
            name : "name",
            displayName : "IO Expander",
            getValue : (inst)=>{
                return staticConfig.find(cfg => (`${cfg.board} 0x${cfg.i2cAddress.toString(16)}` === inst["i2cAddress"])).name
            },
            default : ""
        },
        {
            name: "i2cAddress",
            displayName: "I2C Target Address",
            options: createI2CAddressOptions(staticConfig),
            onChange: onChangeIoExp,
            default: createI2CAddressOptions(staticConfig)[0].name,
        }
    ];

    // Create configurations grouped by port number
    const ioexp_cfg = staticConfig.flatMap(cfg => {
        // Get unique port numbers
        const portNumbers = [...new Set(cfg.pinSet.map(pin => pin.portNumber))];
        
        // Create groups for each port
        return portNumbers.map(portNum => ({
            name: `port${portNum}Group`,
            displayName: `Port ${portNum}`,
            collapsed : false,
            config: cfg.pinSet
                .filter(pin => pin.portNumber === portNum)
                .map(pin => createPinConfig(cfg, pin))
        }));
    });

    // Combine base config with grouped pin configurations
    return [
        ...baseConfig,
        {
            name: "ioExpConfigGrp",
            displayName: "IO Expander Configurations",
            config: ioexp_cfg,
        }
    ];
}

// Handle I2C address changes
function onChangeIoExp(inst, ui) {
    const staticConfig = soc.getConfigArr();
    
    staticConfig.forEach(cfg => {
        cfg.pinSet.forEach(pin => {
            const pinName_filtered = filterIoexpPinName(pin.pinName);
            const element_name = `${cfg.name}_port${pin.portNumber}_pin${pinName_filtered}`;
            const i2cAddressName = `${cfg.board} 0x${cfg.i2cAddress.toString(16)}`;
            
            // Update UI visibility based on I2C address and mode
            ui[`${element_name}_mode`].hidden = inst.i2cAddress !== i2cAddressName;
            ui[`${element_name}_state`].hidden = 
                inst.i2cAddress !== i2cAddressName || 
                inst[`${element_name}_mode`] === 1;

            // Reset values to default if this config is not selected
            if (inst.i2cAddress !== i2cAddressName) {
                inst[`${element_name}_mode`] = DEFAULT_MODE;
                inst[`${element_name}_state`] = DEFAULT_STATE;
            }
        });
    });
}

// Validate configuration
function onValidate(inst, validation) {
    // Check for duplicate I2C addresses in Given Board
    const instanceMap = inst.$module.$instances.map(instance => ({
        i2cAddressName: instance.i2cAddress,
        instName: instance.$name
    }));

    const { duplicates } = common.findDuplicates(instanceMap.map(o => o.i2cAddressName));
    
    // Log error for each duplicate found
    duplicates.forEach(duplicate => {
        const duplicateInstances = instanceMap
            .filter(o => o.i2cAddressName === duplicate)
            .map(item => item.instName)
            .join(", ");

        validation.logError(
            `This IO Expander is used in the instances: ${duplicateInstances}`,
            inst,
            "i2cAddress"
        );
    });

    // Validate I2C address
    /* if the i2cAddress is not in the options list thats an error */
    const staticConfig = soc.getConfigArr();
    const optionNames = createI2CAddressOptions(staticConfig).map(option => option.name);
    if(optionNames.includes(inst.i2cAddress) === false){
        validation.logError("Invalid I2C address", inst, "i2cAddress");
    }
}

// Get module instances
function moduleInstances(instance) {
    const configArr = soc.getConfigArr();
    const config = configArr.find(o => o.name === instance.name);

    if (config.type !== "I2C") return [];

    return [{
        name: "peripheralDriver",
        displayName: "I2C Configuration",
        moduleName: '/drivers/i2c/i2c',
        requiredArgs: {
            I2C: { $assign: config.instance }
        }
    }];
}

/******************************************************************************
 * Module Definition
 ******************************************************************************/

const ioexp_module = {
    displayName: "IO Expander",
    
    // Template configurations
    templates: {
        "/board/board/board_open_close.c.xdt": {
            board_open: "/board/ioexp/templates/ioexp_open.c.xdt",
            board_open_close_config: "/board/ioexp/templates/ioexp_open_close.c.xdt",
        },
        "/board/board/board_open_close.h.xdt": {
            board_open_close_config: "/board/ioexp/templates/ioexp_open_close.h.xdt",
        },
        "/board/board/board_config.h.xdt": {
            board_config: "/board/ioexp/templates/ioexp.h.xdt",
        },
    },
    
    // Module properties
    defaultInstanceName: "CONFIG_IOEXP",
    config: getConfigurables(),
    moduleStatic: {
        modules: () => [{
            name: "system_common",
            moduleName: "/system_common",
        }]
    },
    validate: onValidate,
    maxInstances: soc.getConfigArr().length,
    sharedModuleInstances: moduleInstances,
    getInstanceConfig,
    filterIoexpPinName,
};

// Export the module
exports = ioexp_module;