
let common = system.getScript("/common");

let timerClockSourceConfig = [
    {
        "name": "WUCPUCLK",
    },
    {
        "name": "SYS_CLK",
    },
    {
        "name": "EXT_REFCLK",
    },
    {
        "name": "RCCLK10M",
    },
    {
        "name": "CTPS_GENF0",
    },
    {
        "name": "DPLL_CORE_HSDIV0_CLKOUT1",
    },
    {
        "name": "DPLL_PER_HSDIV0_CLKOUT0",
    },
    {
        "name": "DPLL_ETH_HSDIV0_CLKOUT0",
    }
];

function getTimerClockSourceValue(instance) {
    let clkSelMuxValue = 0;

    switch(instance.clkSource) {
        default:
        case "WUCPUCLK":
            clkSelMuxValue = 0x000;
            break;
        case "SYS_CLK":
            clkSelMuxValue = 0x222;
            break;
        case "EXT_REFCLK":
            clkSelMuxValue = 0x111;
            break;
        case "RCCLK10M":
            clkSelMuxValue = 0x555;
            break;
        case "CTPS_GENF0":
            clkSelMuxValue = 0x777;
            break;
        case "DPLL_CORE_HSDIV0_CLKOUT1":
            clkSelMuxValue = 0x444;
            break;
        case "DPLL_PER_HSDIV0_CLKOUT0":
            clkSelMuxValue = 0x333;
            break;
        case "DPLL_ETH_HSDIV0_CLKOUT0":
            clkSelMuxValue = 0x666;
            break;
    }
    return clkSelMuxValue;
}

function getStaticConfigArr() {
    let staticConfig_r5f = [];

    for(let i=0; i<8; i++)
    {
        staticConfig_r5f.push(
            {
                timerName: `RTI${i}`,
                timerBaseAddr: 0x52180000 + i*0x1000,
                /* RTI 0-3 are grouped together */
                timerHwiIntNum: 124 + (6 * i),
                timerInputPreScaler: 1,
                clkSelMuxAddr: 0x53208000 + 0x140 + 4*i,
                disableClkSourceConfig: false,
                lockUnlockDomain: "SOC_DOMAIN_ID_MAIN",
                lockUnlockPartition: "MSS_RCM_PARTITION0",
            }
        )
    }
    return staticConfig_r5f;
}

function getInterfaceName(inst) {

    return "RTI";
}

function getTimerClockSourceConfigArr() {

    return timerClockSourceConfig;
}

function getTimerClockSourceHz(clkSource) {
    let clkSourceHz = 0;
    switch(clkSource) {
        default:
        case "WUCPUCLK":
            clkSourceHz = 25*1000000;
        break;
        case "SYS_CLK":
            clkSourceHz = 200*1000000;
            if(common.getR5Freq() == "500MHz")
            {
                clkSourceHz = 250*1000000;
            }
        break;
        case "EXT_REFCLK":
            clkSourceHz = 100*1000000;
        break;
        case "RCCLK10M":
            clkSourceHz = 10*1000000;
        break;
        case "CTPS_GENF0":
            clkSourceHz = 50*1000000;
        break;
        case "DPLL_CORE_HSDIV0_CLKOUT1":
            clkSourceHz = 500*1000000;
        break;
        case "DPLL_PER_HSDIV0_CLKOUT0":
            clkSourceHz = 192*1000000;
            if(common.getR5Freq() == "500MHz")
            {
                clkSourceHz = 240*1000000;
            }
        break;
        case "DPLL_ETH_HSDIV0_CLKOUT0":
            clkSourceHz = 450*1000000;
        break;
    }
    return clkSourceHz;
}

function getBlockedTimers() {
    let cpu = common.getSelfSysCfgCoreName();
    let blockTimers = [];
    if(cpu.match(/r5f*/)) {
        if(system.contexts["r5fss0-0"])
            blockTimers.push('RTI0');
        if(system.contexts["r5fss0-1"])
            blockTimers.push('RTI1');
    }
    return blockTimers;
}

exports = {
    getStaticConfigArr,
    getTimerClockSourceConfigArr,
    getTimerClockSourceValue,
    getTimerClockSourceHz,
    getInterfaceName,
    getBlockedTimers,
    oneShotModeSupport: false,
};
