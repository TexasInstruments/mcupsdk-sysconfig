
let common = system.getScript("/common");

const topModules_main = [
];
const topModulesNull = [
];

exports = {
    getTopModules: function() {

        let topModules = topModules_main;

        if((common.getSelfSysCfgCoreName().includes("pru"))) {
            topModules = topModulesNull; 
        }
        
        return topModules;
    },
};