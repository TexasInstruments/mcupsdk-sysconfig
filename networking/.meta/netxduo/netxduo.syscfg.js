let common = system.getScript("/common");
let netxduo_module_name = "/networking/netxduo/netxduo";
let enet_icss_module = system.modules["/networking/enet_icss/enet_icss"];


function getIfCount(instance) {
    return (instance.netxduoIfInstance.length);
}

function getIfConfig(instance, instNum) {
    let instances;
    let netxduo_interface_module = system.modules["/networking/netxduo/netxduo_interface"];

    instances = instance.netxduoIfInstance;

    let cfgArray = new Array();

    for(let k = 0; k < instances.length; k++) {
        let total_if_count = netxduo_interface_module.getTotalIfCount();
        let config = netxduo_interface_module.getInstanceConfig(instances[k]);
        cfgArray.push(config);
    }
    return cfgArray[instNum];
}

function moduleInstances(instance) {

    let Instances = new Array();
    let maxIf  = 2;

    Instances.push({
        name: "netxduoIfInstance",
        displayName: "NetxDuo Interface Instance",
        moduleName: "/networking/netxduo/netxduo_interface",
        useArray: true,
        minInstanceCount: 0,
        maxInstanceCount: maxIf,
        defaultInstanceCount: 0,
        collapsed:false,
    });

    return (Instances);
}


let netxduo_module = {

    displayName: "NetxDuo",
    defaultInstanceName: "CONFIG_NETXDUO",
    longDescription: `This adds and configures a NetxDuo Instance.`,
    alwaysShowLongDescription: false,
     templates: {
        "/networking/common/enet_netxduo.h.xdt": {
            enet_netxduo: "/networking/netxduo/templates/enet_netxduo.h.xdt"
        },
        "/networking/common/enet_netxduo.c.xdt": {
            enet_netxduo: "/networking/netxduo/templates/enet_netxduo.c.xdt"
        },
        "/board/board/board_config.h.xdt": {
            config: "/networking/netxduo/templates/netxduo.h.xdt",
        },
        "/board/board/board_open_close.c.xdt": {
            open_close_config: "/networking/netxduo/templates/netxduo_open_close_config.c.xdt",
            open: "/networking/netxduo/templates/netxduo_open.c.xdt",
            close: "/networking/netxduo/templates/netxduo_close.c.xdt",
        },
        "/board/board/board_open_close.h.xdt": {
            open_close_config: "/networking/netxduo/templates/netxduo_open_close.h.xdt",
        },
    },
    getIfCount,
    getIfConfig,
    moduleInstances: moduleInstances,
};


exports = netxduo_module;
