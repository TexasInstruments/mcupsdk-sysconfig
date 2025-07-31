exports = {
	config: [
	],
	templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/mmcsd/templates/mmcsd_config.c.xdt",
            driver_init: "/drivers/mmcsd/templates/mmcsd_init.c.xdt",
            driver_deinit: "/drivers/mmcsd/templates/mmcsd_deinit.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/mmcsd/templates/mmcsd_v0.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/mmcsd/templates/mmcsd_open_close_config_v0.c.xdt",
            driver_open: "/drivers/mmcsd/templates/mmcsd_open.c.xdt",
            driver_close: "/drivers/mmcsd/templates/mmcsd_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/mmcsd/templates/mmcsd_open_close.h.xdt",
        },
	}
};
