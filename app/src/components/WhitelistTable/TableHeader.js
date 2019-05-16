// Libs
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// Rimble Components
import { Flex, Box, Heading, Button } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const TableHeader = ({
    number,
    openRemoveModal,
    disabledRemove,
    openAddModal,
    disabledAdd,
    openLockModal,
    disabledLock,
    pendingLock,
    isReadOnly
}) => (
    <Flex alignItems="center" justifyContent="space-between">
        <Box>
            <Heading.h2 fontWeight="700">
                Whitelested Nodes ({number})
            </Heading.h2>
        </Box>
        <Flex alignItems="center">
            <Button.Outline
                icon="Delete"
                border="1"
                onClick={openRemoveModal}
                mr={3}
                disabled={disabledRemove}
                className={classnames(
                    styles.removeBtn,
                    disabledRemove ? styles.disabled : styles.active
                )}
            >
                Remove
            </Button.Outline>
            <Button
                icon="AddCircleOutline"
                mainColor="#25D78F"
                mr={3}
                onClick={openAddModal}
                disabled={disabledAdd}
            >
                Add Whitelisted Node
            </Button>
            {!isReadOnly && !pendingLock && (
                <Button.Outline
                    icon="Lock"
                    mainColor="black"
                    onClick={openLockModal}
                    disabled={disabledLock}
                >
                    Lock Values
                </Button.Outline>
            )}
            {isReadOnly && !pendingLock && (
                <Button
                    variant="danger"
                    icon="LockOpen"
                    onClick={openLockModal}
                    disabled={disabledLock}
                >
                    Allow Changes
                </Button>
            )}
            {isReadOnly && pendingLock && (
                <Button variant="danger" disabled>
                    Unlocking changes...
                </Button>
            )}
            {!isReadOnly && pendingLock && (
                <Button variant="danger" disabled>
                    Locking values...
                </Button>
            )}
        </Flex>
    </Flex>
);

TableHeader.propTypes = {
    number: PropTypes.number.isRequired,
    openRemoveModal: PropTypes.func.isRequired,
    openAddModal: PropTypes.func.isRequired,
    openLockModal: PropTypes.func.isRequired,
    disabledAdd: PropTypes.bool.isRequired,
    disabledRemove: PropTypes.bool.isRequired,
    disabledLock: PropTypes.bool.isRequired,
    pendingLock: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired
};

export default TableHeader;
