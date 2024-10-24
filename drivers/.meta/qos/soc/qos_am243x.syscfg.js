let defaultQoSConfigFile = "drivers/qos/v0/soc/am243x/qos_data.h"

function getDefaultQoSConfigFileName() {
    return defaultQoSConfigFile;
}

exports = {
    getDefaultQoSConfigFileName,
};