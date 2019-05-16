// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Checkbox, Flex, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AdminRow = ({ address, status, selected, toggleRow, isSelf }) => (
    <tr>
        <td>
            <Flex alignItems="center">
                <Checkbox
                    color="#25D78F"
                    checked={selected}
                    onChange={() => toggleRow(address)}
                    disabled={isSelf || status === "pendingRemoval"}
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
        </td>
    </tr>
);

AdminRow.propTypes = {
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    toggleRow: PropTypes.func.isRequired,
    isSelf: PropTypes.bool.isRequired
};

export default AdminRow;
