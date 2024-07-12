exports = {
	config: [
	],
	templates: {
        "/drivers/system/system_config.c.xdt": {
            driver_config: "/drivers/ospi/templates/ospi_config_am263px.c.xdt",
            driver_init: "/drivers/ospi/templates/ospi_init.c.xdt",
            driver_deinit: "/drivers/ospi/templates/ospi_deinit.c.xdt",
        },
        "/drivers/system/system_config.h.xdt": {
            driver_config: "/drivers/ospi/templates/ospi.h.xdt",
        },
        "/drivers/system/drivers_open_close.c.xdt": {
            driver_open_close_config: "/drivers/ospi/templates/ospi_open_close_config.c.xdt",
            driver_open: "/drivers/ospi/templates/ospi_open.c.xdt",
            driver_close: "/drivers/ospi/templates/ospi_close.c.xdt",
        },
        "/drivers/system/drivers_open_close.h.xdt": {
            driver_open_close_config: "/drivers/ospi/templates/ospi_open_close.h.xdt",
        },
	}
};


