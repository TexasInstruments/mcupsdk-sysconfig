
let common = system.getScript("/common");

const topModules_main = [
];
const topModules_pru = [
];

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if((common.getSelfSysCfgCoreName().includes("pru"))) {
            topModules = topModules_pru; 
        }
        
        return topModules;
    },
};