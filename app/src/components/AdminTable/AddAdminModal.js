// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Modal, Card, Button, Flex, Box, Heading, Text, Form } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AddAminModal = ({
    closeModal,
    isOpen,
    handleAddAmin,
    input,
    modifyAddress
}) => (
    <Modal isOpen={isOpen}>
        <Form onSubmit={handleAddAmin}>
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
                    <Heading.h3>Add Admin Account</Heading.h3>
                    <Text>Admin accounts can...</Text>
                    <Form.Field
                        mt={3}
                        label="Account Address"
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
                            name="addressInput"
                            placeholder="Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
                            value={input.value}
                            onChange={modifyAddress}
                            className={styles.fieldInput}
                            required
                        />
                    </Form.Field>
                    <Text color="red" height="30px" fontSize="14px">
                        {input.value &&
                            input.validated === false &&
                            "Account address is not correct"}
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
                        type="submit"
                        ml={3}
                        color="white"
                        bg="pegasys"
                        hovercolor="#25D78F"
                        border={1}
                        onClick={handleAddAmin}
                        disabled={!input.validated}
                    >
                        Add Admin Account
                    </Button>
                </Flex>
            </Card>
        </Form>
    </Modal>
);

AddAminModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    input: PropTypes.object.isRequired,
    modifyAddress: PropTypes.func.isRequired,
    handleAddAmin: PropTypes.func.isRequired
};

export default AddAminModal;
