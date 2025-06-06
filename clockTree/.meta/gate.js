const helperConfigurables = system.getScript("/clockTree/helperConfigurables.js");
const common = system.getScript("/common");
const soc = system.getScript(`/clockTree/soc/clocktree_${common.getSocName()}_${common.getDefaultR5Freq()}`);

exports = {
	displayName: "Gate",
	config: [{
		name: "type",
		displayName: "Type",
		default: "Gate",
		readOnly: true,
		hidden: true,
	},
		...helperConfigurables.config
	],
	extendConfig: ({ $ipInstance }) => {

		let defaultVal = true;

		if(soc.disabledPllGates.includes($ipInstance.name)){
				defaultVal = false;
		}


		const enable = {
			name: "enable",
			displayName: "Enable",
			default: defaultVal,
		};

		const pin = {
			name: $ipInstance.outPins[0].name,
			default: [0, 0],
			getValue: (inst) => {
				if (inst.enable !== false) {
					return inst[$ipInstance.inPins[0].name];
				}
				return 0;
			},
		};

		return [enable, pin];
	},

};
