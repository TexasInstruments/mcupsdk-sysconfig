const helperConfigurables = system.getScript("/clockTree/helperConfigurables.js");

exports = {
	displayName: "Pin Function",
	config: [{
		name: "type",
		displayName: "Type",
		default: "Pin Function",
		readOnly: true,
		hidden: true,
	}, {
		name: "disable",
		displayName: "Disabled",
		default: false,
	},
		...helperConfigurables.config
	],
	extendConfig: ({ $ipInstance }) => {
		let config = []
		if (!_.isEmpty($ipInstance.outPins)) {
			config = config.concat(
				{
					name: $ipInstance.outPins[0].name,
					displayName: "Frequency Range",
					default: [0, 0],
					getValue: () => {
						const ipDetails =_.find(system.deviceData.clockTree.ipInstances, (ip) => ip.name === $ipInstance.name)
						const val = [ipDetails.Min, ipDetails.Max]
						return val
					},
					
				}
			)
		} else {
			// Override the input pin so it's visible with a tool tip
			config = config.concat({
				name: $ipInstance.inPins[0].name,
				default: [0, 0],
				description: "Custom tool tip",
				hidden: false,
				getValue: () => { } // Tool will update
			})
		}

		return config
	},

};
