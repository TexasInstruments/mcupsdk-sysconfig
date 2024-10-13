exports = {
	config: [
	],
    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/lin/templates/v0/hld/lin_v0_config.c.xdt",
            driver_init: "/drivers/lin/templates/v0/hld/lin_v0_init.c.xdt",
            driver_deinit: "/drivers/lin/templates/v0/hld/lin_v0_deinit.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/lin/templates/v0/hld/lin_v0.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/lin/templates/v0/hld/lin_v0_open_close_config.c.xdt",
            driver_open: "/drivers/lin/templates/v0/hld/lin_v0_open.c.xdt",
            driver_close: "/drivers/lin/templates/v0/hld/lin_v0_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/lin/templates/v0/hld/lin_v0_open_close.h.xdt",
        },
    }
};
