// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Text, Form } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AddWhitelistModal = ({
    closeModal,
    isOpen,
    handleAddNode,
    input,
    modifyInput
}) => (
    <Modal isOpen={isOpen}>
        <Form onSubmit={handleAddNode}>
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
                    <Heading.h3>Add Whitelist Node</Heading.h3>
                    <Text>
                        Nodes can connect to each other if they are both
                        whitelisted. See formatting details here.
                    </Text>
                    <Form.Field
                        mt={3}
                        label="Enode URL"
                        className={
                            input.value
                                ? `${
                                      input.validated
                                          ? styles.validField
                                          : styles.invalidField
                                  }`
                                : null
                        }
                    >
                        <Form.Input
                            width={1}
                            type="text"
                            name="enodeInput"
                            placeholder="Ex: enode://6f8a80d1...f77166ad92a0@10.3.58.6:30303?discport=30301"
                            value={input.value}
                            onChange={modifyInput}
                            required
                        />
                    </Form.Field>
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
                        type="submit"
                        ml={3}
                        color="white"
                        bg="pegasys"
                        hovercolor="#25D78F"
                        border={1}
                        onClick={handleAddNode}
                        disabled={!input.validated}
                    >
                        Add Whitelisted Node
                    </Button>
                </Flex>
            </Card>
        </Form>
    </Modal>
);

AddWhitelistModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    input: PropTypes.object.isRequired,
    modifyInput: PropTypes.func.isRequired,
    handleAddNode: PropTypes.func.isRequired
};

export default AddWhitelistModal;
