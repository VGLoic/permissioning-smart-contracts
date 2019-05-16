// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Checkbox, Flex, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AdminRow = ({
    address,
    status,
    selected,
    toggleRow,
    isSelf,
    isAdmin,
    deleteTransaction
}) => (
    <tr>
        <td>
            <Flex alignItems="center">
                <Checkbox
                    color="#25D78F"
                    checked={selected}
                    onChange={() => toggleRow(address)}
                    disabled={
                        isSelf ||
                        !isAdmin ||
                        status === "pendingRemoval" ||
                        status === "pendingAddition" ||
                        status === "failAddition" ||
                        status === "failRemoval"
                    }
                />
                {status === "pendingRemoval" ? (
                    <Text.s fontSize="14px">{address}</Text.s>
                ) : (
                    <Text fontSize="14px">{address}</Text>
                )}
            </Flex>
        </td>
        <td>
            {status === "active" && (
                <Pill color="#018002" className={styles.pill}>
                    Active
                </Pill>
            )}
            {status === "pendingAddition" && (
                <Pill color="#FFA505" className={styles.pill}>
                    Pending Addition
                </Pill>
            )}
            {status === "pendingRemoval" && (
                <Pill color="#FFA505" className={styles.pill}>
                    Pending Removal
                </Pill>
            )}
            {status === "failAddition" && (
                <Fragment>
                    <Pill color="#FF1C1E" className={styles.pill}>
                        Addition Failed
                    </Pill>
                    <Pill
                        color="green"
                        ml={2}
                        className={styles.pill}
                        onClick={() => deleteTransaction(address)}
                    >
                        Clear
                    </Pill>
                </Fragment>
            )}
            {status === "failRemoval" && (
                <Fragment>
                    <Pill color="#FF1C1E" className={styles.pill}>
                        Removal Failed
                    </Pill>
                    <Pill
                        color="green"
                        ml={2}
                        className={styles.pill}
                        onClick={() => deleteTransaction(address)}
                    >
                        Clear
                    </Pill>
                </Fragment>
            )}
        </td>
    </tr>
);

AdminRow.propTypes = {
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    toggleRow: PropTypes.func.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired
};

export default AdminRow;
