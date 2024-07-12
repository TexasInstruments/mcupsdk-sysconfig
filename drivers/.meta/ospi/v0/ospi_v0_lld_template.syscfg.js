let common = system.getScript("/common");
let socTemplate = common.getSocName();

exports = {
	config: [
	],
	templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/ospi/templates/lld/ospi_config_lld.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/ospi/templates/lld/ospi_lld.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/ospi/templates/lld/ospi_open_close_config_lld.c.xdt",
            driver_open: "/drivers/ospi/templates/lld/ospi_open_lld.c.xdt",
            driver_close: "/drivers/ospi/templates/lld/ospi_close_lld.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/ospi/templates/lld/ospi_open_close_lld.h.xdt",
        },
	}
};
