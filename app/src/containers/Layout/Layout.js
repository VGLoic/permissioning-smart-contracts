// Libs
import React from "react";
import PropTypes from "prop-types";
// Hooks
import { useNetwork } from "../../context/network";
// Components
import Layout from "../../components/Layout/Layout";

const LayoutContainer = props => {
    const {
        networkId,
        isCorrectNetwork,
        web3Initialized,
        contractsInitialized
    } = useNetwork();
    const noDetectedProvider = networkId === undefined;
    return (
        <Layout
            noDetectedProvider={noDetectedProvider}
            isCorrectNetwork={isCorrectNetwork}
            web3Initialized={web3Initialized}
            contractsInitialized={contractsInitialized}
            {...props}
        />
    );
};

LayoutContainer.propTypes = {
    children: PropTypes.object.isRequired
};

export default LayoutContainer;
