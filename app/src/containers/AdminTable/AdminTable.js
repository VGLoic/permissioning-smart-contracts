// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DrizzleContext } from "drizzle-react";
// Context
import DataContext from "../../constants/context";
// Utils
import {
    deleteAddress,
    areMapEqual,
    areArrayEqual,
    updateKeyInMap
} from "../../util/array";
// Component
import AdminTable from "../../components/AdminTable/AdminTable";

class AdminTableContainer extends Component {
    state = {
        adminList: this.props.adminList
            .map(address => ({ address, status: "active" }))
            .reverse(),
        selectedRows: [],
        modalAddOpen: false,
        modalRemoveOpen: false,
        input: { value: "", validated: false },
        transactions: new Map(),
        toasts: [],
        timeouts: []
    };

    componentWillUnmount() {
        const { timeouts } = this.state;
        timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    }

    componentDidUpdate(prevProps, prevState) {
        const { adminList: prevAdminList } = prevProps;
        const { adminList } = this.props;
        const { transactions: prevTransactions } = prevState;
        const { transactions } = this.state;
        const adminListHaveChanged = !areArrayEqual(prevAdminList, adminList);
        const transactionsHaveChanged = !areMapEqual(
            prevTransactions,
            transactions
        );

        if (adminListHaveChanged || transactionsHaveChanged) {
            this.updateLocalAdminList();
        }
    }

    updateLocalAdminList = () => {
        const { adminList } = this.props;
        const { transactions } = this.state;

        const updatedTransactions = new Map([...transactions]);

        // Delete old pending removals
        transactions.forEach((status, address) => {
            if (status === "pendingRemoval" && !adminList.includes(address)) {
                updatedTransactions.delete(address);
            }
        });

        // Derive Admin List and delete old pending additions
        const derivedAdminList = adminList
            .map(address => {
                if (transactions.has(address)) {
                    const status = transactions.get(address);
                    if (status === "pendingAddition") {
                        updatedTransactions.delete(address);
                    }
                    return { address, status };
                }
                return { address, status: "active" };
            })
            .reverse();

        // Gather the pending and failed additions from updatedTransactions
        const additions = [];
        updatedTransactions.forEach((status, address) => {
            if (status === "pendingAddition" || status === "failAddition") {
                additions.push({ address, status });
            }
        });

        const updatedAdminList = [...additions, ...derivedAdminList];

        this.setState({
            transactions: updatedTransactions,
            adminList: updatedAdminList
        });
    };

    deleteTransaction = key => {
        const updatedTransactions = new Map([...this.state.transactions]);
        updatedTransactions.delete(key);
        this.setState({ transactions: updatedTransactions });
    };

    toggleRow = address => {
        const { selectedRows } = this.state;
        const index = selectedRows.findIndex(
            selectedAddress => selectedAddress === address
        );
        if (index === -1) {
            this.setState({
                selectedRows: [...selectedRows, address]
            });
        } else {
            const updatedSelectedRows = [...selectedRows];
            updatedSelectedRows.splice(index, 1);
            this.setState({ selectedRows: updatedSelectedRows });
        }
    };

    openModal = modal => () => this.setState({ [`modal${modal}Open`]: true });

    closeModal = modal => () => this.setState({ [`modal${modal}Open`]: false });

    modifyAddress = ({ target: { value } }) => {
        const validated = this.props.drizzle.web3.utils.isAddress(value);
        this.setState({ input: { value, validated: validated } });
    };

    handleAddAmin = async e => {
        e.preventDefault();
        const {
            input: { value }
        } = this.state;
        const {
            userAddress,
            drizzle: {
                contracts: {
                    Admin: {
                        methods: { addAdmin }
                    }
                }
            }
        } = this.props;
        const gasLimit = await addAdmin(value).estimateGas({
            from: userAddress
        });
        addAdmin(value)
            .send({ from: userAddress, gasLimit: gasLimit * 4 })
            .on("transactionHash", () =>
                this.setState(({ transactions }) => ({
                    modalAddOpen: false,
                    input: { value: "", validated: false },
                    transactions: updateKeyInMap(
                        transactions,
                        value,
                        "pendingAddition"
                    )
                }))
            )
            .on("receipt", () => {
                this.openToast(
                    value,
                    "success",
                    `New admin account processed: ${value}`
                );
            })
            .on("error", () => {
                this.setState(({ transactions }) => ({
                    modalAddOpen: false,
                    input: { value: "", validated: false },
                    transactions: updateKeyInMap(
                        transactions,
                        value,
                        "failAddition"
                    )
                }));
                this.openToast(
                    value,
                    "fail",
                    "Could not add account as admin",
                    `${value} was unable to be added. Please try again.`
                );
            });
    };

    handleRemove = async () => {
        const { selectedRows } = this.state;
        const {
            userAddress,
            drizzle: {
                contracts: {
                    Admin: {
                        methods: { removeAdmin }
                    }
                }
            }
        } = this.props;
        selectedRows.forEach(async (address, index) => {
            const gasLimit = await removeAdmin(address).estimateGas({
                from: userAddress
            });
            removeAdmin(address)
                .send({
                    gasLimit: gasLimit * 4,
                    from: userAddress
                })
                .on("transactionHash", () =>
                    this.setState(({ transactions, selectedRows }) => ({
                        modalRemoveOpen: false,
                        selectedRows: deleteAddress(address, selectedRows),
                        transactions: updateKeyInMap(
                            transactions,
                            address,
                            "pendingRemoval"
                        )
                    }))
                )
                .on("receipt", () => {
                    this.openToast(
                        address,
                        "success",
                        `Removal of admin account processed: ${address}`
                    );
                })
                .on("error", err => {
                    this.setState(({ transactions }) => ({
                        modalRemoveOpen: false,
                        transactions: updateKeyInMap(
                            transactions,
                            address,
                            "failRemoval"
                        )
                    }));
                    this.openToast(
                        address,
                        "fail",
                        "Could not remove admin account",
                        `${address} was unable to be removed. Please try again.`
                    );
                });
        });
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
        const {
            selectedRows,
            modalAddOpen,
            modalRemoveOpen,
            input,
            adminList,
            toasts
        } = this.state;
        const { userAddress, isAdmin } = this.props;
        return (
            <AdminTable
                adminList={adminList}
                toasts={toasts}
                selectedRows={selectedRows}
                toggleRow={this.toggleRow}
                userAddress={userAddress}
                modalAddOpen={modalAddOpen}
                modalRemoveOpen={modalRemoveOpen}
                openModal={this.openModal}
                closeModal={this.closeModal}
                input={input}
                modifyAddress={this.modifyAddress}
                handleAddAmin={this.handleAddAmin}
                handleRemove={this.handleRemove}
                isAdmin={isAdmin}
                closeToast={this.closeToast}
                deleteTransaction={this.deleteTransaction}
            />
        );
    }
}

AdminTableContainer.propTypes = {
    adminList: PropTypes.arrayOf(PropTypes.string).isRequired,
    userAddress: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    drizzle: PropTypes.object.isRequired
};

export default props => (
    <DrizzleContext.Consumer>
        {({ drizzle }) => (
            <DataContext.Consumer>
                {({ adminList, userAddress, isAdmin }) => (
                    <AdminTableContainer
                        adminList={adminList}
                        userAddress={userAddress}
                        isAdmin={isAdmin}
                        drizzle={drizzle}
                    />
                )}
            </DataContext.Consumer>
        )}
    </DrizzleContext.Consumer>
);
