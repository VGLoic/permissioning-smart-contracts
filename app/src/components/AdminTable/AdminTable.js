// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flex, Box, Table } from "rimble-ui";
// Components
import TableHeader from "./TableHeader";
import EmptyRow from "./EmptyRow";
import AdminRow from "./AdminRow";
import AddAdminModal from "./AddAdminModal";
import RemoveAdminModal from "./RemoveAdminModal";
import PendingToast from "../Toasts/PendingToast";
import ErrorToast from "../Toasts/ErrorToast";
import SuccessToast from "../Toasts/SuccessToast";
// Styles
import styles from "./styles.module.scss";

const AdminTable = ({
    adminList,
    toasts,
    toggleRow,
    selectedRows,
    userAddress,
    modalAddOpen,
    modalRemoveOpen,
    openModal,
    closeModal,
    input,
    modifyAddress,
    handleAddAmin,
    handleRemove,
    isAdmin,
    closeToast,
    deleteTransaction
}) => (
    <Fragment>
        <Flex
            position="absolute"
            bottom="50px"
            right="50px"
            flexDirection="column"
        >
            {toasts.map(({ status, id, ...messages }, index) => (
                <Fragment key={index}>
                    {status === "pending" && (
                        <PendingToast
                            {...messages}
                            closeToast={closeToast(id)}
                        />
                    )}
                    {status === "fail" && (
                        <ErrorToast {...messages} closeToast={closeToast(id)} />
                    )}
                    {status === "success" && (
                        <SuccessToast
                            position="absolute"
                            bottom="0"
                            {...messages}
                            closeToast={closeToast(id)}
                        />
                    )}
                </Fragment>
            ))}
        </Flex>
        <Box mt={5}>
            <TableHeader
                number={adminList.length}
                openRemoveModal={openModal("Remove")}
                openAddModal={openModal("Add")}
                disabledAdd={!isAdmin}
                disabledRemove={selectedRows.length === 0 || !isAdmin}
            />
            <Table mt={4}>
                <thead>
                    <tr>
                        <th className={styles.headerCell}>Account Address</th>
                        <th className={styles.headerCell}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {adminList.map(({ address, status }) => (
                        <AdminRow
                            key={address}
                            address={address}
                            status={status}
                            selected={selectedRows.includes(address)}
                            toggleRow={toggleRow}
                            isSelf={userAddress === address}
                            isAdmin={isAdmin}
                            deleteTransaction={deleteTransaction}
                        />
                    ))}
                    {adminList.length === 0 && <EmptyRow />}
                </tbody>
            </Table>
        </Box>
        <AddAdminModal
            isOpen={modalAddOpen && isAdmin}
            closeModal={closeModal("Add")}
            input={input}
            modifyAddress={modifyAddress}
            handleAddAmin={handleAddAmin}
        />
        <RemoveAdminModal
            isOpen={modalRemoveOpen && isAdmin}
            closeModal={closeModal("Remove")}
            handleRemove={handleRemove}
            numberToRemove={selectedRows.length}
        />
    </Fragment>
);

AdminTable.propTypes = {
    adminList: PropTypes.arrayOf(PropTypes.object).isRequired,
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleRow: PropTypes.func.isRequired,
    selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
    userAddress: PropTypes.string.isRequired,
    modalAddOpen: PropTypes.bool.isRequired,
    modalRemoveOpen: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    modifyAddress: PropTypes.func.isRequired,
    handleAddAmin: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    closeToast: PropTypes.func.isRequired,
    deleteTransaction: PropTypes.func.isRequired
};

export default AdminTable;
