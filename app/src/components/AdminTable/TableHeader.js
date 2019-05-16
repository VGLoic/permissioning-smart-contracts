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
    openAddModal,
    disabledRemove,
    disabledAdd
}) => (
    <Flex alignItems="center" justifyContent="space-between">
        <Box>
            <Heading.h2 fontWeight="700">Admin Accounts ({number})</Heading.h2>
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
                onClick={openAddModal}
                disabled={disabledAdd}
            >
                Add Admin Account
            </Button>
        </Flex>
    </Flex>
);

TableHeader.propTypes = {
    number: PropTypes.number.isRequired,
    openRemoveModal: PropTypes.func.isRequired,
    openAddModal: PropTypes.func.isRequired,
    disabledAdd: PropTypes.bool.isRequired,
    disabledRemove: PropTypes.bool.isRequired
};

export default TableHeader;
