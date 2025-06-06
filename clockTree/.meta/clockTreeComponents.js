const deviceComponents = system.getScript("/clockTree/deviceComponents.js");

const typeMap = {
	Divider: "/clockTree/divider.js",
	Mux: "/clockTree/mux.js",
	PinFunction: "/clockTree/pinFunction.js",
	unknown: "/clockTree/unknown.js",
	peripheral: "/clockTree/unknown.js",
	xbar: "/clockTree/unknown.js",
	Oscillator: "/clockTree/unknown.js",
	Gate: "/clockTree/gate.js",
};

function eachItemView(ipInstance) {
	return {
		displayName: ipInstance.displayName ?? ipInstance.name,
		ipInstances: [ipInstance.name],
		algorithm: "fanInAndOut",
		frequencyLabels: deviceComponents.getGateOutputs
	}
}

function subGroupingView() {

	const specialNames = [
		"R5F",
		"M4",
		"A53",
		"I2C"
	]

	const groupedPeripherals = _.chain(system.deviceData.clockTree?.ipInstances)
		.filter((ipInstance) => ipInstance.type === "peripheral" && !ipInstance.name.startsWith("HSM"))
			.groupBy(item => {
					let prefixMatch = item.name;
                    const isFound = specialNames.find(ele => prefixMatch.startsWith(ele))
					/*
						Grouping based on the peripherals having common prefix till the first numeric value OR the first underscore.
						Eg: UART0_CLKGATE, UART1_CLKGATE,UART2_CLKGATE will be grouped together.
						Eg: R5FSS_CLK_GATE: If we follow that grouping logic, only "R" will be extracted as a numeric value '5' follows it. We don't want that.
							Include such items in the specialNames array.
					*/
                    if (!isFound)
                        prefixMatch = item.name.match(/^[^_\d]*/);
                    else return isFound;    
                    return prefixMatch ? prefixMatch[0] : item.name;
				}).value()

	const result = Object.entries(groupedPeripherals).map(([displayName, entries]) => ({
		displayName,
		entries : _.chain(entries).map(eachItemView).value(),
		// expanded: false
	}));

	return result;
}

const peripherals = [{
		displayName: "Peripherals",
		entries: [
		],
		categories: _.chain(system.deviceData.clockTree?.ipInstances)
			.filter((ipInstance) => ipInstance.name.endsWith("GATE"))
			.thru(subGroupingView)
			.value(),
	},
]

/*
	The clocktree view has primarily 4 groups: Clocks (clock sources), PLLs, XBars and Peripherals.
	The peripherals are further grouped based on their type i.e. 
	All uart instances will come under UART, EPWM instances under EPWM etc
*/
const tree = [{
	displayName: "Clocks",
	entries: _.chain(system.deviceData.clockTree?.ipInstances)
		.filter((ipInstance) => ipInstance.type === "PinFunction" && _.isEmpty(ipInstance.inPins))
		.map(eachItemView)
		.value(),
	expanded: false
}, {
	displayName: "PLLs",
	entries: _.chain(system.deviceData.clockTree?.ipInstances)
		.filter((ipInstance) => _.startsWith(ipInstance.name, "PLL") && !_.includes(ipInstance.name, "GATE"))
		.map(eachItemView)
		.value(),
	expanded: false
}, 
{
	displayName: "XBARs",
	entries: _.chain(system.deviceData.clockTree?.ipInstances)
		.filter((ipInstance) => ipInstance.type === "xbar")
		.map(eachItemView)
		.value(),
	expanded: false
}, 
...peripherals
];

const views = [
	{
		"name": "/clockTree/summaryView.xdt",
		"displayName": "Clock Tree Summary",
		"viewType": "markdown",
		"ignoreErrors": true,
		"icon": "state-machine",
	},
];



exports = {
	clockTree: {
		typeMap,
		tree,
	},
	views,
};
