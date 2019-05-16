// Libs
import React from "react";
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
    isAdmin
}) => (
    <tr>
        <td colSpan="2">
            <Flex alignItems="center">
                <Checkbox
                    color="#25D78F"
                    checked={selected}
                    onChange={() => toggleRow(identifier)}
                    disabled={
                        !isAdmin ||
                        status === "pendingRemoval" ||
                        status === "pendingAddition"
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
    isAdmin: PropTypes.bool.isRequired
};

export default WhitelistRow;
