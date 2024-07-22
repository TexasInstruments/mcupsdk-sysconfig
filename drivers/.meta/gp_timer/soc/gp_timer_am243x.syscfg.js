let common = system.getScript("/common");

function getStaticConfigArr() {
    let cpu = common.getSelfSysCfgCoreName();
    let staticConfigArr;

    if(cpu.match(/r5f*/)) {
        let staticConfig_r5f = [];

        for(let i=0; i<8; i++)
        {
            staticConfig_r5f.push(
                {
                    name: `DMTIMER${i}`,
                    baseAddr: 0x02400000 + i*0x10000,
                    intrNum: 152 + i,
                    eventId: 0,
                    timerInputPreScaler: 1,
                    clkSelMuxAddr: 0x430081B0 + 4*i,
                    lockUnlockDomain: "SOC_DOMAIN_ID_MAIN",
                    lockUnlockPartition: 2,
                }
            )
        }
        staticConfigArr = staticConfig_r5f;
    }
    if(cpu.match(/m4f*/)) {
        let staticConfig_m4f = [];
        for(let i=0; i<4; i++)
        {
            staticConfig_m4f.push(
                {
                    name: `MCU_DMTIMER${i}`,
                    baseAddr: 0x04800000 + i*0x10000,
                    intrNum: 4 + i + 16,
                    eventId: 0,
                    timerInputPreScaler: 1,
                    clkSelMuxAddr: 0x04508060 + 4*i,
                    lockUnlockDomain: "SOC_DOMAIN_ID_MCU",
                    lockUnlockPartition: 0,
                }
            )
        }
        staticConfigArr = staticConfig_m4f;
    }

    return staticConfigArr;
}

let timerClockSourceConfig_main = [
    {
        "name": "MCU_HFOSC0",
    },
    {
        "name": "MCU_HFOSC0_CLKOUT_32K",
    },
    {
        "name": "MAIN_PLL0_HSDIV7_CLKOUT",
    },
    {
        "name": "CLK_12M_RC",
    },
    {
        "name": "MCU_EXT_REFCLK0",
    },
    {
        "name": "EXT_REFCLK1",
    },
    {
        "name": "CPTS0_RFT_CLK",
    },
    {
        "name": "CPSW0_CPTS_RFT_CLK",
    },
    {
        "name": "MAIN_PLL1_HSDIV3_CLKOUT",
    },
    {
        "name": "MAIN_PLL2_HSDIV6_CLKOUT",
    },
    {
        "name": "CPSW0_CPTS_GENF0",
    },
    {
        "name": "CPSW0_CPTS_GENF1",
    },
    {
        "name": "CPTS0_CPTS_GENF1_0",
    },
    {
        "name": "CPTS0_CPTS_GENF2_0",
    },
    {
        "name": "CPTS0_CPTS_GENF3_0",
    },
    {
        "name": "CPTS0_CPTS_GENF4_0",
    },
];

let timerClockSourceConfig_mcu = [
    {
        "name": "MCU_HFOSC0",
    },
    {
        "name": "MCU_SYSCLK0",
    },
    {
        "name": "CLK_12M_RC",
    },
    {
        "name": "MCU_PLL0_HSDIV3",
    },
    {
        "name": "MCU_EXT_REFCLK0",
    },
    {
        "name": "MCU_HFOSC0_CLKOUT_32K",
    },
    {
        "name": "CPSW0_CPTS_GENF0",
    },
    {
        "name": "CLK_32K_RC",
    },
];

function getTimerClockSourceMainHz(clkSource) {

    let clkSourceHz = 0;

    switch(clkSource) {
        default:
        case "MCU_HFOSC0":
            clkSourceHz = 25*1000000;
            break;
        case "MCU_HFOSC0_CLKOUT_32K":
            clkSourceHz = 32*1000;
            break;
        case "MAIN_PLL0_HSDIV7_CLKOUT":
            clkSourceHz = 200*1000000;
            break;
        case "CLK_12M_RC":
            clkSourceHz = 12*1000000;
            break;
        case "MCU_EXT_REFCLK0":
            clkSourceHz = 1*1000000;
            break;
        case "EXT_REFCLK1":
            clkSourceHz = 1*1000000;
            break;
        case "CPTS0_RFT_CLK":
            clkSourceHz = 1*1000000;
            break;
        case "CPSW0_CPTS_RFT_CLK":
            clkSourceHz = 1*1000000;
            break;
        case "MAIN_PLL1_HSDIV3_CLKOUT":
            clkSourceHz = 192*1000000;
            break;
        case "MAIN_PLL2_HSDIV6_CLKOUT":
            clkSourceHz = 225*1000000;
            break;
        case "CPSW0_CPTS_GENF0":
            clkSourceHz = 1*1000000;
            break;
        case "CPSW0_CPTS_GENF1":
            clkSourceHz = 1*1000000;
            break;
        case "CPTS0_CPTS_GENF1_0":
            clkSourceHz = 1*1000000;
            break;
        case "CPTS0_CPTS_GENF2_0":
            clkSourceHz = 1*1000000;
            break;
        case "CPTS0_CPTS_GENF3_0":
            clkSourceHz = 1*1000000;
            break;
        case "CPTS0_CPTS_GENF4_0":
            clkSourceHz = 1*1000000;
            break;
    }

    return clkSourceHz;
}

function getTimerClockSourceMcuHz(clkSource) {

    let clkSourceHz = 0;
    switch(clkSource)
    {
        default:
        case "MCU_HFOSC0":
            clkSourceHz = 25*1000000;
            break;
        case "MCU_SYSCLK0":
            clkSourceHz = 100*1000000;
            break;
        case "CLK_12M_RC":
            clkSourceHz = 12*1000000;
            break;
        case "MCU_PLL0_HSDIV3":
            clkSourceHz = 200*1000000;
            break;
        case "MCU_EXT_REFCLK0":
            clkSourceHz = 1*1000000;
            break;
        case "MCU_HFOSC0_CLKOUT_32K":
            clkSourceHz = 32*1000;
            break;
        case "CPSW0_CPTS_GENF0":
            clkSourceHz = 1*1000000;
            break;
        case "CLK_32K_RC":
            clkSourceHz = 32*1000;
            break;
    }

    return clkSourceHz;
}

function getTimerClockSelectMaskValueMain(instance) {

    let clkSelMuxValue = 0;

    switch(instance.clkSource) {
        default:
        case "MCU_HFOSC0":
            clkSelMuxValue = 0x0;
            break;
        case "MCU_HFOSC0_CLKOUT_32K":
            clkSelMuxValue = 0x1;
            break;
        case "MAIN_PLL0_HSDIV7_CLKOUT":
            clkSelMuxValue = 0x2;
            break;
        case "CLK_12M_RC":
            clkSelMuxValue = 0x3;
            break;
        case "MCU_EXT_REFCLK0":
            clkSelMuxValue = 0x4;
            break;
        case "EXT_REFCLK1":
            clkSelMuxValue = 0x5;
            break;
        case "CPTS0_RFT_CLK":
            clkSelMuxValue = 0x6;
            break;
        case "CPSW0_CPTS_RFT_CLK":
            clkSelMuxValue = 0x7;
            break;
        case "MAIN_PLL1_HSDIV3_CLKOUT":
            clkSelMuxValue = 0x8;
            break;
        case "MAIN_PLL2_HSDIV6_CLKOUT":
            clkSelMuxValue = 0x9;
            break;
        case "CPSW0_CPTS_GENF0":
            clkSelMuxValue = 0xA;
            break;
        case "CPSW0_CPTS_GENF1":
            clkSelMuxValue = 0xB;
            break;
        case "CPTS0_CPTS_GENF1_0":
            clkSelMuxValue = 0xC;
            break;
        case "CPTS0_CPTS_GENF2_0":
            clkSelMuxValue = 0xD;
            break;
        case "CPTS0_CPTS_GENF3_0":
            clkSelMuxValue = 0xE;
            break;
        case "CPTS0_CPTS_GENF4_0":
            clkSelMuxValue = 0xF;
            break;
    }

    return clkSelMuxValue;
}

function getTimerClockSelectMaskValueMcu(instance) {

    let clkSelMuxValue = 0;

    switch(instance.clkSource) {
        default:
        case "MCU_HFOSC0":
            clkSelMuxValue = 0x0;
            break;
        case "MCU_SYSCLK0":
            clkSelMuxValue = 0x1;
            break;
        case "CLK_12M_RC":
            clkSelMuxValue = 0x2;
            break;
        case "MCU_PLL0_HSDIV3":
            clkSelMuxValue = 0x3;
            break;
        case "MCU_EXT_REFCLK0":
            clkSelMuxValue = 0x4;
            break;
        case "MCU_HFOSC0_CLKOUT_32K":
            clkSelMuxValue = 0x5;
            break;
        case "CPSW0_CPTS_GENF0":
            clkSelMuxValue = 0x6;
            break;
        case "CLK_32K_RC":
            clkSelMuxValue = 0x7;
            break;
    }

    return clkSelMuxValue;
}

function getTimerClockSelectMaskValue(instance) {

    let clkSelMuxValue = 0;

    if  (   instance.interfaceName == "MCU_DMTIMER0" ||
            instance.interfaceName == "MCU_DMTIMER1" ||
            instance.interfaceName == "MCU_DMTIMER2" ||
            instance.interfaceName == "MCU_DMTIMER3")
    {
        clkSelMuxValue = getTimerClockSelectMaskValueMcu(instance);
    }
    else
    {
        clkSelMuxValue = getTimerClockSelectMaskValueMain(instance);
    }

    return clkSelMuxValue;
}

function getConfigArr() {

    return getStaticConfigArr();
}

function getTimerClockSourceConfigArr_main() {
    return timerClockSourceConfig_main;
}

function getTimerClockSourceConfigArr_mcu() {
    return timerClockSourceConfig_mcu;
}


function getTimerClockSourceConfigArr() {
    let cpu = common.getSelfSysCfgCoreName();

    if(cpu.match(/m4f*/)) {
        return timerClockSourceConfig_mcu;
    }

    if(cpu.match(/r5f*/)) {
        return timerClockSourceConfig_main;
    }
}

function getBlockedTimers() {
    return ['DMTIMER8', 'DMTIMER9', 'DMTIMER10', 'DMTIMER11'];
}

exports = {
	getConfigArr,
    getTimerClockSourceConfigArr,
    getTimerClockSourceMainHz,
    getTimerClockSourceMcuHz,
    getBlockedTimers,
    getTimerClockSelectMaskValue,
    oneShotModeSupport: true,
};