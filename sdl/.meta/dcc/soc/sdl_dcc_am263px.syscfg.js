let common = system.getScript("/common");

const dcc0_input0_clks = [
    {name : "XTALCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_0",},
    {name : "RCCLK10M", src : "SDL_DCC_CLK0_SRC_CLOCK0_2",},
    {name : "EXT_REFCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_1",},
    {name : "RCCLK32K", src : "SDL_DCC_CLK0_SRC_CLOCK0_3",},
];

const dcc0_input1_clks = [
    {name: "XTALCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC3",},
    {name: "EXT_REFCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC4",},
    {name: "RCCLK32K", src: "SDL_DCC_CLK1_SRC_CLOCKSRC5",},
    {name: "R5SS0_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC1",},
    {name: "R5SS1_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC2",},
    {name: "SYS_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC0",},
];

const dcc1_input0_clks = [
    {name : "XTALCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_0",},
    {name : "RCCLK10M", src : "SDL_DCC_CLK0_SRC_CLOCK0_2",},
    {name : "EXT_REFCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_1",},
    {name : "RCCLK32K", src : "SDL_DCC_CLK0_SRC_CLOCK0_3",},
];

const dcc1_input1_clks = [
    {name: "RCCLK10M", src: "SDL_DCC_CLK1_SRC_CLOCKSRC3"},
    {name: "DPLL_CORE_HSDIV0_CLKOUT1", src: "SDL_DCC_CLK1_SRC_CLOCKSRC1"},
    {name: "DPLL_PER_HSDIV0_CLKOUT0", src: "SDL_DCC_CLK1_SRC_CLOCKSRC0"},
    {name: "DPLL_PER_HSDIV0_CLKOUT1", src: "SDL_DCC_CLK1_SRC_CLOCKSRC2"},
    {name: "FSI0_RX_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC4"},
    {name: "FSI1_RX_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC5"},
    {name: "FSI2_RX_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC6"},
    {name: "FSI3_RX_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC7"},
];

const dcc2_input0_clks = [
    {name : "XTALCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_0",},
    {name : "RCCLK10M", src : "SDL_DCC_CLK0_SRC_CLOCK0_2",},
    {name : "EXT_REFCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_1",},
];

const dcc2_input1_clks = [
    {name: "SYS_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC0",},
    {name: "WDT0_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC1",},
    {name: "WDT1_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC2",},
    {name: "WDT2_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC3",},
    {name: "WDT3_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC4",},
    {name: "MCAN0_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC5"},
    {name: "MCAN1_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC6"},
    {name: "TEMPSENSE_32K_CLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC7",},
];

const dcc3_input0_clks = [
    {name : "XTALCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_0",},
    {name : "RCCLK10M", src : "SDL_DCC_CLK0_SRC_CLOCK0_2",},
    {name : "EXT_REFCLK", src : "SDL_DCC_CLK0_SRC_CLOCK0_1",},
];

const dcc3_input1_clks = [
    {name: "RMII1_REFCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC0",},
    {name: "RMII2_REFCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC1",},
    {name: "RGMII1_RXC", src: "SDL_DCC_CLK1_SRC_CLOCKSRC2",},
    {name: "RGMII2_RXC", src: "SDL_DCC_CLK1_SRC_CLOCKSRC3",},
    {name: "MII1_RXCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC4",},
    {name: "MII2_RXCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC5",},
    {name: "PR0_MII0_RXCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC6",},
    {name: "PR0_MII1_RXCLK", src: "SDL_DCC_CLK1_SRC_CLOCKSRC7",},
];

const dcc_clk0_opts = [
    {name: "XTALCLK",},
    {name: "RCCLK10M",},
    {name: "EXT_REFCLK",},
    {name: "RCCLK32K",},
];

const dcc_clk1_opts = [
    {name: "XTALCLK"},
    {name: "RCCLK10M"},
    {name: "EXT_REFCLK"},
    {name: "RCCLK32K"},
    {name: "DPLL_CORE_HSDIV0_CLKOUT1"},
    {name: "DPLL_PER_HSDIV0_CLKOUT0"},
    {name: "DPLL_PER_HSDIV0_CLKOUT1"},
    {name: "R5SS0_CLK"},
    {name: "R5SS1_CLK"},
    {name: "SYS_CLK"},
    {name: "WDT0_CLK"},
    {name: "WDT1_CLK"},
    {name: "WDT2_CLK"},
    {name: "WDT3_CLK"},
    {name: "MCAN0_CLK"},
    {name: "MCAN1_CLK"},
    {name: "TEMPSENSE_32K_CLK"},
    {name: "RMII1_REFCLK"},
    {name: "RMII2_REFCLK"},
    {name: "RGMII1_RXC"},
    {name: "RGMII2_RXC"},
    {name: "MII1_RXCLK"},
    {name: "MII2_RXCLK"},
    {name: "PR0_MII0_RXCLK"},
    {name: "PR0_MII1_RXCLK"},
    {name: "FSI0_RX_CLK"},
    {name: "FSI1_RX_CLK"},
    {name: "FSI2_RX_CLK"},
    {name: "FSI3_RX_CLK"},
];

function getClkSrc(dccIndex, clk_num, dcc_clk)
{
    let clk_src = "SDL_DCC_CLK1_SRC_CLOCKSRC1";
    let clk_opts = dcc_config[dccIndex].input0Clks;

    if (clk_num == 1)
    {
        clk_opts = dcc_config[dccIndex].input1Clks;
    }

    clk_opts.forEach(clkOpt => {
        if (clkOpt.name.includes(dcc_clk)) {
            clk_src = clkOpt.src;
        }
    });

    return clk_src;
}

function getClk0Options()
{
    return dcc_clk0_opts;
}

function getClk1Options()
{
    return dcc_clk1_opts;
}

function getClk0DisabledOptions(inst)
{
    let disabledOpts = [];
    let found = 0;
    let clk_opts = dcc_config[inst.dccIndex].input0Clks;

    dcc_clk0_opts.forEach(option => {
        clk_opts.forEach(clkOpt => {
            if (clkOpt.name.includes(option.name)) {
		found = 1;
	    }
        });
        if (found != 1) {
            disabledOpts.push({
                name: option.name,
                reason: "Invalid Clk Src for this DCC Instance",
            });
        }
        found = 0;
    });

    return disabledOpts;
}

function getClk1DisabledOptions(inst)
{
    let disabledOpts = [];
    let found = 0;
    let clk_opts = dcc_config[inst.dccIndex].input1Clks;

    dcc_clk1_opts.forEach(option => {
        clk_opts.forEach(clkOpt => {
            if (clkOpt.name.includes(option.name)) {
                found = 1;
            }
        });
        if (found != 1) {
            disabledOpts.push({
                name: option.name,
                reason: "Invalid Clk Src for this DCC Instance",
            });
        }
        found = 0;
    });

    return disabledOpts;
}

const dcc_config = [
    {
        name                : "MSS_DCCA",
        index               : 0,
        input0Clks          : dcc0_input0_clks,
        input1Clks          : dcc0_input1_clks,
        esmInst             : "MAIN_ESM",
        esmEvent            : "SDL_ESM0_DCC0_DCC0_ERR",
        dccDoneIntr         : "SDL_R5FSS0_CORE0_INTR_DCC0_DONE",
    },
    {
        name                : "MSS_DCCB",
        index               : 1,
        input0Clks          : dcc1_input0_clks,
        input1Clks          : dcc1_input1_clks,
        esmInst             : "MAIN_ESM",
        esmEvent            : "SDL_ESM0_DCC1_DCC1_ERR",
        dccDoneIntr         : "SDL_R5FSS0_CORE0_INTR_DCC1_DONE",
    },
    {
        name                : "MSS_DCCC",
        index               : 2,
        input0Clks          : dcc2_input0_clks,
        input1Clks          : dcc2_input1_clks,
        esmInst             : "MAIN_ESM",
        esmEvent            : "SDL_ESM0_DCC2_DCC2_ERR",
        dccDoneIntr         : "SDL_R5FSS0_CORE0_INTR_DCC2_DONE",
    },
    {
        name                : "MSS_DCCD",
        index               : 3,
        input0Clks          : dcc3_input0_clks,
        input1Clks          : dcc3_input1_clks,
        esmInst             : "MAIN_ESM",
        esmEvent            : "SDL_ESM0_DCC3_DCC3_ERR",
        dccDoneIntr         : "SDL_R5FSS0_CORE0_INTR_DCC3_DONE",
    },
];

function getConfigArr() {
    return dcc_config;
}

exports = {
    getConfigArr,
    getClk0Options,
    getClk1Options,
    getClk0DisabledOptions,
    getClk1DisabledOptions,
    getClkSrc,
};
