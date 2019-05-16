// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DrizzleContext } from "drizzle-react";
// Context
import DataContext from "../../constants/context";
// Components
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import WrongNetworkFlash from "../../components/Flash/WrongNetworkFlash";
import NoProviderFlash from "../../components/Flash/NoProviderFlash";
import Layout from "../../components/Layout/Layout";
// Containers
import Dashboard from "../Dashboard/Dashboard";
// Utils
import { hasValues } from "../../util/state";
import { paramsToIdentifier } from "../../util/enodetools";

class DataOrchestrator extends Component {
    state = {
        whitelist: [],
        dataInitialized: false
    };

    componentDidUpdate(prevProps) {
        const { values } = this.props;
        const { dataInitialized } = this.state;
        if (!hasValues(prevProps.values) && hasValues(values)) {
            this.getWhitelist().finally(() =>
                this.setState({ dataInitialized: true })
            );
        }
        if (dataInitialized && prevProps.values[1].value !== values[1].value) {
            this.getWhitelist();
        }
    }

    getWhitelist = async () => {
        const { value: whitelistSize } = this.props.values[1];
        const { getByIndex } = this.props.drizzle.contracts.Rules.methods;
        const promises = [];
        for (let index = 0; index < whitelistSize; index++) {
            promises.push(getByIndex(index).call());
        }
        const responses = await Promise.all(promises);
        const whitelist = responses.map(
            ({ enodeHigh, enodeLow, ip, port }) => ({
                enodeHigh,
                enodeLow,
                ip,
                port,
                identifier: paramsToIdentifier({
                    enodeHigh,
                    enodeLow,
                    ip,
                    port
                })
            })
        );
        this.setState({ whitelist });
    };

    deriveContextValue = () => {
        const {
            values: [
                { value: isReadOnly },
                _, // eslint-disable-line
                { value: adminList }
            ],
            userAddress
        } = this.props;
        // console.log('Size: ', _.value)
        const { whitelist } = this.state;
        return {
            isReadOnly,
            whitelist,
            adminList,
            isAdmin: adminList.includes(userAddress),
            userAddress
        };
    };

    render() {
        const { dataInitialized } = this.state;
        const { isCorrectNetwork, networkId } = this.props;
        const child =
            networkId === undefined ? (
                <NoProviderFlash />
            ) : isCorrectNetwork === false ? (
                <WrongNetworkFlash networkId={networkId} />
            ) : dataInitialized ? (
                <DataContext.Provider value={this.deriveContextValue()}>
                    <Dashboard />
                </DataContext.Provider>
            ) : (
                <LoadingPage />
            );
        return <Layout>{child}</Layout>;
    }
}

DataOrchestrator.propTypes = {
    drizzle: PropTypes.object.isRequired,
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    userAddress: PropTypes.string,
    isCorrectNetwork: PropTypes.bool,
    networkId: PropTypes.number
};

export default props => (
    <DrizzleContext.Consumer>
        {({ drizzle }) => <DataOrchestrator drizzle={drizzle} {...props} />}
    </DrizzleContext.Consumer>
);
