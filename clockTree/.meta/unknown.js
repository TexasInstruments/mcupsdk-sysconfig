const helperConfigurables = system.getScript("/clockTree/helperConfigurables.js");

exports = {
	displayName: "Unknown",
	longDescription: "Here is the long description",
	config: [{
		name: "type",
		displayName: "Type",
		default: "Unknown",
		readOnly: true,
		hidden: true,
	},
		...helperConfigurables.config
	],
	extendConfig: ({ $ipInstance }) => {


		const pinConfig = _.map($ipInstance.outPins, (pin) => ({
			name: pin.name,
			displayName: pin.displayName,
			description: pin.description,
			longDescription: pin.longDescription,
			default: [0, 0],
			getValue: () => {
				const ipDetails =_.find(system.deviceData.clockTree.ipInstances, (ip) => ip.name === $ipInstance.name)
				if( Array.isArray(ipDetails.Min) ) {
					return [0, 0]
				}
				const val = [ipDetails.Min, ipDetails.Max]
				return val
			},
			hidden: false,
		}));

		return pinConfig;
	},
};