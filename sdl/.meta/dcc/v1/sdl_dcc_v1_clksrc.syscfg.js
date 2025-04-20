let common = system.getScript("/common");
let soc = system.getScript(`/sdl/dcc/soc/sdl_dcc_${common.getSocName()}`);

function getConfigArr() {
    return soc.getConfigArr();
}

function getInstanceConfig(moduleInstance) {
    let configArr = getConfigArr();
    let config = configArr.find( o => o.name === moduleInstance.instance);

     return {
        ...config,
        ...moduleInstance,
     };
};

function getConfigurables()
{
    let config = [];

    config.push(
        {
            name: "dccIndex",
            default: 0,
            hidden: true,
        },
        {
            name: "input0Src",
            default: "SDL_DCC_CLK0_SRC_CLOCK0_0",
            hidden: true,
            getValue: (inst) => soc.getClkSrc(inst.dccIndex, 1, inst.clk0SrcOpts)
        },
        {
            name: "input1Src",
            default: "SDL_DCC_CLK1_SRC_CLOCKSRC3",
            hidden: true,
            getValue: (inst) => soc.getClkSrc(inst.dccIndex, 1, inst.clk1SrcOpts)
        },
        {
            name: "clk0SrcOpts",
            displayName: "Clk 0 Source",
            options: soc.getClk0Options,
            getDisabledOptions: soc.getClk0DisabledOptions,
            default: "XTALCLK",
            description: "DCC clock source for input0",
        },
        {
            name: "clk1SrcOpts",
            displayName: "Clk 1 Source",
            options: soc.getClk1Options,
            getDisabledOptions: soc.getClk1DisabledOptions,
            default: "RCCLK10M",
            description: "DCC clock source for input1",
        },
        {
            name: "clkSrc0Seed",
            displayName: "Clk0 Seed Value",
            default: 0,
            displayFormat: "dec",
            description: "Seed value for the Clk0 source.",
        },
        {
            name: "clkSrc1Seed",
            displayName: "Clk1 Seed Value",
            default: 0,
            displayFormat: "dec",
            description: "Seed value for the Clk1 source",
        },
        {
            name: "clkSrc0ValidSeed",
            displayName: "Clk0 Valid Seed Value",
            default: 4,
            displayFormat: "dec",
            description: "Seed value for the Valid window",
        },
    );
    return config;
}

let dcc_clk_srcs_module_name = "/sdl/dcc/v1/sdl_dcc_v1_clksrc";

let dcc_clk_srcs_module = {
    displayName: "DCC Clock Source Configuration",
    defaultInstanceName: "CONFIG_DCC_CLK_SRCS",
    config: getConfigurables(),
    getInstanceConfig,
};

/*
 *  ======== validate ========
 */
function validate(inst, report) {
    if (inst.clk0SrcOpts == "XTALCLK") {
        report.logError("Clk0 Src must be configured", inst);
    }
    if (inst.clk1SrcOpts == "RCCLK10M") {
        report.logError("Clk1 Src must be configured", inst);
    }
    if (inst.clkSrc0ValidSeed < 4) {
        report.logError("Clk0 Valid Seed Value must not be 4 or greater", inst);
    }
    if (inst.clkSrc0Seed == 0 || inst.clkSrc1Seed == 0)
    {
        report.logError("Clk0 Seed and Clk1 Seed must be greater than 0", inst);
    }
}

exports = dcc_clk_srcs_module;
