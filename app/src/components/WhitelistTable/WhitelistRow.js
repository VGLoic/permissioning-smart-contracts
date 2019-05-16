// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Checkbox, Flex, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const WhitelistRow = ({
    enodeHigh,
    enodeLow,
    ip,
    port,
    identifier,
    status,
    selected,
    toggleRow,
    isAdmin,
    isReadOnly,
    pendingLock,
    deleteTransaction
}) => (
    <tr>
        <td colSpan="2">
            <Flex alignItems="center">
                <Checkbox
                    color="#25D78F"
                    checked={selected}
                    onChange={() => toggleRow(identifier)}
                    disabled={
                        isReadOnly ||
                        pendingLock ||
                        !isAdmin ||
                        status === "pendingRemoval" ||
                        status === "pendingAddition" ||
                        status === "failAddition" ||
                        status === "failRemoval"
                    }
                />
                {status === "pendingRemoval" ? (
                    <Text.s
                        className={styles.ellipsis}
                        fontSize="14px"
                    >{`${enodeHigh}${enodeLow}`}</Text.s>
                ) : (
                    <Text
                        className={styles.ellipsis}
                        fontSize="14px"
                    >{`${enodeHigh}${enodeLow}`}</Text>
                )}
            </Flex>
        </td>
        <td>
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s className={styles.ellipsis} fontSize="14px">
                        {ip}
                    </Text.s>
                ) : (
                    <Text className={styles.ellipsis} fontSize="14px">
                        {ip}
                    </Text>
                )}
            </Flex>
        </td>
        <td>
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s className={styles.ellipsis} fontSize="14px">
                        {port}
                    </Text.s>
                ) : (
                    <Text className={styles.ellipsis} fontSize="14px">
                        {port}
                    </Text>
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
                        onClick={() => deleteTransaction(identifier)}
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
                        onClick={() => deleteTransaction(identifier)}
                    >
                        Clear
                    </Pill>
                </Fragment>
            )}
        </td>
    </tr>
);

WhitelistRow.propTypes = {
    enodeHigh: PropTypes.string.isRequired,
    enodeLow: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    toggleRow: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired
};

export default WhitelistRow;
