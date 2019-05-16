export const getAllowedNetworks = contractArray => {
    const numberOfContracts = contractArray.length;

    const occurences = {};

    contractArray.forEach(({ networks }) => {
        Object.keys(networks).forEach(networkId => {
            if (networkId in occurences) {
                occurences[networkId]++;
            } else {
                occurences[networkId] = 1;
            }
        });
    });

    const allowedNetworks = [];

    Object.entries(occurences).forEach(([networkId, occurence]) => {
        if (occurence === numberOfContracts) {
            allowedNetworks.push(Number(networkId));
        }
    });

    return allowedNetworks;
};

export const contractsInitialized = (drizzleState, keys) => {
    if (!drizzleState || !drizzleState.contracts) {
        return false;
    }

    const contracts = drizzleState.contracts;

    const contractNames = [...new Set(keys.map(({ contract }) => contract))];

    let initialized = true;
    let index = 0;

    while (initialized && index < contractNames.length) {
        const contractName = contractNames[index];
        initialized =
            contractName in contracts && contracts[contractName].initialized;
        index++;
    }

    return initialized;
};
