
let common = system.getScript("/common");

let pru_icss_config = [
    {
        name            : "ICSSM0",
        mdioBaseAddr    : "(CSL_ICSSM0_INTERNAL_U_BASE + CSL_ICSS_M_PR1_MDIO_V1P7_MDIO_REGS_BASE)",
        clockFrequencies: [
            {
                moduleId: "SOC_RcmPeripheralId_ICSSM0_UART0",
                clkId   : "SOC_RcmPeripheralClockSource_DPLL_PER_HSDIV0_CLKOUT1",
                clkRate : 192000000
            },
        ],
    },
];

function getConfigArr() {

    return pru_icss_config;
}

exports = {
    getConfigArr,
};
