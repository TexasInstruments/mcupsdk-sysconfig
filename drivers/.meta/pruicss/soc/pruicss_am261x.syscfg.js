
let common = system.getScript("/common");

let pru_icss_config = [
    {
        name            : "ICSSM0",
        mdioBaseAddr    : "(CSL_ICSSM0_INTERNAL_U_BASE + CSL_ICSS_M_PR1_MDIO_V1P7_MDIO_REGS_BASE)",
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_ICSSM0_CORE",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_ETH_HSDIV0_CLKOUT0",
                clkRate : 225000000
            },
            {
                moduleId: "SOC_RcmPeripheralId_ICSSM0_UART0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT2",
                clkRate : 160000000
            },
        ],
    },
    {
        name            : "ICSSM1",
        mdioBaseAddr    : "(CSL_ICSSM1_INTERNAL + CSL_ICSS_M_PR1_MDIO_V1P7_MDIO_REGS_BASE)",
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_ICSSM1_CORE",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_ETH_HSDIV0_CLKOUT0",
                clkRate : 225000000
            },
            {
                moduleId: "SOC_RcmPeripheralId_ICSSM1_UART0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT2",
                clkRate : 160000000
            }
        ],
    },
];

function getConfigArr() {

    return pru_icss_config;
}

exports = {
    getConfigArr,
};
