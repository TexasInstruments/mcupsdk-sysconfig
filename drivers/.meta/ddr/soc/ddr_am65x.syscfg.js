
const staticConfig =
{
    clockIds: [ "TISCI_DEV_DUMMY_IP_LPSC_EMIF_DATA_VD", "TISCI_DEV_DDRSS0" ],
};

let defaultDdrConfigFile = "drivers/ddr/v1/soc/am65x/board_ddr_config.h"

function getDefaultDdrConfigFileName() {
    return defaultDdrConfigFile;
}

function getStaticConfig()
{
    return staticConfig;
}

exports = {
    getDefaultDdrConfigFileName,
    getStaticConfig,
};
