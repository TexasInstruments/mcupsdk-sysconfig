
let common = system.getScript("/common");

const topModules_main = [
    "/pru_io/adc/adc",
    "/pru_io/pru_ipc/pru_ipc",
];

const topModules_mcu = [

];

const topModules_a53 = [

];

const topModules_pru = [
    "/pru_io/adc/adc",
    "/pru_io/pru_ipc/pru_ipc",
];

const topModules_rtu_tx_pru =[
    "/pru_io/pru_ipc/pru_ipc"
]

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if(common.getSelfSysCfgCoreName().includes("m4f")) {
            topModules = topModules_mcu;
        }
        if (common.getSelfSysCfgCoreName().match(/a53*/))
        {
            topModules = topModules_a53;
        }
        if((common.getSelfSysCfgCoreName().includes("pru"))){ 
            if((!common.getSelfSysCfgCoreName().includes("tx")) && (!common.getSelfSysCfgCoreName().includes("rtu"))){
                topModules = topModules_pru; 
            }
            else
            {
                topModules = topModules_rtu_tx_pru; 
            }
        }
        
        return topModules;
    },
};
