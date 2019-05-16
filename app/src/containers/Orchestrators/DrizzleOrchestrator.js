// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DrizzleContext } from "drizzle-react";
// Containers
import DataOrchestrator from "./DataOrchestrator";
// Constans
import Rules from "../../contracts/Rules.json";
import Admin from "../../contracts/Admin.json";
// Utils
import { getAllowedNetworks, contractsInitialized } from "../../util/contracts";
import { hasDrizzleKeys } from "../../util/state";

class DrizzleOrchestrator extends Component {
    state = {
        isCorrectNetwork: null,
        networkId: null,
        keys: [
            { contract: "Rules", method: "isReadOnly" },
            { contract: "Rules", method: "getSize" },
            { contract: "Admin", method: "getAdmins" }
        ]
    };

    componentDidUpdate(prevProps) {
        const { initialized, drizzleState } = this.props;
        const { keys } = this.state;
        if (prevProps.initialized !== initialized) {
            console.log("################### Update ###################");
            this.handleNetwork();
        }
        if (
            !contractsInitialized(prevProps.drizzleState, keys) &&
            contractsInitialized(drizzleState, keys)
        ) {
            this.setDrizzleKeys();
        }
    }

    handleNetwork = () => {
        const { drizzleState, drizzle } = this.props;
        const allowedNetworks = getAllowedNetworks([Rules, Admin]);
        const networkId = drizzleState.web3.networkId;
        const isCorrectNetwork = allowedNetworks.includes(networkId);

        if (isCorrectNetwork) {
            drizzle.addContract(Rules);
            drizzle.addContract(Admin);
        }

        this.setState({ isCorrectNetwork, networkId });
    };

    setDrizzleKeys = () => {
        const { contracts } = this.props.drizzle;
        const { keys } = this.state;
        const completedKeys = keys.map(({ contract, method }) => ({
            contract,
            method,
            drizzleKey: contracts[contract].methods[method].cacheCall()
        }));
        this.setState({ keys: completedKeys });
    };

    deriveValuesFromKeys = () => {
        const { keys } = this.state;
        const { drizzleState } = this.props;
        if (hasDrizzleKeys(keys)) {
            const {
                contracts,
                accounts: { 0: userAddress }
            } = drizzleState;
            const values = keys.map(({ contract, method, drizzleKey }) => {
                if (drizzleKey in contracts[contract][method]) {
                    return {
                        contract,
                        method,
                        value: contracts[contract][method][drizzleKey].value
                    };
                }
                return {
                    contract,
                    method
                };
            });
            return { values, userAddress };
        }
        return { values: keys, userAddress: "" };
    };

    render() {
        const { isCorrectNetwork, networkId } = this.state;
        const { values, userAddress } = this.deriveValuesFromKeys();
        return (
            <DataOrchestrator
                values={values}
                isCorrectNetwork={isCorrectNetwork}
                userAddress={userAddress}
                networkId={networkId}
            />
        );
    }
}

DrizzleOrchestrator.propTypes = {
    initialized: PropTypes.bool.isRequired,
    drizzle: PropTypes.object.isRequired,
    drizzleState: PropTypes.object
};

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => <DrizzleOrchestrator {...drizzleContext} />}
    </DrizzleContext.Consumer>
);
