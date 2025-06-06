
const helperConfigurables = system.getScript("/clockTree/helperConfigurables.js");

exports = {
	displayName: "Divider",
	config: [{
		name: "type",
		displayName: "Type",
		default: "Divider",
		readOnly: true,
		hidden: true,
	},
		...helperConfigurables.config
	],
	extendConfig: ({ $ipInstance }) => {

		const divideValue = {
			name: "divideValue",
			displayName: "Divide Value",
			default: $ipInstance.resetValue,
			options: _.map($ipInstance.divideValues, (v) => ({ name: v, displayName: `/ ${v}` })),
		};

		const outputPin = {
			name: $ipInstance.outPins[0].name,
			default: [0, 0],
			getValue: (inst) => {
				const divideAmount = _.size($ipInstance.divideValues) > 1 ? inst.divideValue : _.first($ipInstance.divideValues);
				const value = inst[$ipInstance.inPins[0].name];
				if (_.isArray(value)) {
					return _.map(value, (v) => v / divideAmount);
				}
				return value / divideAmount;
			},
		};

		return [divideValue, outputPin];
	},

};
