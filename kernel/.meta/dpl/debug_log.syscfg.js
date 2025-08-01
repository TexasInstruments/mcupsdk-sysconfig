
let common = system.getScript("/common");

function getCpuID() {
    return system.getScript(`/drivers/soc/drivers_${common.getSocName()}`).getCpuID();
}

function getUartConfigSupported() {

    let socName = common.getSocName();
    let uartConfigSupported = true;

    /* Uart log is currently not supported for F29H85x, this can be added after the support is added. */
    if(socName.match(/f29h85x/))
    {
        uartConfigSupported = false;
    }
    return uartConfigSupported;
}

function getLogZoneErrorSupported() {

    let socName = common.getSocName();
    let LogZoneErrorSupported = true;

    /* Log Zone Error is currently not supported for F29H85x, this can be added after the support is added. */
    if(socName.match(/f29h85x/))
    {
        LogZoneErrorSupported = false;
    }
    return LogZoneErrorSupported;
}

function getLogZoneWarningSupported() {

    let socName = common.getSocName();
    let LogZoneWarningSupported = true;

    /* Log Zone Warning is currently not supported for F29H85x, this can be added after the support is added. */
    if(socName.match(/f29h85x/))
    {
        LogZoneWarningSupported = false;
    }
    return LogZoneWarningSupported;
}

function getLogZoneInfoSupported() {

    let socName = common.getSocName();
    let LogZoneInfoSupported = true;

    /* Log Zone Info is currently not supported for F29H85x, this can be added after the support is added. */
    if(socName.match(/f29h85x/))
    {
        LogZoneInfoSupported = false;
    }
    return LogZoneInfoSupported;
}

function getCssLogSupported() {

    let socName = common.getSocName();
    let CssLogSupported = true;

    /* Css Log is currently not supported for F29H85x, this can be added after the support is added. */
    if(socName.match(/f29h85x/))
    {
        CssLogSupported = false;
    }
    return CssLogSupported;
}

function getMemLogSupported() {

    let socName = common.getSocName();
    let MemLogSupported = true;
    return MemLogSupported;
}

function getSharedMemLogSupported() {

    let socName = common.getSocName();
    let sharedMemLogSupported = true;

    /* Shared mem log is currently not supported for AM62 and F29H85x, this can be added after the support is added. */
    if(socName.match(/am62x/) || socName.match(/f29h85x/))
    {
        sharedMemLogSupported = false;
    }
    return sharedMemLogSupported;
}

function validate(instance, report) {

    /* multi-script validation  */
    let coreNames = common.getSysCfgCoreNames();
    let selfCoreName = common.getSelfSysCfgCoreName();

    for ( let remoteCoreName of coreNames)
    {
        if( remoteCoreName != selfCoreName)
        {
            let remote_core_instance = common.getStaticModuleForCore('/kernel/dpl/debug_log', remoteCoreName);

            if(remote_core_instance && instance.enableSharedMemLogReader === true && remote_core_instance.enableSharedMemLogReader === true)
            {
                /* if UART log is enabled at this core, then it should not be enabled at other cores */
                report.logError(`Shared memory log reader can be enabled on one core only, disable at this core or at ${remoteCoreName}`,
                                instance, "enableSharedMemLogReader");
            }
        }
    }
}

function getConfigurables()
{
    let config = [];
    let socName = common.getSocName();

    config.push(
        {
            name: "enableLogZoneError",
            displayName: "Enable Error Log Zone",
            default: true,
            description: "Used to enable error logs. When enabled, it logs all messages coming from DebugP_logError API.",
            hidden: !getLogZoneErrorSupported(),
        },
        {
            name: "enableLogZoneWarning",
            displayName: "Enable Warning Log Zone",
            default: true,
            description: "Used to enable warning logs. When enabled, it logs all messages coming from DebugP_logWarn API.",
            hidden: !getLogZoneWarningSupported(),
        },
        {
            name: "enableLogZoneInfo",
            displayName: "Enable Info Log Zone",
            default: false,
            description: "Used to enable information logs. When enabled, it logs all messages coming from DebugP_logInfo API.",
            hidden: !getLogZoneInfoSupported(),
        },
        {
            name: "enableMemLog",
            displayName: "Enable Memory Log",
            longDescription: "Used to enable memory logging. When enabled, the log messages are saved to memory used by application. A buffer will be created via Sysconfig code generation to store the logs. This will increase the overall size of application. Logging can be done via DebugP_memLogWriterPutChar API.",
            default: false,
            hidden: !getMemLogSupported(),
        },
        {
            name: "enableUartLog",
            displayName: "Enable UART Log",
            description: "Used to enable logging via UART peripheral. When enabled the log messages will now be printed on UART console used by the application.",
            longDescription:
    `Configure the UART to use for logging, using options shown below on this page.
    This also enables UART for console input via the DebugP_readLine and DebugP_scanf APIs.

    Make sure to open the UART driver in order for the logs to be visible on the UART console.
    UART driver is opened when Drivers_open() that is generated by SysConfig is called.
    `,
            default: false,
            readOnly: !getUartConfigSupported(),
            hidden: !getUartConfigSupported(),
        },
        {
            name: "enableSharedMemLog",
            displayName: "Enable Shared Memory Log Writer",
            description: `Logs string to shared memory, some other core should have shared memory
                        log reader enabled to output these logs to a UART or CCS console`,
            default: false,
            readOnly: !getSharedMemLogSupported(),
            hidden: !getSharedMemLogSupported(),
        },
        {
            name: "enableSharedMemLogReader",
            displayName: "Enable Shared Memory Log Reader",
            description: "Used to enable shared memory log writes. When enabled, it can log the messages to the shared memory region. Messages can be logged using DebugP_shmLogWriterPutChar API.",
            longDescription: `Reads strings logged from other remote cores and output them to the console selected on this core.
                        In case of freertos application the reader task will be created by default. While in the case of nortos 
                        user needs to call DebugP_shmLogRead() API.`,
            default: false,
            readOnly: !getSharedMemLogSupported(),
            hidden: !getSharedMemLogSupported(),
        },
    )

    if(socName.match(/am64x/))
    {
        config.push(
            {
                name: "enableCssLog",
                displayName: "Enable CCS Log",
                description: "Logs string to CCS console. This needs CCS and JTAG connected to the EVM.",
                longDescription:
        `Enable CCS logging for A53 only when loading the apllication using CCS and JTAG connected.
    
        Do not enable CCS loging in A53 when booting using SBL. This can cause error while running the application.
        `,
                default: true,
                hidden: !getCssLogSupported(),
            },
        )
    }
    else
    {
        config.push(
            {
                name: "enableCssLog",
                displayName: "Enable CCS Log",
                description: "Logs string to CCS console. When enabled, it prints all the logging messages on CCS console. This needs CCS and JTAG connected to the EVM.",
                default: true,
                hidden: !getCssLogSupported(),
            },
        )
    }
    return config;
}

let debug_log_module = {
    displayName: "Debug Log",
    longDescription:
`Debug logging configuration, like UART, CCS and shared memory logging enable/disable.

When shared memory writer/reader is enabled, make sure to place the shared memory section
generated by SysCfg at the same location in the linker command file for all the cores.
Refer instructions in the generated ti_dpl_config.c for more details.
`,
    templates: {
        "/kernel/dpl/dpl_config.c.xdt": {
            dpl_config: "/kernel/dpl/debug_log.c.xdt",
            dpl_init: "/kernel/dpl/debug_log_init.c.xdt",
        },
        "/kernel/dpl/dpl_config.h.xdt": "/kernel/dpl/debug_log.h.xdt",
    },
    moduleStatic: {
        moduleInstances: function (inst) {
            let modInstances = new Array();

            if(inst.enableUartLog) {
                modInstances.push({
                    name: "uartLog",
                    displayName: "UART",
                    description: "UART to use with the logger API.",
                    collapsed: false,
                    moduleName: '/drivers/uart/uart',
                });
            }

            return (modInstances);
        },

        config: getConfigurables(),
        validate,
    },
    getCpuID,

};

exports = debug_log_module;

