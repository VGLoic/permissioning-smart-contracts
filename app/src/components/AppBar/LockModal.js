// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import {
    Modal,
    Card,
    TextButton,
    OutlineButton,
    Button,
    Flex,
    Box,
    Heading,
    Text
} from "rimble-ui";

const LockModal = ({ isReadOnly, handleLock, closeModal, isOpen }) => (
    <Modal isOpen={isOpen}>
        <Card width={"420px"} p={0}>
            <TextButton
                icononly
                icon={"Close"}
                color={"moon-gray"}
                position={"absolute"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={closeModal}
            />
            <Box p={4} mb={3}>
                <Heading.h3>
                    {isReadOnly && "Lock Values?"}
                    {!isReadOnly && "Unlock and allow changes?"}
                </Heading.h3>
                <Text>
                    {isReadOnly && "Are you sure you want to allow changes?"}
                    {!isReadOnly &&
                        "Are you sure you want to prevent any changes?"}
                </Text>
            </Box>
            <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
            >
                <OutlineButton
                    color="black"
                    border="1"
                    borderColor="black"
                    onClick={closeModal}
                >
                    Cancel
                </OutlineButton>
                <Button
                    ml={3}
                    color="white"
                    bg="pegasys"
                    hovercolor="#25D78F"
                    border={1}
                    onClick={handleLock}
                >
                    {isReadOnly && "Yes, Unlock"}
                    {!isReadOnly && "Yes, Lock"}
                </Button>
            </Flex>
        </Card>
    </Modal>
);

LockModal.propTypes = {
    isReadOnly: PropTypes.bool.isRequired,
    handleLock: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default LockModal;
