// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const RemoveAdminModal = ({
    closeModal,
    isOpen,
    handleRemove,
    numberToRemove
}) => (
    <Modal isOpen={isOpen}>
        <Card width={"700px"} p={0}>
            <Button.Text
                icononly
                icon={"Close"}
                mainColor={"moon-gray"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={closeModal}
                className={styles.closeIcon}
            />
            <Box p={4} mb={3}>
                <Heading.h3>Remove Admin Account</Heading.h3>
                <Text>
                    Are you sure you want to remove {numberToRemove} admin
                    account?
                </Text>
            </Box>
            <Flex
                px={4}
                py={3}
                borderTop={1}
                borderStyle={"solid"}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
            >
                <Button.Outline mainColor="black" onClick={closeModal}>
                    Cancel
                </Button.Outline>
                <Button
                    variant="danger"
                    ml={3}
                    // mainColor="#000e1a"
                    onClick={handleRemove}
                >
                    Remove
                </Button>
            </Flex>
        </Card>
    </Modal>
);

RemoveAdminModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleRemove: PropTypes.func.isRequired,
    numberToRemove: PropTypes.number.isRequired
};

export default RemoveAdminModal;
