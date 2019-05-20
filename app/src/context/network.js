// Libs
import React, {
    useContext,
    useEffect,
    useState,
    createContext,
    useMemo
} from "react";
import { Drizzle, generateStore } from "drizzle";
import { drizzleReactHooks } from "drizzle-react";
// Constants
import drizzleOptions from "../drizzleOptions";
import Rules from "../contracts/Rules.json";
import Admin from "../contracts/Admin.json";
// Utils
import { getAllowedNetworks } from "../util/contracts";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const NetworkContext = createContext();

export const NetworkProvider = props => {
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(null);

    const value = useMemo(
        () => ({
            isCorrectNetwork,
            setIsCorrectNetwork
        }),
        [isCorrectNetwork, setIsCorrectNetwork]
    );

    return (
        <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
            <NetworkContext.Provider value={value} {...props} />
        </drizzleReactHooks.DrizzleProvider>
    );
};

export const useNetwork = () => {
    const { isCorrectNetwork, setIsCorrectNetwork } = useContext(
        NetworkContext
    );

    const {
        networkId,
        contractsInitialized,
        status
    } = drizzleReactHooks.useDrizzleState(drizzleState => ({
        status: drizzleState.web3.status,
        networkId: drizzleState.web3.networkId,
        contractsInitialized:
            drizzleState.contracts.Rules.initialized &&
            drizzleState.contracts.Admin.initialized
    }));

    useEffect(() => {
        const allowedNetworks = getAllowedNetworks([Rules, Admin]);
        if (networkId) {
            const isCorrectNetwork = allowedNetworks.includes(networkId);
            setIsCorrectNetwork(isCorrectNetwork);
        }
    }, [networkId, setIsCorrectNetwork]);

    return {
        isCorrectNetwork,
        networkId,
        web3Initialized: status === "initialized" && isCorrectNetwork !== null,
        contractsInitialized
    };
};
