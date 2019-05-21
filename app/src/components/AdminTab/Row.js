// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Pill, Flex, Box, Text, Button } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AdminRow = ({
    address,
    status,
    isSelf,
    isAdmin,
    deleteTransaction,
    openRemoveModal
}) => (
    <tr className={styles.row}>
        <td>
            <Flex alignItems="center">
                {status === "pendingRemoval" ? (
                    <Text.s opacity="0.5" fontSize="14px">{address}</Text.s>
                ) : (
                    <Text fontSize="14px">{address}</Text>
                )}
            </Flex>
        </td>
        <td>
          <Flex justifyContent="space-between" alignItems="center">
            {status === 'active'
              ? (
                <Pill color="#018002" className={styles.pill}>
                    Active
                </Pill>
              ) : status === 'pendingAddition'
              ? (
                <Pill color="#FFA505" className={styles.pill}>
                    Pending Addition
                </Pill>
              ) : status === 'pendingRemoval'
              ? (
                <Pill color="#FFA505" className={styles.pill}>
                    Pending Removal
                </Pill>
              ) : status === 'failAddition'
              ? (
                <Box>
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
                </Box>
              ) : status === 'failRemoval'
              ? (
                <Box>
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
                </Box>
              ) : <div />
            }
            {!isSelf && isAdmin && (
              <Button.Text
                mainColor="#CCC"
                disabled={status !== 'active'}
                icon="Delete"
                icononly
                className={styles.removeIcon}
                onClick={() => openRemoveModal(address)}
              />
            )}
          </Flex>
        </td>
    </tr>
);

AdminRow.propTypes = {
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    openRemoveModal: PropTypes.func.isRequired,
};

export default AdminRow;
