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
        toasts: [],
        input: { value: "", validated: false },
        transactions: new Map(),
        timeouts: []
    };

    componentWillUnmount() {
        const { timeouts } = this.state;
        timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    }

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
                }
            }
        } = this.props;
        const { enodeHigh, enodeLow, ip, port } = enodeToParams(value);
        const identifier = paramsToIdentifier({
            enodeHigh,
            enodeLow,
            ip,
            port
        });
        const gasLimit = await addEnode(
            enodeHigh,
            enodeLow,
            ip,
            port
        ).estimateGas({ from: userAddress });
        addEnode(enodeHigh, enodeLow, ip, port)
            .send({
                gasLimit: gasLimit * 4,
                from: userAddress
            })
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
            .on("receipt", () => {
                this.openToast(
                    identifier,
                    "success",
                    `New whitelisted node processed: ${enodeHigh}${enodeLow}`
                );
            })
            .on("error", () => {
                this.setState(({ transactions, modals }) => ({
                    transactions: updateKeyInMap(
                        transactions,
                        identifier,
                        "failAddition"
                    ),
                    modals: {
                        ...modals,
                        add: false
                    }
                }));
                this.openToast(
                    identifier,
                    "fail",
                    "Could not add node to whitelist",
                    `${enodeHigh}${enodeLow} was unable to be added. Please try again`
                );
            });
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
                }
            }
        } = this.props;
        selectedRows.forEach(async (identifier, index) => {
            const { enodeHigh, enodeLow, ip, port } = identifierToParams(
                identifier
            );
            const gasLimit = await removeEnode(
                enodeHigh,
                enodeLow,
                ip,
                port
            ).estimateGas({ from: userAddress });
            console.log("Gas Limit: ", gasLimit);
            removeEnode(enodeHigh, enodeLow, ip, port)
                .send({
                    from: userAddress,
                    gasLimit: gasLimit * 4
                })
                .on("transactionHash", () => {
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
                    }));
                })
                .on("receipt", () => {
                    this.openToast(
                        identifier,
                        "success",
                        `Removal of whitelisted node processed: ${enodeHigh}${enodeLow}`
                    );
                })
                .on("error", err => {
                    console.log("Error: ", err);
                    this.setState(({ transactions, modals }) => ({
                        modalRemoveOpen: false,
                        transactions: updateKeyInMap(
                            transactions,
                            identifier,
                            "failRemoval"
                        ),
                        modals: {
                            ...modals,
                            remove: false
                        }
                    }));
                    this.openToast(
                        identifier,
                        "fail",
                        "Could not remove node to whitelist",
                        `${enodeHigh}${enodeLow} was unable to be removed. Please try again`
                    );
                });
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
                }
            }
        } = this.props;
        const method = isReadOnly ? exitReadOnly : enterReadOnly;
        const gasLimit = await method().estimateGas({ from: userAddress });
        method()
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () => {
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
                }));
                this.openToast(
                    "lock",
                    "pending",
                    isReadOnly
                        ? "Please wait while we unlock the values."
                        : "Please wait while we lock the whitelisted nodes. Once completed no changes can be made until you unlock the values."
                );
            })
            .on("receipt", () => {
                this.setState(({ transactions }) => ({
                    transactions: deleteKeyInMap(transactions, "lock")
                }));
                this.updateToast(
                    "lock",
                    "success",
                    "Changes have been locked!"
                );
            })
            .on("error", () => {
                this.setState(({ transactions }) => ({
                    transactions: deleteKeyInMap(transactions, "lock")
                }));
                this.updateToast(
                    "lock",
                    "fail",
                    isReadOnly
                        ? "Could not unlock values."
                        : "Could not lock changes.",
                    "The transaction was unabled to be processed. Please try again."
                );
            });
    };

    deleteTransaction = key => {
        const updatedTransactions = new Map([...this.state.transactions]);
        updatedTransactions.delete(key);
        this.setState({ transactions: updatedTransactions });
    };

    openToast = (id, status, message, secondaryMessage) => {
        const timeoutId = setTimeout(this.closeToast(id), 15000);
        this.setState(({ toasts, timeouts }) => {
            const updatedToasts = [...toasts];
            updatedToasts.push({ status, message, secondaryMessage, id });
            return {
                toasts: updatedToasts,
                timeouts: [...timeouts, timeoutId]
            };
        });
    };

    updateToast = (targetedId, status, message, secondaryMessage) => {
        this.setState(({ toasts }) => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ id }) => id === targetedId
            );
            updatedToasts[index] = {
                status,
                message,
                secondaryMessage,
                id: targetedId
            };
            return { toasts: updatedToasts };
        });
    };

    closeToast = targetedId => () =>
        this.setState(({ toasts }) => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ id }) => id === targetedId
            );
            updatedToasts.splice(index, 1);
            return { toasts: updatedToasts };
        });

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
                closeToast={this.closeToast}
                deleteTransaction={this.deleteTransaction}
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
