
let common = system.getScript("/common");

/**
 * IO Expander device configurations for different boards
 * 
 * Array elements contain:
 * - name: Device model name (e.g., "TCA6416ARTWR")
 * - type: Communication protocol ("I2C")
 * - instance: Hardware interface instance ("I2C2")
 * - pinSet: Array of 8 pin configurations, each containing:
 *     - portNumber: Port number (0-based)
 *     - pinNumber: Pin number within port (0-7) 
 *     - pinName: Human-readable pin function name
 * - i2cAddress: I2C slave address in hex (e.g., 0x20)
 * - board: Target board identifier ("LP-E2", "CC-E2")
 * - driverName: Associated driver module name
 * 
 * Each object represents one IO Expander configuration.
 * Multiple devices can share the same driver but must have unique 
 * I2C addresses per board type.
 * 
 * Display name translations:
 * 1. Device selection in UI: 
 *    board + " 0x" + i2cAddress (in hex)
 *    Example: "CC-E2 0x22" for board="CC-E2" and i2cAddress=0x22
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
    {
        name        : "TCA6416ARTWR",
        type        : "I2C",
        instance    : "I2C2",
        pinSet      : [
            {portNumber : 0, pinNumber : 0, pinName : "MCAN1_STB"},
            {portNumber : 0, pinNumber : 1, pinName : "CLK_BUF_EN"},
            {portNumber : 0, pinNumber : 2, pinName : "ICSSM1_MUX_SEL"},
            {portNumber : 0, pinNumber : 3, pinName : "ICSSM2_MUX_SEL"},
            {portNumber : 0, pinNumber : 4, pinName : "GPIO_RGMII1_RST"},
            {portNumber : 0, pinNumber : 5, pinName : "GPIO_ICSSM1_RST"},
            {portNumber : 0, pinNumber : 6, pinName : "GPIO_ICSSM2_RST"},
            {portNumber : 0, pinNumber : 7, pinName : "GPIO_uSD_PWR_EN"},

            {portNumber : 1, pinNumber : 0, pinName : "RGMII_MUX_SEL"},
            {portNumber : 1, pinNumber : 1, pinName : "I2C0_MUX_SEL"},
            {portNumber : 1, pinNumber : 2, pinName : "NA"},
            {portNumber : 1, pinNumber : 3, pinName : "VPP_LDO_EN"},
            {portNumber : 1, pinNumber : 4, pinName : "MDIO/MDC_MUX_SEL"},
            {portNumber : 1, pinNumber : 5, pinName : "LIN_MUX_SEL"},
            {portNumber : 1, pinNumber : 6, pinName : "ADC1_MUX_SEL"},
            {portNumber : 1, pinNumber : 7, pinName : "ADC2_MUX_SEL"},
        ],
        i2cAddress  : 0x20,
        board       : "CC-E2",
        driverName  : "ioexp_tca6416"
    },
];

function getConfigArr() {
    return ioexp_devices;
}

exports = {
    getConfigArr,
};