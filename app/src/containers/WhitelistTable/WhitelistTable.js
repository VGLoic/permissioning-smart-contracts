// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DrizzleContext } from "drizzle-react";
// Context
import DataContext from "../../constants/context";
// Utils
import {
    areMapEqual,
    areArrayEqual,
    updateKeyInMap,
    deleteKeyInMap,
    arrayInclude,
    deleteAddress
} from "../../util/array";
import {
    enodeToParams,
    identifierToParams,
    paramsToIdentifier,
    isValidEnode
} from "../../util/enodetools";
// Component
import WhitelistTable from "../../components/WhitelistTable/WhitelistTable";

class WhitelistTableContainer extends Component {
    state = {
        whitelist: this.props.whitelist
            .map(enode => ({ ...enode, status: "active" }))
            .reverse(),
        selectedRows: [],
        modals: {
            add: false,
            remove: false,
            lock: false
        },
        toasts: {
            add: "",
            remove: "",
            lock: ""
        },
        input: { value: "", validated: false },
        transactions: new Map()
    };

    componentDidUpdate(prevProps, prevState) {
        const { whitelist: prevWhitelist } = prevProps;
        const { whitelist } = this.props;
        const { transactions: prevTransactions } = prevState;
        const { transactions } = this.state;
        const whitelistHaveChanged = !areArrayEqual(prevWhitelist, whitelist, [
            "identifier"
        ]);
        const transactionsHaveChanged = !areMapEqual(
            prevTransactions,
            transactions
        );

        if (whitelistHaveChanged || transactionsHaveChanged) {
            this.updateLocalWhitelist();
        }
    }

    updateLocalWhitelist = () => {
        const { whitelist } = this.props;
        const { transactions } = this.state;

        const updatedTransactions = new Map([...transactions]);

        // Delete old pending removals
        transactions.forEach((status, key) => {
            if (
                status === "pendingRemoval" &&
                !arrayInclude(whitelist, { identifier: key })
            ) {
                updatedTransactions.delete(key);
            }
        });

        // Derive Admin List and delete old pending additions
        const derivedAdminList = whitelist
            .map(enode => {
                if (transactions.has(enode.identifier)) {
                    const status = transactions.get(enode.identifier);
                    if (status === "pendingAddition") {
                        updatedTransactions.delete(enode.identifier);
                    }
                    return { ...enode, status };
                }
                return { ...enode, status: "active" };
            })
            .reverse();

        // Gather the pending and failed additions from updatedTransactions
        const additions = [];
        updatedTransactions.forEach((status, key) => {
            if (status === "pendingAddition" || status === "failAddition") {
                additions.push({ ...identifierToParams(key), status });
            }
        });

        const updatedWhitelist = [...additions, ...derivedAdminList];

        this.setState({
            transactions: updatedTransactions,
            whitelist: updatedWhitelist
        });
    };

    toggleRow = nodeId => {
        const { selectedRows } = this.state;
        const index = selectedRows.findIndex(
            selectedNodeId => selectedNodeId === nodeId
        );
        if (index === -1) {
            this.setState({
                selectedRows: [...selectedRows, nodeId]
            });
        } else {
            const updatedSelectedRows = [...selectedRows];
            updatedSelectedRows.splice(index, 1);
            this.setState({ selectedRows: updatedSelectedRows });
        }
    };

    toggleModal = modal => () =>
        this.setState(({ modals }) => ({
            modals: {
                ...modals,
                [modal]: !modals[modal]
            }
        }));

    modifyInput = ({ target: { value } }) => {
        const validated = isValidEnode(value);
        this.setState({ input: { value, validated: validated } });
    };

    handleAddNode = async e => {
        e.preventDefault();
        const {
            input: { value }
        } = this.state;
        const {
            userAddress,
            drizzle: {
                contracts: {
                    Rules: {
                        methods: { addEnode }
                    }
                },
                web3: { eth }
            }
        } = this.props;
        const { enodeHigh, enodeLow, ip, port } = enodeToParams(value);
        const identifier = paramsToIdentifier({
            enodeHigh,
            enodeLow,
            ip,
            port
        });
        const nonce = await eth.getTransactionCount(userAddress, "pending");
        addEnode(enodeHigh, enodeLow, ip, port)
            .send({ nonce, from: userAddress })
            .on("transactionHash", () =>
                this.setState(({ modals, transactions }) => ({
                    modals: {
                        ...modals,
                        add: false
                    },
                    input: { value: "", validated: false },
                    transactions: updateKeyInMap(
                        transactions,
                        identifier,
                        "pendingAddition"
                    )
                }))
            )
            .on("error", () =>
                this.setState(({ transactions }) => ({
                    transactions: updateKeyInMap(
                        transactions,
                        identifier,
                        "failAddition"
                    )
                }))
            );
    };

    handleRemove = async () => {
        const { selectedRows } = this.state;
        const {
            userAddress,
            drizzle: {
                contracts: {
                    Rules: {
                        methods: { removeEnode }
                    }
                },
                web3: { eth }
            }
        } = this.props;
        const nonce = await eth.getTransactionCount(userAddress, "pending");
        selectedRows.forEach((identifier, index) => {
            const { enodeHigh, enodeLow, ip, port } = identifierToParams(
                identifier
            );
            removeEnode(enodeHigh, enodeLow, ip, port)
                .send({
                    nonce: Number(nonce) + Number(index),
                    from: userAddress
                })
                .on("transactionHash", () =>
                    this.setState(({ transactions, selectedRows, modals }) => ({
                        modals: {
                            ...modals,
                            remove: false
                        },
                        selectedRows: deleteAddress(identifier, selectedRows),
                        transactions: updateKeyInMap(
                            transactions,
                            identifier,
                            "pendingRemoval"
                        )
                    }))
                )
                .on("error", err =>
                    this.setState(({ transactions }) => ({
                        modalRemoveOpen: false,
                        transactions: updateKeyInMap(
                            transactions,
                            identifier,
                            "failRemoval"
                        )
                    }))
                );
        });
    };

    handleLock = async () => {
        const {
            userAddress,
            isReadOnly,
            drizzle: {
                contracts: {
                    Rules: {
                        methods: { enterReadOnly, exitReadOnly }
                    }
                },
                web3
            }
        } = this.props;
        const method = isReadOnly ? exitReadOnly : enterReadOnly;
        const nonce = await web3.eth.getTransactionCount(
            userAddress,
            "pending"
        );
        method()
            .send({ nonce, from: userAddress })
            .on("transactionHash", () =>
                this.setState(({ transactions, modals }) => ({
                    modals: {
                        ...modals,
                        lock: false
                    },
                    transactions: updateKeyInMap(
                        transactions,
                        "lock",
                        "pendingLock"
                    )
                }))
            )
            .on("receipt", () => {
                this.setState(({ transactions }) => ({
                    transactions: deleteKeyInMap(transactions, "lock")
                }));
                this.openToast("Lock", "success");
            })
            .on("error", () => {
                this.setState(({ transactions }) => ({
                    transactions: deleteKeyInMap(transactions, "lock")
                }));
                this.openToast("Lock", "fail");
            });
    };

    openToast = (topic, status) => {
        this.setState(({ toasts }) => ({
            toasts: {
                ...toasts,
                [topic]: status
            }
        }));
        setTimeout(this.closeToast(topic), 4000);
    };

    closeToast = topic =>
        this.setState(({ toasts }) => ({
            toasts: {
                ...toasts,
                [topic]: ""
            }
        }));

    render() {
        const { isAdmin, isReadOnly } = this.props;
        const { transactions, ...transmittedState } = this.state;
        return (
            <WhitelistTable
                {...transmittedState}
                pendingLock={!!transactions.get("lock")}
                isAdmin={isAdmin}
                isReadOnly={isReadOnly}
                toggleRow={this.toggleRow}
                modifyInput={this.modifyInput}
                toggleModal={this.toggleModal}
                handleAddNode={this.handleAddNode}
                handleRemove={this.handleRemove}
                handleLock={this.handleLock}
            />
        );
    }
}

WhitelistTableContainer.propTypes = {
    whitelist: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    drizzle: PropTypes.object.isRequired,
    userAddress: PropTypes.string.isRequired
};

export default props => (
    <DrizzleContext.Consumer>
        {({ drizzle }) => (
            <DataContext.Consumer>
                {({ whitelist, isAdmin, isReadOnly, userAddress }) => (
                    <WhitelistTableContainer
                        whitelist={whitelist}
                        isAdmin={isAdmin}
                        isReadOnly={isReadOnly}
                        drizzle={drizzle}
                        userAddress={userAddress}
                    />
                )}
            </DataContext.Consumer>
        )}
    </DrizzleContext.Consumer>
);
