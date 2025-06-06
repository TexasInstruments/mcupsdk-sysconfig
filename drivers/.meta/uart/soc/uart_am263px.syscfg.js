let common = system.getScript("/common");
let helperScript = system.getScript(`/clockTree/helperScript.js`);

const uart_config_r5fss = [
    {
        name            : "UART0",
        baseAddr        : "CSL_UART0_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 38,
        clockIds        : [ "SOC_RcmPeripheralId_LIN0_UART0" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN0_UART0",
                clkId   : getClkSource("UART0"),
                clkRate : getClkRate("UART0"),
            },
        ],
    },
    {
        name            : "UART1",
        baseAddr        : "CSL_UART1_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 39,
        clockIds        : [ "SOC_RcmPeripheralId_LIN1_UART1" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN1_UART1",
                clkId   : getClkSource("UART1"),
                clkRate : getClkRate("UART1"),
            },
        ],
    },
    {
        name            : "UART2",
        baseAddr        : "CSL_UART2_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 40,
        clockIds        : [ "SOC_RcmPeripheralId_LIN2_UART2" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN2_UART2",
                clkId   : getClkSource("UART2"),
                clkRate : getClkRate("UART2"),
            },
        ],
    },
    {
        name            : "UART3",
        baseAddr        : "CSL_UART3_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 41,
        clockIds        : [ "SOC_RcmPeripheralId_LIN3_UART3" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN3_UART3",
                clkId   : getClkSource("UART3"),
                clkRate : getClkRate("UART3"),
            },
        ],
    },
    {
        name            : "UART4",
        baseAddr        : "CSL_UART4_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 42,
        clockIds        : [ "SOC_RcmPeripheralId_LIN4_UART4" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN4_UART4",
                clkId   : getClkSource("UART4"),
                clkRate : getClkRate("UART4"),
            },
        ],
    },
    {
        name            : "UART5",
        baseAddr        : "CSL_UART5_U_BASE",
        inputClkFreq    : getClkRate(),
        intrNum         : 43,
        clockIds        : [ "SOC_RcmPeripheralId_LIN5_UART5" ],
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_LIN5_UART5",
                clkId   : getClkSource("UART5"),
                clkRate : getClkRate("UART5"),
            },
        ],
    },
];

function getConfigArr() {
    let uart_config;

    if(common.getSelfSysCfgCoreName().includes("r5f")) {
        uart_config = uart_config_r5fss;
    }
    else {
        uart_config = system.getScript(`/imports/drivers/uart/soc/uart_${common.getSocName()}_hsm.syscfg.js`).uart_config_m4f;
    }

    return uart_config;
}

function getClkRate(instanceName =  "UART0") {

    if (instanceName === "")
        return 0;
    let namedConnection = instanceName + "_CLK"
    let uart_input_clk_freq = helperScript.helperGetFrequencyNamedConnection(namedConnection)

    return uart_input_clk_freq;
}


function getClkSource(instanceName = "UART0") {

    let uart_input_clock_source = "SOC_RcmPeripheralClockSource_" + helperScript.helperMux(instanceName);
    return uart_input_clock_source;
}

function getClockSourceOptions() {

    let muxSelectionLines = helperScript.helperMuxInputs(instanceName)
    muxSelectionLines = muxSelectionLines.map((value) => ({name: "SOC_RcmPeripheralClockSource_" + value.name, displayName: value.name}))
    return muxSelectionLines
}

function getClockOptions(clkSrc) {
    let res = []
    if(clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1") {
        res = [
            {name: 48000000, displayName: "48 MHz"},
            {name: 96000000, displayName: "96 MHz"},
            {name: 192000000, displayName: "192 MHz"},
        ];
    } else if (clkSrc === "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT0") {
        res = [{name: 160000000, displayName: "160 MHz"}];
    } else {
        /* Bad clk source */
    }

    return res;
}

exports = {
    getConfigArr,
    getClkRate,
    getClkSource,
    getClockOptions,
};
