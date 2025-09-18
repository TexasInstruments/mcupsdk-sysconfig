
let common = system.getScript("/common");

/**
 * IO Expander device configurations for different boards
 * 
 * Array elements contain:
 * - name: Device model name (e.g., "TCA6408ARGTR")
 * - type: Communication protocol ("I2C")
 * - instance: Hardware interface instance ("I2C0")
 * - pinSet: Array of 8 pin configurations, each containing:
 *     - portNumber: Port number (0-based)
 *     - pinNumber: Pin number within port (0-7) 
 *     - pinName: Human-readable pin function name
 * - i2cAddress: I2C slave address in hex (e.g., 0x20)
 * - board: Target board identifier ("LP-E1", "SOM-E1")
 * - driverName: Associated driver module name
 * 
 * Each object represents one IO Expander configuration.
 * Multiple devices can share the same driver but must have unique 
 * I2C addresses per board type.
 * 
 * Display name translations:
 * 1. Device selection in UI: 
 *    board + " 0x" + i2cAddress (in hex)
 *    Example: "LP-E1 0x20" for board="LP-E1" and i2cAddress=0x20
 * 
 * 2. Pin configuration in UI:
 *    - pinName with special characters replaced:
 *      "." becomes "_" 
 *      "/" becomes "_"
 *      "#" becomes ""
 *    Example: "USB2.0/MUX_SEL" becomes "USB2_0_MUX_SEL"
 *    - Used in both display names and generated macro definitions
 */
let ioexp_devices = [
    /*E1, E2 and RevA have same configuration */
    {
        name        : "TCA6408ARGTR",
        type        : "I2C",
        instance    : "I2C0",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "USB2.0_MUX_SEL0"},
            {portNumber : 0, pinNumber : 1, pinName : "VPP_LDO_EN"},
            {portNumber : 0, pinNumber : 2, pinName : "LED_DRIVER_EN"},
            {portNumber : 0, pinNumber : 3, pinName : "MCAN_MUX_SEL"},
            {portNumber : 0, pinNumber : 4, pinName : "BP_BO_MUX_EN"},
            {portNumber : 0, pinNumber : 5, pinName : "BP_MUX_SW_S1"},
            {portNumber : 0, pinNumber : 6, pinName : "BP_BO_MUX_EN_N"},
            {portNumber : 0, pinNumber : 7, pinName : "BP_MUX_SW_SO"},
        ],
        i2cAddress  : 0x20,
        board       : "LP-E2",
        driverName  : "ioexp_tca6408"
    },
    /*E1 and E2 have same configuration */
    {
        name        : "TCA6408ARGTR",
        type        : "I2C",
        instance    : "I2C0",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "CPSW/ICSS_BRD_CONN_DET1"},
            {portNumber : 0, pinNumber : 1, pinName : "ETH0_CPSW2_RST"},
            {portNumber : 0, pinNumber : 2, pinName : "ETH1_CPSW1_RST"},
            {portNumber : 0, pinNumber : 3, pinName : "MDIO/MDC_MUX_SEL1"},
            {portNumber : 0, pinNumber : 4, pinName : "MDIO/MDC_MUX_SEL2"},
            {portNumber : 0, pinNumber : 5, pinName : "CPSW/ICSS_BRD_CONN_DET2"},
            {portNumber : 0, pinNumber : 6, pinName : "FSI_EQEP_MUX_SEL"},
            {portNumber : 0, pinNumber : 7, pinName : "OSPI1_MUX_SEL"},
        ],
        i2cAddress  : 0x21,
        board       : "LP-E2",
        driverName  : "ioexp_tca6408"
    },
    /*RevA configuration */
    {
        name        : "TCA6408ARGT",
        type        : "I2C",
        instance    : "I2C0",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "USB2.0_MUX_SEL0"},
            {portNumber : 0, pinNumber : 1, pinName : "VPP_LDO_EN"},
            {portNumber : 0, pinNumber : 2, pinName : "LED_DRIVER_EN"},
            {portNumber : 0, pinNumber : 3, pinName : "MCAN_MUX_SEL"},
            {portNumber : 0, pinNumber : 4, pinName : "BP_BO_MUX_EN"},
            {portNumber : 0, pinNumber : 5, pinName : "BP_MUX_SW_S1"},
            {portNumber : 0, pinNumber : 6, pinName : "BP_BO_MUX_EN_N"},
            {portNumber : 0, pinNumber : 7, pinName : "BP_MUX_SW_SO"},
        ],
        i2cAddress  : 0x20,
        board       : "LP-RevA",
        driverName  : "ioexp_tca6408"
    },
    {
        name        : "TCA6408ARGT",
        type        : "I2C",
        instance    : "I2C0",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "BP_MUX_SW_S6"},
            {portNumber : 0, pinNumber : 1, pinName : "ETH0_CPSW2_RST"},
            {portNumber : 0, pinNumber : 2, pinName : "ETH1_CPSW1_RST"},
            {portNumber : 0, pinNumber : 3, pinName : "MDIO/MDC_MUX_SEL"},
            {portNumber : 0, pinNumber : 4, pinName : "BP_MUX_SW_S4"},
            {portNumber : 0, pinNumber : 5, pinName : "BP_MUX_SW_S5"},
            {portNumber : 0, pinNumber : 6, pinName : "FSI_EQEP_MUX_SEL"},
            {portNumber : 0, pinNumber : 7, pinName : "OSPI1_MUX_SEL"},
        ],
        i2cAddress  : 0x21,
        board       : "LP-RevA",
        driverName  : "ioexp_tca6408"
    },
    {
        name        : "TCA6408ARGT",
        type        : "I2C",
        instance    : "I2C0",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "PMIC_SPI1/FSIRX0_MUX_SEL"},
            {portNumber : 0, pinNumber : 1, pinName : "ADCO_AIN0/DAC_OUT_MUX_SEL"},
            {portNumber : 0, pinNumber : 2, pinName : "MII_RST#"},
            {portNumber : 0, pinNumber : 3, pinName : "RGMII1_RST"},
            {portNumber : 0, pinNumber : 4, pinName : "SPI0/FSITX0_MUX_SEL"},
            {portNumber : 0, pinNumber : 5, pinName : "SPI3_MUX_SEL"},
            {portNumber : 0, pinNumber : 6, pinName : "IOEXP_OUT_P6"},
            {portNumber : 0, pinNumber : 7, pinName : "IOEXP_OUT_P7"},
        ],
        i2cAddress  : 0x21,
        board       : "SOM-RevA",
        driverName  : "ioexp_tca6408"
    },
];

function getConfigArr() {
    return ioexp_devices;
}

exports = {
    getConfigArr,
};