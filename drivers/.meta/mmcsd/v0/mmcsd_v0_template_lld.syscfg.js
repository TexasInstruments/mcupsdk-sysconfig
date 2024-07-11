exports = {
	config: [
	],
	templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/mmcsd/templates/lld/mmcsd_v0_config_lld.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/mmcsd/templates/lld/mmcsd_v0_lld.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/mmcsd/templates/lld/mmcsd_v0_open_close_config_lld.c.xdt",
            driver_open: "/drivers/mmcsd/templates/mmcsd_open.c.xdt",
            driver_close: "/drivers/mmcsd/templates/mmcsd_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/mmcsd/templates/lld/mmcsd_v0_open_close_lld.h.xdt",
        },
	}
};
