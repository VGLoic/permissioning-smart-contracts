// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flex, Box, Table } from "rimble-ui";
// Components
import TableHeader from "./TableHeader";
import LockModal from "./LockModal";
import AddWhitelistModal from "./AddWhitelistModal";
import RemoveModal from "./RemoveModal";
import EmptyRow from "./EmptyRow";
import WhitelistRow from "./WhitelistRow";
import PendingToast from "../Toasts/PendingToast";
import ErrorToast from "../Toasts/ErrorToast";
import SuccessToast from "../Toasts/SuccessToast";
// Styles
import styles from "./styles.module.scss";

const WhitelistTable = ({
    whitelist,
    selectedRows,
    modals,
    toasts,
    input,
    pendingLock,
    isAdmin,
    isReadOnly,
    toggleRow,
    modifyInput,
    toggleModal,
    handleAddNode,
    handleRemove,
    handleLock,
    closeToast
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
                number={whitelist.length}
                openRemoveModal={toggleModal("remove")}
                disabledRemove={
                    selectedRows.length === 0 || !isAdmin || isReadOnly
                }
                openAddModal={toggleModal("add")}
                disabledAdd={!isAdmin || isReadOnly}
                openLockModal={toggleModal("lock")}
                disabledLock={!isAdmin}
                pendingLock={pendingLock}
                isReadOnly={isReadOnly}
            />
            <Table mt={4}>
                <thead>
                    <tr>
                        <th colSpan="2" className={styles.headerCell}>
                            Node ID
                        </th>
                        <th className={styles.headerCell}>IP Address</th>
                        <th className={styles.headerCell}>Port</th>
                        <th className={styles.headerCell}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {whitelist.map(enode => (
                        <WhitelistRow
                            key={enode.identifier}
                            toggleRow={toggleRow}
                            selected={selectedRows.includes(enode.identifier)}
                            isAdmin={isAdmin}
                            isReadOnly={isReadOnly}
                            pendingLock={pendingLock}
                            {...enode}
                        />
                    ))}
                    {whitelist.length === 0 && <EmptyRow />}
                </tbody>
            </Table>
        </Box>
        <LockModal
            isOpen={modals.lock && isAdmin}
            closeModal={toggleModal("lock")}
            handleLock={handleLock}
            isReadOnly={isReadOnly}
        />
        <AddWhitelistModal
            isOpen={modals.add && isAdmin && !isReadOnly}
            closeModal={toggleModal("add")}
            handleAddNode={handleAddNode}
            input={input}
            modifyInput={modifyInput}
        />
        <RemoveModal
            isOpen={modals.remove && isAdmin && !isReadOnly}
            closeModal={toggleModal("remove")}
            handleRemove={handleRemove}
            numberToRemove={selectedRows.length}
        />
    </Fragment>
);

WhitelistTable.propTypes = {
    whitelist: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
    modals: PropTypes.object.isRequired,
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    input: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    toggleRow: PropTypes.func.isRequired,
    modifyInput: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    handleAddNode: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleLock: PropTypes.func.isRequired,
    closeToast: PropTypes.func.isRequired
};

export default WhitelistTable;
