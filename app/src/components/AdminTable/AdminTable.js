// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Box, Table } from "rimble-ui";
// Components
import TableHeader from "./TableHeader";
import EmptyRow from "./EmptyRow";
import AdminRow from "./AdminRow";
import AddAdminModal from "./AddAdminModal";
import RemoveAdminModal from "./RemoveAdminModal";
// Styles
import styles from "./styles.module.scss";

const AdminTable = ({
    adminList,
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
    isAdmin
}) => (
    <Fragment>
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
    isAdmin: PropTypes.bool.isRequired
};

export default AdminTable;
