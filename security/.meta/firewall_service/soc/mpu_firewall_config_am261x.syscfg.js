const mpu_firewall_config = [
    {
        name: "L2OCRAM_BANK0_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x70000000, size: 0x80000 },
        ]
    },
    {
        name: "L2OCRAM_BANK1_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x70080000, size: 0x80000 },
        ]
    },
    {
        name: "L2OCRAM_BANK2_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x70100000, size: 0x80000 },
        ]
    },
    {
        name: "R5SS0_CORE0_AXIS_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x78000000, size: 0x40000 },
            { startAddr: 0x78100000, size: 0x40000 },
            { startAddr: 0x74000000, size: 0x800000 },
            { startAddr: 0x74800000, size: 0x800000 },            
        ]
    },
    {
        name: "R5SS0_CORE1_AXIS_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x78200000, size: 0x20000 },
            { startAddr: 0x78300000, size: 0x20000 },
            { startAddr: 0x75000000, size: 0x800000 },
            { startAddr: 0x75800000, size: 0x800000 },
        ]
    },
    {
        name: "MBOX_RAM_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x72000000, size: 0x4000 },
        ]
    },
    {
        name: "OSPI0_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x60000000, size: 0x8000000 },
            { startAddr: 0x80000000, size: 0x8000000 },
            { startAddr: 0x88000000, size: 0x8000000 },
        ]
    },
    {
        name: "OSPI1_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0xA0000000, size: 0x8000000 },
        ]
    },
    {
        name: "OSPI0_CFG_SLV",
        regionCount: 4,
        memSpace : [
            { startAddr: 0x53800000, size: 0x10000 },
        ]
    },
    {
        name: "OSPI1_CFG_SLV",
        regionCount: 4,
        memSpace : [
            { startAddr: 0x53A00000, size: 0x3000 },
        ]
    },
    {
        name: "SCRM2SCRP0_SLV",
        regionCount: 16,
        memSpace : [
            { startAddr: 0x50000000, size: 0x10000000 },
        ]
    },
    {
        name: "SCRM2SCRP1_SLV",
        regionCount: 16,
        memSpace : [
            { startAddr: 0x50000000, size: 0x10000000 },
        ]
    },
    {
        name: "R5SS0_CORE0_AHB_MST",
        regionCount: 16,
        memSpace : [
            { startAddr: 0x50000000, size: 0x10000000 },
        ]
    },
    {
        name: "R5SS0_CORE1_AHB_MST",
        regionCount: 16,
        memSpace : [
            { startAddr: 0x50000000, size: 0x10000000 },
        ]
    },
    {
        name: "R5SS0_SLV",
        regionCount: 8,
        memSpace : [
            { startAddr: 0x50000000, size: 0x10000000 },
        ]
    },
];


const id_list = [
	{ name: "R5FSS0_0", displayName:"R5FSS0_0" },
	{ name: "R5FSS0_1", displayName:"R5FSS0_1" },
    { name: "ICSSM0", displayName:"ICSSM0" },
    { name: "ICSSM1", displayName:"ICSSM1" },
	{ name: "CPSW", displayName:"CPSW" },
    { name: "USB", displayName:"USB" },
    { name: "AIDX", displayName:"EXTERNAL ID" },
]

const default_id_list = ["R5FSS0_0", "R5FSS0_1"]

function getConfigArr() {
    return mpu_firewall_config;
}

function getAidList() {
    return id_list;
}

function getdefaultAidList() {
    return default_id_list;
}

exports = {
    getConfigArr,
    getAidList,
    getdefaultAidList,
};
