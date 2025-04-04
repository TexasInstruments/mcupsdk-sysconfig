let common = system.getScript("/common");

const topModules_main = [
    "/kernel/dpl/clock",
    "/kernel/dpl/debug_log",
    "/kernel/dpl/mpu_armv7",
    "/kernel/dpl/timer",
    "/kernel/dpl/profile",
    "/kernel/dpl/dpl_cfg",
];

const topModules_mcu = [
    "/kernel/dpl/clock",
    "/kernel/dpl/debug_log",
    "/kernel/dpl/mpu_armv7",
    "/kernel/dpl/timer",
    "/kernel/dpl/dpl_cfg",
];

const topModules_c66 = [
    "/kernel/dpl/cache_c6x",
    "/kernel/dpl/clock",
    "/kernel/dpl/debug_log",
    "/kernel/dpl/timer",
];

const topModules_m4 = [
    "/kernel/dpl/clock",
    "/kernel/dpl/debug_log",
    "/kernel/dpl/mpu_armv7",
    "/kernel/dpl/dpl_cfg",
];

/* Max xcache sizes in KB */
const cache_config_c66 = {
    max_l1psize : 32,
    max_l1dsize : 32,
    max_l2size  : 256,
};

function getConfigArr() {
    let cpu = common.getSelfSysCfgCoreName();

    if(cpu.match(/c66*/)) {
        return cache_config_c66;
    }
    return undefined;
}

exports = {
    getTopModules: function() {
        let cpu = common.getSelfSysCfgCoreName();
        if(cpu.match(/r5f*/)) {
            return topModules_main;
        }

        if(cpu.includes("hsm")) {
            return topModules_mcu;
        }

        if(cpu.match(/c66*/)) {
            return topModules_c66;
        }

        if (cpu.includes("m4fss0-1")) {
            return topModules_m4;
        }

        return undefined;
    },
    getConfigArr,
};
