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
        transactions: new Map()
    };

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

    handleAddAmin = e => {
        e.preventDefault();
        const {
            input: { value }
        } = this.state;
        const { userAddress } = this.props;
        const { addAdmin } = this.props.drizzle.contracts.Admin.methods;
        addAdmin(value)
            .send({ from: userAddress })
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
            .on("error", () =>
                this.setState(({ transactions }) => ({
                    modalAddOpen: false,
                    input: { value: "", validated: false },
                    transactions: updateKeyInMap(
                        transactions,
                        value,
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
                    Admin: {
                        methods: { removeAdmin }
                    }
                },
                web3: { eth }
            }
        } = this.props;
        const nonce = await eth.getTransactionCount(userAddress);
        selectedRows.forEach((address, index) =>
            removeAdmin(address)
                .send({
                    nonce: Number(nonce) + Number(index),
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
                .on("error", err =>
                    this.setState(({ transactions }) => ({
                        modalRemoveOpen: false,
                        transactions: updateKeyInMap(
                            transactions,
                            address,
                            "failRemoval"
                        )
                    }))
                )
        );
    };

    render() {
        const {
            selectedRows,
            modalAddOpen,
            modalRemoveOpen,
            input,
            adminList
        } = this.state;
        const { userAddress, isAdmin } = this.props;
        return (
            <AdminTable
                adminList={adminList}
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
