exports = {
    config: [],
	templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/fsi_tx/templates/fsi_tx_v0_config.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/fsi_tx/templates/fsi_tx_v0.h.xdt",
        },
        "/drivers/system/power_clock_config.c.xdt": {
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/fsi_tx/templates/fsi_tx_v0_open_close_config.c.xdt",
            driver_open: "/drivers/fsi_tx/templates/fsi_tx_open.c.xdt",
            driver_close: "/drivers/fsi_tx/templates/fsi_tx_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/fsi_tx/templates/fsi_tx_v0_open_close.h.xdt",
        },
    },
};