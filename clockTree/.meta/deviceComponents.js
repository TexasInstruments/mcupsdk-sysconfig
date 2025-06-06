const clockConnectivity = system.deviceData.clockTree.connectivity

const gateOutputDetails = clockConnectivity.filter(connection => connection.name.endsWith("_CLK"))
const gateOutput = gateOutputDetails.map(connection => connection.name)

exports = {
    getGateOutputs: gateOutput
}