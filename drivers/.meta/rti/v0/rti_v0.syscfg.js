
let common = system.getScript("/common");
let soc = system.getScript(`/drivers/rti/soc/rti_${common.getSocName()}`);
let hwi = system.getScript("/kernel/dpl/hwi.js");

function getStaticConfigArr() {
    return soc.getStaticConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let solution = moduleInstance[getInterfaceName(moduleInstance)].$solution;
    let staticConfigArr = getStaticConfigArr();
    let staticConfig = staticConfigArr.find( o => o.name === solution.peripheralName);

    let clkSelMuxValue = soc.getRtiClockSourceValue(moduleInstance);

    return {
        ...staticConfig,
        ...moduleInstance,
        clkSelMuxValue : clkSelMuxValue,
        nsecPerTick0 : Math.trunc( moduleInstance.nsecPerTick0 ),
        nsecPerTick1 : Math.trunc( moduleInstance.nsecPerTick1 ),
        nsecPerTick2 : Math.trunc( moduleInstance.nsecPerTick2 ),
        nsecPerTick3 : Math.trunc( moduleInstance.nsecPerTick3 ),
        compareEnable : [moduleInstance.compare0Enable, moduleInstance.compare1Enable, moduleInstance.compare2Enable, moduleInstance.compare3Enable],
        enableInt: [moduleInstance.enableIntr0, moduleInstance.enableIntr1, moduleInstance.enableIntr2, moduleInstance.enableIntr3],
        intrPriority: [moduleInstance.intrPriority0, moduleInstance.intrPriority1, moduleInstance.intrPriority2, moduleInstance.intrPriority3],
        enableDmaTrigger: [moduleInstance.enableDmaTrigger0, moduleInstance.enableDmaTrigger1, moduleInstance.enableDmaTrigger2, moduleInstance.enableDmaTrigger3],
        eventCallback: [moduleInstance.eventCallback0, moduleInstance.eventCallback1, moduleInstance.eventCallback2, moduleInstance.eventCallback3],
    }
};

function timerFilter(peripheral) {
    /* instances used by ClockP */
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

    let peripheral = {
        name          : interfaceName,
        displayName   : "Timer Instance",
        interfaceName : interfaceName,
        filter        : timerFilter,
        resources     : [],
        canShareWith: "/drivers/rti/rti",
    };

    return [peripheral];
}

function getInterfaceName(inst) {
    return soc.getInterfaceName(inst);
}

function validate(instance, report) {
    common.validate.checkNumberRange(instance, report, "nsecPerTick0", 1, 1000000000, "dec");
    common.validate.checkNumberRange(instance, report, "nsecPerTick1", 1, 1000000000, "dec");
    common.validate.checkNumberRange(instance, report, "nsecPerTick2", 1, 1000000000, "dec");
    common.validate.checkNumberRange(instance, report, "nsecPerTick3", 1, 1000000000, "dec");
    common.validate.checkNumberRange(instance, report, "inputClkHz", 32000, 1000000000, "dec");
    common.validate.checkValidCName(instance, report, "eventCallback0");
    common.validate.checkValidCName(instance, report, "eventCallback1");
    common.validate.checkValidCName(instance, report, "eventCallback2");
    common.validate.checkValidCName(instance, report, "eventCallback3");
    common.validate.checkNumberRange(instance, report, "intrPriority0", 0, hwi.getHwiMaxPriority(), "dec");
    common.validate.checkNumberRange(instance, report, "intrPriority1", 0, hwi.getHwiMaxPriority(), "dec");
    common.validate.checkNumberRange(instance, report, "intrPriority2", 0, hwi.getHwiMaxPriority(), "dec");
    common.validate.checkNumberRange(instance, report, "intrPriority3", 0, hwi.getHwiMaxPriority(), "dec");
}

function onChangeClkSource(instance, ui)
{
    instance.inputClkHz  = soc.getRtiClockSourceHz( instance.clkSource );

    onChangecntr0OpFreq(instance, ui);
    onChangecntr1OpFreq(instance, ui);

}

function onChangecntr0OpFreq(instance, ui)
{
    let cntr0Prescaler = Math.trunc(instance.inputClkHz/instance.cntr0OpFreq);

    if(instance.counter0Enable)
    {
        instance.cntr0ActOpFreq  = instance.inputClkHz/cntr0Prescaler;
    }
}

function onChangecntr1OpFreq(instance, ui)
{
    let cntr1Prescaler = Math.trunc(instance.inputClkHz/instance.cntr1OpFreq);

    if(instance.counter1Enable)
    {
        instance.cntr1ActOpFreq  = instance.inputClkHz/cntr1Prescaler;
    }
}

function onChangeNsecPerTick0(instance, ui)
{
    let requiredNsecs = Math.trunc( instance.nsecPerTick0);
    let timerCycles   = Math.trunc( instance.compInputClkHz0 * requiredNsecs / 1000000000 );
    let actualNsecs   = Math.trunc( (1000000000 / instance.compInputClkHz0) * timerCycles );

    if(instance.compare0Enable)
    {
        instance.actualNsecPerTick0  = actualNsecs;
    }
}

function onChangeNsecPerTick1(instance, ui)
{
    let requiredNsecs = Math.trunc( instance.nsecPerTick1 );
    let timerCycles   = Math.trunc( instance.compInputClkHz1 * requiredNsecs / 1000000000 );
    let actualNsecs   = Math.trunc( (1000000000 / instance.compInputClkHz1) * timerCycles );

    if(instance.compare1Enable)
    {
        instance.actualNsecPerTick1  = actualNsecs;
    }
}

function onChangeNsecPerTick2(instance, ui)
{
    let requiredNsecs = Math.trunc( instance.nsecPerTick2 );
    let timerCycles   = Math.trunc( instance.compInputClkHz2 * requiredNsecs / 1000000000 );
    let actualNsecs   = Math.trunc( (1000000000 / instance.compInputClkHz2) * timerCycles );

    if(instance.compare2Enable)
    {
        instance.actualNsecPerTick2  = actualNsecs;
    }
}

function onChangeNsecPerTick3(instance, ui)
{
    let requiredNsecs = Math.trunc( instance.nsecPerTick3);
    let timerCycles   = Math.trunc( instance.compInputClkHz3 * requiredNsecs / 1000000000 );
    let actualNsecs   = Math.trunc( (1000000000 / instance.compInputClkHz3) * timerCycles );

    if(instance.compare3Enable)
    {
        instance.actualNsecPerTick3  = actualNsecs;
    }
}

let timer_module = {
    displayName: "RTI",
    templates: {
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/rti/templates/rti.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/rti/templates/rti_open_close_config.c.xdt",
            driver_open: "/drivers/rti/templates/rti_open.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/rti/templates/rti_open_close_config.h.xdt",
        },
    },
    config: [
        {
            name: "inputClkHz",
            displayName: "Input Clock Frequency (Hz)",
            default: soc.getRtiClockSourceHz( soc.getRtiClockSourceConfigArr()[0].name ),
            description: "Make sure the value put here matches the actual input clock frequency provided on the board/SOC"
        },
        {
            name: "clkSource",
            displayName: "Input Clock Source",
            default: soc.getRtiClockSourceConfigArr()[0].name,
            options: soc.getRtiClockSourceConfigArr(),
            onChange: onChangeClkSource,
        },
        {
            name: "continueOnSuspend",
            displayName: "Enable Continue On Suspend",
            default: false,
        },
        {
            name: "counterBlock0",
            displayName:"Counter Block 0",
            config:
            [
                {
                    name: "counter0Enable",
                    displayName: "Enable Counter Block 0",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.counter0Enable == true)
                        {
                            ui.cntr0OpFreq.hidden = false;
                            ui.cntr0ActOpFreq.hidden = false;
                            ui.captureEvent0.hidden = false;
                            /* Some SOC's don't support NTU. Don't show this config for such timers */
                            if(soc.ntuSupport == true)
                            {
                                ui.ntu.hidden = false;
                                ui.cntr0ClkSrc.hidden = false;
                            }
                        }
                        else
                        {
                            ui.cntr0OpFreq.hidden = true;
                            ui.cntr0ActOpFreq.hidden = true;
                            ui.captureEvent0.hidden = true;
                            ui.ntuSrc.hidden = true;
                            ui.cntr0ClkSrc.hidden = true;
                        }
                    },
                },
                {
                    name: "cntr0ClkSrc",
                    displayName: "Counter 0 Clock Source",
                    default: "COUNTER",
                    description: `Select one-shot mode, or periodic mode`,
                    options: [
                        { name: "COUNTER" },
                        { name: "NTU" },
                    ],
                    hidden: true,
                },
                {
                    name: "ntuSrc",
                    displayName: "NTU Source",
                    default: "0",
                    description: "NTU source of Counter block 0.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                        { name: "2" },
                        { name: "3" },
                    ],
                    hidden: true,
                },
                {
                    name: "cntr0OpFreq",
                    displayName: "Desired Output Frequency (Hz)",
                    default: 1000000,
                    description: "This is the desired output frequency of Counter block 0.",
                    hidden: true,
                    onChange: onChangecntr0OpFreq,
                },
                {
                    name: "cntr0ActOpFreq",
                    displayName: "Actual Output Frequency (Hz)",
                    default: 1000000,
                    description: "This is the actual output frequency of Counter block 0.",
                    readOnly: true,
                    hidden: true,
                },
                {
                    name: "captureEvent0",
                    displayName: "Capture Event Source",
                    default: "0",
                    description: "Capture source of Counter block 0.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
            ]
        },
        {
            displayName:"Counter Block 1",
            config:
            [
                {
                    name: "counter1Enable",
                    displayName: "Enable Counter Block 1",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.counter1Enable == true)
                        {
                            ui.cntr1OpFreq.hidden = false;
                            ui.cntr1ActOpFreq.hidden = false;
                            ui.captureEvent1.hidden = false;
                        }
                        else
                        {
                            ui.cntr1OpFreq.hidden = true;
                            ui.cntr1ActOpFreq.hidden = true;
                            ui.captureEvent1.hidden = true;
                        }
                    },
                },
                {
                    name: "cntr1OpFreq",
                    displayName: "Desired Output Frequency (Hz)",
                    default: 1000000,
                    description: "This is the desired output frequency of Counter block 1.",
                    hidden: true,
                    onChange: onChangecntr1OpFreq,
                },
                {
                    name: "cntr1ActOpFreq",
                    displayName: "Actual Counter 1 Output Frequency (Hz)",
                    default: 1000000,
                    description: "This is the actual output frequency of Counter block 1.",
                    readOnly: true,
                    hidden: true,
                },
                {
                    name: "captureEvent1",
                    displayName: "Capture Event Source",
                    default: "0",
                    description: "Capture source of Counter block 1.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
            ]
        },
        {
            displayName:"Compare Event 0",
            config:
            [
                {
                    name: "compare0Enable",
                    displayName: "Enable Compare Event 0",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.compare0Enable == true)
                        {
                            ui.compInputClkHz0.hidden = false;
                            ui.compareSource0.hidden = false;
                            ui.nsecPerTick0.hidden = false;
                            ui.actualNsecPerTick0.hidden = false;
                            ui.enableIntr0.hidden = false;
                            ui.enableDmaTrigger0.hidden = false;
                        }
                        else
                        {
                            ui.compInputClkHz0.hidden = true;
                            ui.compareSource0.hidden = true;
                            ui.nsecPerTick0.hidden = true;
                            ui.actualNsecPerTick0.hidden = true;
                            ui.enableIntr0.hidden = true;
                            ui.enableDmaTrigger0.hidden = true;
                        }
                    },
                },
                {
                    name: "compareSource0",
                    displayName: "Compare Event Source",
                    default: "0",
                    description: "Counter source of Compare block 0.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
                {
                    name: "compInputClkHz0",
                    displayName: "Input Clock Frequency (Hz)",
                    default: 0,
                    description: "The Input clock frequency generated from Counter module ",
                    readOnly: true,
                    hidden: true,
                    getValue: function (inst, ui) {
                        if(inst.compareSource0 == "0")
                        {
                            return inst.cntr0ActOpFreq;
                        }
                        else{
                            return inst.cntr1ActOpFreq;
                        }
                    },
                },
                {
                    name: "nsecPerTick0",
                    displayName: "Tick Period (nsecs)",
                    default: 1000,
                    description: "Timer tick period in units of nsecs. MUST be >= 1.000 and <= 1000000000.0000",
                    hidden: true,
                    onChange: onChangeNsecPerTick0,
                },
                {
                    name: "actualNsecPerTick0",
                    displayName: "Actual Tick Period (nsecs)",
                    default: 1000,
                    description: "This is the actual time period for which the timer will be configured.",
                    readOnly: true,
                    hidden: true,
                },
                {
                    name: "enableIntr0",
                    displayName: "Enable Compare Interrupt",
                    default: false,
                    hidden: true,
                    onChange: function (inst, ui) {
                        if(inst.enableIntr0 == true)
                        {
                            ui.intrPriority0.hidden = false;
                            ui.eventCallback0.hidden = false;
                        }
                        else
                        {
                            ui.intrPriority0.hidden = true;
                            ui.eventCallback0.hidden = true;
                        }
                    }
                },
                {
                    name: "intrPriority0",
                    displayName: "Interrupt Priority",
                    default: 4,
                    description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
                    hidden: true,
                },
                {
                    name: "eventCallback0",
                    displayName: "Event Callback",
                    default: "NULL",
                    description: "Callback function to call when Compare matches",
                    hidden: true,
                },
                {
                    name: "enableDmaTrigger0",
                    displayName: "DMA Trigger Enable",
                    default: false,
                    description: `Enable DMA Trigger from Compare 0`,
                    hidden: true,
                },
            ]
        },
        {
            displayName:"Compare Event 1",
            config:
            [
                {
                    name: "compare1Enable",
                    displayName: "Enable Compare Event 1",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.compare1Enable == true)
                        {
                            ui.compInputClkHz1.hidden = false;
                            ui.compareSource1.hidden = false;
                            ui.nsecPerTick1.hidden = false;
                            ui.actualNsecPerTick1.hidden = false;
                            ui.enableIntr1.hidden = false;
                            ui.enableDmaTrigger1.hidden = false;
                        }
                        else
                        {
                            ui.compInputClkHz1.hidden = true;
                            ui.compareSource1.hidden = true;
                            ui.nsecPerTick1.hidden = true;
                            ui.actualNsecPerTick1.hidden = true;
                            ui.enableIntr1.hidden = true;
                            ui.enableDmaTrigger1.hidden = true;
                        }
                    },
                },
                {
                    name: "compareSource1",
                    displayName: "Compare Event Source",
                    default: "0",
                    description: "Counter source of Compare block 1.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
                {
                    name: "compInputClkHz1",
                    displayName: "Input Clock Frequency (Hz)",
                    default: 0,
                    description: "The Input clock frequency generated from Counter module ",
                    readOnly: true,
                    hidden: true,
                    getValue: function (inst, ui) {
                        if(inst.compareSource1 == "0")
                        {
                            return inst.cntr0ActOpFreq;
                        }
                        else{
                            return inst.cntr1ActOpFreq;
                        }
                    },
                },
                {
                    name: "nsecPerTick1",
                    displayName: "Tick Period (nsecs)",
                    default: 1000,
                    description: "Timer tick period in units of nsecs. MUST be >= 1.000 and <= 1000000000.0000",
                    hidden: true,
                    onChange: onChangeNsecPerTick1,
                },
                {
                    name: "actualNsecPerTick1",
                    displayName: "Actual Tick Period (nsecs)",
                    default: 1000,
                    description: "This is the actual time period for which the timer will be configured.",
                    readOnly: true,
                    hidden: true,
                },
                {
                    name: "enableIntr1",
                    displayName: "Enable Compare Interrupt",
                    default: false,
                    hidden: true,
                    onChange: function (inst, ui) {
                        if(inst.enableIntr1 == true)
                        {
                            ui.intrPriority1.hidden = false;
                            ui.eventCallback1.hidden = false;
                        }
                        else
                        {
                            ui.intrPriority1.hidden = true;
                            ui.eventCallback1.hidden = true;
                        }
                    }
                },
                {
                    name: "intrPriority1",
                    displayName: "Interrupt Priority",
                    default: 4,
                    description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
                    hidden: true,
                },
                {
                    name: "eventCallback1",
                    displayName: "Timer Callback",
                    default: "NULL",
                    description: "Callback function to call when Compare 1 matches",
                    hidden: true,
                },
                {
                    name: "enableDmaTrigger1",
                    displayName: "DMA Trigger Enable",
                    default: false,
                    description: `Enable DMA Trigger from Compare 1`,
                    hidden: true,
                },
            ]
        },
        {
            displayName:"Compare Event 2",
            config:
            [
                {
                    name: "compare2Enable",
                    displayName: "Enable Compare Event 2",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.compare2Enable == true)
                        {
                            ui.compInputClkHz2.hidden = false;
                            ui.compareSource2.hidden = false;
                            ui.nsecPerTick2.hidden = false;
                            ui.actualNsecPerTick2.hidden = false;
                            ui.enableIntr2.hidden = false;
                            ui.enableDmaTrigger2.hidden = false;
                        }
                        else
                        {
                            ui.compInputClkHz2.hidden = true;
                            ui.compareSource2.hidden = true;
                            ui.nsecPerTick2.hidden = true;
                            ui.actualNsecPerTick2.hidden = true;
                            ui.enableIntr2.hidden = true;
                            ui.enableDmaTrigger2.hidden = true;
                        }
                    },
                },
                {
                    name: "compareSource2",
                    displayName: "Compare Event Source",
                    default: "0",
                    description: "Counter source of Compare block 2.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
                {
                    name: "compInputClkHz2",
                    displayName: "Input Clock Frequency (Hz)",
                    default: 0,
                    description: "The Input clock frequency generated from Counter module ",
                    readOnly: true,
                    hidden: true,
                    getValue: function (inst, ui) {
                        if(inst.compareSource2 == "0")
                        {
                            return inst.cntr0ActOpFreq;
                        }
                        else{
                            return inst.cntr1ActOpFreq;
                        }
                    },
                },
                {
                    name: "nsecPerTick2",
                    displayName: "Tick Period (nsecs)",
                    default: 1000,
                    description: "Timer tick period in units of nsecs. MUST be >= 1.000 and <= 1000000000.0000",
                    hidden: true,
                    onChange: onChangeNsecPerTick2,
                },
                {
                    name: "actualNsecPerTick2",
                    displayName: "Actual Tick Period (nsecs)",
                    default: 1000,
                    description: "This is the actual time period for which the timer will be configured.",
                    hidden: true,
                    readOnly: true,
                },
                {
                    name: "enableIntr2",
                    displayName: "Enable Compare Interrupt",
                    default: false,
                    hidden: true,
                    onChange: function (inst, ui) {
                        if(inst.enableIntr2 == true)
                        {
                            ui.intrPriority2.hidden = false;
                            ui.eventCallback2.hidden = false;
                        }
                        else
                        {
                            ui.intrPriority2.hidden = true;
                            ui.eventCallback2.hidden = true;
                        }
                    }
                },
                {
                    name: "intrPriority2",
                    displayName: "Interrupt Priority",
                    default: 4,
                    description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
                    hidden: true,
                },
                {
                    name: "eventCallback2",
                    displayName: "Timer Callback",
                    default: "NULL",
                    description: "Callback function to call when Compare 2 matches",
                    hidden: true,
                },
                {
                    name: "enableDmaTrigger2",
                    displayName: "DMA Trigger Enable",
                    default: false,
                    description: `Enable DMA Trigger from Compare 2`,
                    hidden: true,
                },
            ]
        },
        {
            displayName:"Compare Event 3",
            config:
            [
                {
                    name: "compare3Enable",
                    displayName: "Enable Compare Event 3",
                    default: false,
                    onChange: function (inst, ui) {
                        if(inst.compare3Enable == true)
                        {
                            ui.compInputClkHz3.hidden = false;
                            ui.compareSource3.hidden = false;
                            ui.nsecPerTick3.hidden = false;
                            ui.actualNsecPerTick3.hidden = false;
                            ui.enableIntr3.hidden = false;
                            ui.enableDmaTrigger3.hidden = false;
                        }
                        else
                        {
                            ui.compInputClkHz3.hidden = true;
                            ui.compareSource3.hidden = true;
                            ui.nsecPerTick3.hidden = true;
                            ui.actualNsecPerTick3.hidden = true;
                            ui.enableIntr3.hidden = true;
                            ui.enableDmaTrigger3.hidden = true;
                        }
                    },
                },
                {
                    name: "compareSource3",
                    displayName: "Compare Event Source",
                    default: "0",
                    description: "Counter source of Compare block 3.",
                    options: [
                        { name: "0" },
                        { name: "1" },
                    ],
                    hidden: true,
                },
                {
                    name: "compInputClkHz3",
                    displayName: "Input Clock Frequency (Hz)",
                    default: 0,
                    description: "The Input clock frequency generated from Counter module ",
                    readOnly: true,
                    hidden: true,
                    getValue: function (inst, ui) {
                        if(inst.compareSource3 == "0")
                        {
                            return inst.cntr0ActOpFreq;
                        }
                        else{
                            return inst.cntr1ActOpFreq;
                        }
                    },
                },
                {
                    name: "nsecPerTick3",
                    displayName: "Tick Period (nsecs)",
                    default: 1000,
                    description: "Timer tick period in units of nsecs. MUST be >= 1.000 and <= 1000000000.0000",
                    hidden: true,
                    onChange: onChangeNsecPerTick3,
                },
                {
                    name: "actualNsecPerTick3",
                    displayName: "Actual Tick Period (nsecs)",
                    default: 1000,
                    description: "This is the actual time period for which the timer will be configured.",
                    readOnly: true,
                    hidden: true,
                },
                {
                    name: "enableIntr3",
                    displayName: "Enable Compare Interrupt",
                    default: false,
                    hidden: true,
                    onChange: function (inst, ui) {
                        if(inst.enableIntr3 == true)
                        {
                            ui.intrPriority3.hidden = false;
                            ui.eventCallback3.hidden = false;
                        }
                        else
                        {
                            ui.intrPriority3.hidden = true;
                            ui.eventCallback3.hidden = true;
                        }
                    }
                },
                {
                    name: "intrPriority3",
                    displayName: "Interrupt Priority",
                    default: 4,
                    description: `Interrupt Priority: 0 (highest) to ${hwi.getHwiMaxPriority()} (lowest)`,
                    hidden: true,
                },
                {
                    name: "eventCallback3",
                    displayName: "Timer Callback",
                    default: "NULL",
                    description: "Callback function to call when Compare 3 matches",
                    hidden: true,
                },
                {
                    name: "enableDmaTrigger3",
                    displayName: "DMA Trigger Enable",
                    default: false,
                    description: `Enable DMA Trigger from Compare 3`,
                    hidden: true,
                },
            ]
        },
    ],
    defaultInstanceName: "CONFIG_RTI",
    modules: function(inst) {
        return [{
            name: "system_common",
            moduleName: "/system_common",
        }]
    },
    pinmuxRequirements,
    getInstanceConfig,
    getInterfaceName,
};

exports = timer_module;
