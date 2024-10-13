exports = {
	config: [
	],
    templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_init: "/drivers/lin/templates/v0/lld/lin.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/lin/templates/v0/lld/lin.h.xdt",
        },
    }
};
