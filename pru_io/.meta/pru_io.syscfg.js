let common = system.getScript("/common");
let soc = system.getScript(`/pru_io/soc/pru_io_${common.getSocName()}`);

function getTemplates()
{
    let templates = [];
    if(common.getSelfSysCfgCoreName().includes('pru'))
    {
        templates.push(
            {
                name: "/pru_io/common/pru_io_config.inc.xdt",
                outputPath: "ti_pru_io_config.inc",
                alwaysRun: true,
            },
        )
    }
    return templates;
}

exports = {
    displayName: "PRU-IO",
    templates: getTemplates(),
    topModules: soc.getTopModules(),
};
