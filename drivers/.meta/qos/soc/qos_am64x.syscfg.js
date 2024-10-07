let defaultQoSConfigFile = "drivers/qos/v0/soc/am64x/qos_data.h"

function getDefaultQoSConfigFileName() {
    return defaultQoSConfigFile;
}

exports = {
    getDefaultQoSConfigFileName,
};