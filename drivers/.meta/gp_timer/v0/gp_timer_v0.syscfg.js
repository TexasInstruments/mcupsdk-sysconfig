let common = system.getScript("/common");
let pinmux = system.getScript("/drivers/pinmux/pinmux");
let soc = system.getScript(`/drivers/gp_timer/soc/gp_timer_${common.getSocName()}`);
let hwi = system.getScript("/kernel/dpl/hwi.js");

function getConfigArr() {
    return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === solution.peripheralName);

    let clkSelMuxValue = soc.getTimerClockSelectMaskValue(moduleInstance);

    return {
        ...config,
        ...moduleInstance,
        clkSelMuxValue : clkSelMuxValue,
    }
};

function timerFilter(peripheral) {
    /* Timers used by Other Peripheral */
    let blocked_timers = soc.getBlockedTimers();
    let found = blocked_timers.find(
        function(str) {
            return str == peripheral.name;
        }
    );
    return ! found;
}

function pinmuxRequirements(inst) {
    let interfaceName = getInterfaceName(inst);

    let resources = [];
    let pinResource = {};

    if  (   inst.interfaceName == "MCU_DMTIMER0" ||
            inst.interfaceName == "MCU_DMTIMER1" ||
            inst.interfaceName == "MCU_DMTIMER2" ||
            inst.interfaceName == "MCU_DMTIMER3")
    {
        pinResource = pinmux.getPinRequirements(interfaceName, "MCU_TIMER_IO", "Timer Pin");
        if(inst.timerConfigMode == "INPUT_CAPTURE")
        {
            pinmux.setConfigurableDefault( pinResource, "rx", true );
            resources.push(pinResource);
        }
        else if(inst.timerConfigMode == "PWM_GEN")
        {
            pinmux.setConfigurableDefault( pinResource, "rx", false );
            resources.push(pinResource);
        }
    }
    else
    {
        pinResource = pinmux.getPinRequirements(interfaceName, "TIMER_IO", "Timer Pin");
        if(inst.timerConfigMode == "INPUT_CAPTURE")
        {
            pinmux.setConfigurableDefault( pinResource, "rx", true );
            resources.push(pinResource);
        }
        else if(inst.timerConfigMode == "PWM_GEN")
        {
            pinmux.setConfigurableDefault( pinResource, "rx", false );
            resources.push(pinResource);
        }
    }

    let peripheral = {
        name          : interfaceName,
        displayName   : "TIMER Instance",
        interfaceName : interfaceName,
        filter        : timerFilter,
        resources     : resources,
    };

    return [peripheral];
}

function getPeripheralPinNames(inst) {


    if  (   inst.interfaceName == "MCU_DMTIMER0" ||
            inst.interfaceName == "MCU_DMTIMER1" ||
            inst.interfaceName == "MCU_DMTIMER2" ||
            inst.interfaceName == "MCU_DMTIMER3")
    {
        if( (inst.timerConfigMode == "INPUT_CAPTURE") ||
            (inst.timerConfigMode == "PWM_GEN"))

        {
            return ["MCU_TIMER_IO"];
        }
    }
    else
    {
        if( (inst.timerConfigMode == "INPUT_CAPTURE") ||
            (inst.timerConfigMode == "PWM_GEN"))

        {
            return ["TIMER_IO"];
        }
    }

    return [];
}

function getInterfaceName(inst) {

    if  (   inst.interfaceName == "MCU_DMTIMER0" ||
            inst.interfaceName == "MCU_DMTIMER1" ||
            inst.interfaceName == "MCU_DMTIMER2" ||
            inst.interfaceName == "MCU_DMTIMER3")
    {
        return "MCU_TIMER"
    }
    return "TIMER";
}

function onChangeClkSource(instance, ui)
{
    if  (   instance.interfaceName == "MCU_DMTIMER0" ||
            instance.interfaceName == "MCU_DMTIMER1" ||
            instance.interfaceName == "MCU_DMTIMER2" ||
            instance.interfaceName == "MCU_DMTIMER3")
    {
        instance.timerInputClkHz = soc.getTimerClockSourceMcuHz(instance.clkSource);
    }
    else
    {
        instance.timerInputClkHz = soc.getTimerClockSourceMainHz(instance.clkSource);
    }
}

function compareConfigVisibility(ui, vis)
{
    ui.cntCompareValComp.hidden = vis;
}

function pwmConfigVisibility(ui, vis)
{
    ui.cntCompareValPWM.hidden = vis;
    ui.trigOutputPWMMode.hidden = vis;
    ui.defaultPWMOutSetting.hidden = vis;
    ui.outputModulationType.hidden = vis;
}

function captureConfigVisibility(ui, vis)
{
    ui.captureMode.hidden = vis;
    ui.captureEventMode.hidden = vis;
}

function validate(instance, report) {

    if(instance.enableIntr) {
        if (instance.timerConfigMode == "FREE_RUN")
        {
            if( (instance.overflowCallbackFxn == "NULL") ||
                (instance.overflowCallbackFxn == ""))   {
                    report.logError("Callback function MUST be provided when Interrupt is Enabled.", instance, "overflowCallbackFxn");
                }
        }
        else if(instance.timerConfigMode == "INPUT_CAPTURE")
        {
            if( (instance.captureCallbackFxn == "NULL") ||
                (instance.captureCallbackFxn == ""))   {
                    report.logError("Callback function MUST be provided when Interrupt is Enabled.", instance, "captureCallbackFxn");
                }
        }
        else if(instance.timerConfigMode == "OUTPUT_COMPARE")
        {
            if( (instance.compareMatchCallbackFxn == "NULL") ||
                (instance.compareMatchCallbackFxn == ""))   {
                    report.logError("Callback function MUST be provided when Interrupt is Enabled.", instance, "compareMatchCallbackFxn");
                }
        }
        else{}
    }

    common.validate.checkNumberRange(instance, report, "cntPrescaler", 0x0, 0x7, "hex");
    common.validate.checkNumberRange(instance, report, "cntReloadVal", 0x0, 0xFFFFFFFE, "hex");
    common.validate.checkNumberRange(instance, report, "overflowMaskCount", 0x0, 0x00FFFFFE, "hex");


    if(instance.timerConfigMode == "OUTPUT_COMPARE")
    {
        common.validate.checkNumberRange(instance, report, "cntCompareValComp", 0x0, 0xFFFFFFFF, "hex");
    }
}

function oneShotModeConfig()
{
    let config = {
        name: "enableOneShotMode",
        displayName: "One-Shot Mode Enable",
        default: false,
        description: `Select one-shot mode, or periodic mode`,
        readOnly: false,
        onChange: function(inst, ui) {
            if(inst.enableOneShotMode == true)
            {
                ui.cntReloadVal.hidden = true;
            }
            else
            {
                ui.cntReloadVal.hidden = false;
            }
        }
    };

    if(soc.oneShotModeSupport === false)
    {
        config.default = false;
        config.hidden = true;
    }
    return config;
}

let gp_timer_module_name = "/drivers/gp_timer/gp_timer";

let gp_timer_module = {
    displayName: "GPTIMER",
    templates: {

        "/drivers/system/system_config.c.xdt": {
			driver_config: "/drivers/gp_timer/templates/gp_timer_v0_config.c.xdt",
			driver_init: "/drivers/gp_timer/templates/gp_timer_init.c.xdt",
			driver_deinit: "/drivers/gp_timer/templates/gp_timer_deinit.c.xdt",
		},
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/gp_timer/templates/gp_timer.h.xdt",
        },

        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/gp_timer/templates/gp_timer_open_close_config.c.xdt",
            driver_open: "/drivers/gp_timer/templates/gp_timer_open.c.xdt",
            driver_close: "/drivers/gp_timer/templates/gp_timer_close.c.xdt",
        },

        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/gp_timer/templates/gp_timer_open_close.h.xdt",
        },
        "/drivers/pinmux/pinmux_config.c.xdt": {
            moduleName: gp_timer_module_name,
        },
        "/drivers/system/power_clock_config.c.xdt": {
            moduleName: gp_timer_module_name,
        },
    },
    maxInstances: getConfigArr().length,

    defaultInstanceName: "CONFIG_GPTIMER",

    config: [
        {
            name: "timerInputClkHz",
            displayName: "Input Clock Frequency (Hz)",
            default: soc.getTimerClockSourceMainHz( soc.getTimerClockSourceConfigArr()[0].name ),
            description: "Make sure the value put here matches the actual input clock frequency provided on the board/SOC",
            hidden: false,
        },
        {
            name: "clkSource",
            displayName: "Input Clock Source",
            default: soc.getTimerClockSourceConfigArr()[0].name,
            options: soc.getTimerClockSourceConfigArr(),
            hidden: false,
            onChange: onChangeClkSource,
        },
        {
            name: "startTimer",
            displayName: "Start Timer After Setup",
            default: false,
            description: `Check this to start the timer operation after config`,
            longDescription: "If timer is not started via this checkbox, then you can start the timer by Calling `GPTIMER_start()` later",
            hidden: false,
        },
        {
            name: "enableIntr",
            displayName: "Enable Interrupt",
            default: false,
            onChange: function(inst, ui) {
                if(inst.enableIntr == true)
                {
                    ui.intrPriority.hidden = false;

                    if (inst.timerConfigMode == "FREE_RUN")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = false;
                        ui.overflowMaskCount.hidden = false;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = true;
                    }
                    else if (inst.timerConfigMode == "INPUT_CAPTURE")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = false;
                    }
                    else if (inst.timerConfigMode == "OUTPUT_COMPARE")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = false;
                        ui.captureCallbackFxn.hidden = true;
                    }
                    else if (inst.timerConfigMode == "PWM_GEN")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = true;
                    }
                }
                else
                {
                    ui.intrPriority.hidden = true;

                    inst.overflowCallbackFxn = "NULL";
                    inst.compareMatchCallbackFxn = "NULL";
                    inst.captureCallbackFxn = "NULL";

                    ui.overflowCallbackFxn.hidden = true;
                    ui.overflowMaskCount.hidden = true;
                    inst.overflowMaskCount = 0x00;

                    ui.compareMatchCallbackFxn.hidden = true;
                    ui.captureCallbackFxn.hidden = true;
                }
            }
        },
        {
            name: "intrPriority",
            displayName: "Interrupt Priority",
            default: 4,
            description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
            hidden: true,
        },
        oneShotModeConfig(),
        {
            name: "enablePrescaler",
            displayName: "Enable Prescaler",
            default: false,
            description: "Enable Prescaler for the counter",
            hidden: false,
            onChange: function(inst, ui) {
                if(inst.enablePrescaler == true)
                {
                    ui.cntPrescaler.hidden = false;
                }
                else
                {
                    inst.cntPrescaler = 0;
                    inst.actualPrescaler = 2;
                    ui.cntPrescaler.hidden = true;
                }
            }
        },
        {
            name: "cntPrescaler",
            displayName: "Counter Prescaler",
            default: 0x00,
            description: "The timer counter is prescaled with the value 2 exponent ( (Counter Prescaler) + 1 ).",
            hidden: true,
            displayFormat: "hex",
            onChange: function(inst, ui) {
                inst.actualPrescaler = 2 ** (inst.cntPrescaler + 1);
            }
        },
        {
            name: "actualPrescaler",
            displayName: "Actual Prescaler Value",
            default: 2,
            description: "The timer counter is prescaled with the value 2 exponent ((Counter Prescaler) + 1).",
            longDescription: "Example: (Counter Prescaler) = 3, counter increases value (if started) after 16 functional clock periods.",
            readOnly: true,
        },
        {
            name: "cntInitVal",
            displayName: "Counter Initial Value",
            default: 0x00,
            description: "The Counter is loaded with this value during Initialization.",
            hidden: false,
            displayFormat: "hex",
        },
        {
            name: "cntReloadVal",
            displayName: "Counter Auto Reload Value",
            default: 0x00,
            description: "The timer counter is reloaded with this value.",
            hidden: false,
            displayFormat: "hex",
        },
        {
            name: "overflowMaskCount",
            displayName: "Overflow Wrapping Value",
            default: 0x00,
            description: "The number of overflow interrupts to be masked.",
            hidden: true,
            displayFormat: "hex",
        },
        {
            name: "timerConfigMode",
            displayName: "Timer Operational Mode",
            default: "FREE_RUN",
            description: "Timer Mode of Operation",
            options: [
                { name: "FREE_RUN" },
                { name: "INPUT_CAPTURE" },
                { name: "OUTPUT_COMPARE" },
                { name: "PWM_GEN" },
            ],
            hidden: false,
            onChange: function(inst, ui) {
                if(inst.timerConfigMode != "FREE_RUN")
                {
                    inst.advancedConfig = false;

                    compareConfigVisibility(ui, true);
                    pwmConfigVisibility(ui, true);
                    captureConfigVisibility(ui, true);

                    ui.advancedConfig.hidden = false;
                }
                else
                {
                    inst.advancedConfig = false;

                    compareConfigVisibility(ui, true);
                    pwmConfigVisibility(ui, true);
                    captureConfigVisibility(ui, true);

                    ui.advancedConfig.hidden = true;
                }

                if(inst.enableIntr)
                {
                    if (inst.timerConfigMode == "FREE_RUN")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = false;
                        ui.overflowMaskCount.hidden = false;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = true;
                    }
                    else if (inst.timerConfigMode == "INPUT_CAPTURE")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = false;
                    }
                    else if (inst.timerConfigMode == "OUTPUT_COMPARE")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = false;
                        ui.captureCallbackFxn.hidden = true;
                    }
                    else if (inst.timerConfigMode == "PWM_GEN")
                    {
                        inst.overflowCallbackFxn = "NULL";
                        inst.compareMatchCallbackFxn = "NULL";
                        inst.captureCallbackFxn = "NULL";

                        ui.overflowCallbackFxn.hidden = true;
                        ui.overflowMaskCount.hidden = true;
                        inst.overflowMaskCount = 0x00;

                        ui.compareMatchCallbackFxn.hidden = true;
                        ui.captureCallbackFxn.hidden = true;
                    }
                }
                else
                {
                    inst.overflowCallbackFxn = "NULL";
                    inst.compareMatchCallbackFxn = "NULL";
                    inst.captureCallbackFxn = "NULL";

                    ui.overflowCallbackFxn.hidden = true;
                    ui.overflowMaskCount.hidden = true;
                    inst.overflowMaskCount = 0x00;

                    ui.compareMatchCallbackFxn.hidden = true;
                    ui.captureCallbackFxn.hidden = true;
                }

            }
        },
        {
            name: "advancedConfig",
            displayName: "Show Config Options",
            default: false,
            description: "Show Config Options for selected Mode",
            onChange: function (inst, ui) {
                let hideConfigs = true;
                if(inst.advancedConfig == true) {
                    hideConfigs = false;
                }

                if(inst.timerConfigMode == "INPUT_CAPTURE")
                {
                    compareConfigVisibility(ui, true);
                    pwmConfigVisibility(ui, true);
                    captureConfigVisibility(ui, hideConfigs);
                }
                else if(inst.timerConfigMode == "OUTPUT_COMPARE")
                {
                    compareConfigVisibility(ui, hideConfigs);
                    pwmConfigVisibility(ui, true);
                    captureConfigVisibility(ui, true);
                }
                else if(inst.timerConfigMode == "PWM_GEN")
                {
                    compareConfigVisibility(ui, true);
                    pwmConfigVisibility(ui, hideConfigs);
                    captureConfigVisibility(ui, true);
                }
            },
        },

        /* Compare Mode Configurables */
        {
            name: "cntCompareValComp",
            displayName: "Counter Compare Value",
            default: 0,
            description: `In compare mode the counter value will be compared with this value`,
            readOnly: false,
            displayFormat: "hex",
            hidden: true,
        },

        /* PWM Mode Configurables */
        {
            name: "cntCompareValPWM",
            displayName: "Counter Compare Value",
            default: 0,
            description: `In PWM mode the counter value will be compared with this value`,
            readOnly: false,
            displayFormat: "hex",
            hidden: true,
        },
        {
            name: "trigOutputPWMMode",
            displayName: "PWM output Trigger Mode",
            default: "GPTIMER_PWM_OUT_NO_TRIGGER",
            description: `Capture Mode selection, Single Capture or Double Capture`,
            readOnly: false,
            hidden: true,
            options: [
                {
                    name: "GPTIMER_PWM_OUT_NO_TRIGGER",
                    displayName: "No Trigger"
                },
                {
                    name: "GPTIMER_PWM_OUT_OVERFLOW_TRIGGER",
                    displayName: "Overflow Trigger"
                },
                {
                    name: "GPTIMER_PWM_OUT_OVERFLOW_MATCH_TRIGGER",
                    displayName: "Overflow & Match Trigger"
                },
            ],
        },
        {
            name: "defaultPWMOutSetting",
            displayName: "Default PWM output Polarity",
            default: "GPTIMER_PWM_OUT_PIN_DEFAULT_0",
            description: `Default Polarity of PWM Output`,
            readOnly: false,
            hidden: true,
            options: [
                {
                    name: "GPTIMER_PWM_OUT_PIN_DEFAULT_0",
                    displayName: "PIN_DEFAULT_0"
                },
                {
                    name: "GPTIMER_PWM_OUT_PIN_DEFAULT_1",
                    displayName: "PIN_DEFAULT_1"
                },
            ],
        },
        {
            name: "outputModulationType",
            displayName: "PWM Out Pin Modulation",
            default: "GPTIMER_PWM_OUT_PIN_MODULATION_TOGGLE",
            description: `Modulation Type of PWM Output Pin`,
            readOnly: false,
            hidden: true,
            options: [
                {
                    name: "GPTIMER_PWM_OUT_PIN_MODULATION_PULSE",
                    displayName: "Pulse Modulation"
                },
                {
                    name: "GPTIMER_PWM_OUT_PIN_MODULATION_TOGGLE",
                    displayName: "Toggle Modulation"
                },
            ],
        },

        /* Capture Mode Configurables */
        {
            name: "captureMode",
            displayName: "Counter Mode",
            default: "GPTIMER_INPUT_CAPTURE_MODE_SINGLE",
            description: `Capture Mode selection, Single Capture or Double Capture`,
            readOnly: false,
            hidden: true,
            options: [
                {
                    name: "GPTIMER_INPUT_CAPTURE_MODE_SINGLE",
                    displayName: "MODE_SINGLE"
                },
                {
                    name: "GPTIMER_INPUT_CAPTURE_MODE_SECOND",
                    displayName: "MODE_SECOND"
                },
            ],
        },
        {
            name: "captureEventMode",
            displayName: "Capture Event Mode",
            default: "GPTIMER_INPUT_CAPTURE_EVENT_NO_CAPTURE",
            description: `Capture Event select`,
            readOnly: false,
            hidden: true,
            options: [
                {
                    name: "GPTIMER_INPUT_CAPTURE_EVENT_NO_CAPTURE",
                    displayName: "EVENT_NO_CAPTURE"
                },
                {
                    name: "GPTIMER_INPUT_CAPTURE_EVENT_RISING",
                    displayName: "EVENT_RISING"
                },
                {
                    name: "GPTIMER_INPUT_CAPTURE_EVENT_FALLING",
                    displayName: "EVENT_FALLING"
                },
                {
                    name: "GPTIMER_INPUT_CAPTURE_EVENT_EDGE",
                    displayName: "EVENT_EDGE"
                },
            ],
        },
        {
            name: "overflowCallbackFxn",
            displayName: "Overflow Callback",
            default: "NULL",
            hidden: true,
            description: "Overflow Condition callback function when interrupt is Enabled",
        },
        {
            name: "compareMatchCallbackFxn",
            displayName: "Compare Match Callback",
            default: "NULL",
            hidden: true,
            description: "Compare Match Condition callback function when interrupt is Enabled",
        },
        {
            name: "captureCallbackFxn",
            displayName: "Capture Callback",
            default: "NULL",
            hidden: true,
            description: "Capture Condition callback function when interrupt is Enabled",
        },
    ],

    validate: validate,
    pinmuxRequirements,
    getInstanceConfig,
    getInterfaceName,
    getPeripheralPinNames,
};

exports = gp_timer_module;
