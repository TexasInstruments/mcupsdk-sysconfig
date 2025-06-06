const helperConfigurables = system.getScript("/clockTree/helperConfigurables.js");

exports = {
	displayName: "Mux",
	config: [{
		name: "type",
		displayName: "Type",
		default: "Mux",
		readOnly: true,
		hidden: true,
	},
		...helperConfigurables.config
	],
	extendConfig: ({ $ipInstance }) => {
		const pinConfig = [
			{
				name: $ipInstance.outPins[0].name,
				displayName: "Pins",
				default: [0, 0],
				getValue: (inst) => inst[inst.inputSelect],
			}
		];

		const config = [
			{
				name: "inputSelect",
				displayName: "Input Select",
				default: $ipInstance.resetValue,
				options: _.map($ipInstance.inPins, ({ name }) => ({ name })),
			},
		];

		return [...pinConfig, ...config]
	},
};
