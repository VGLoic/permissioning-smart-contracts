// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flex, Box, Text } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const Choices = ({ goToTab, adminTab }) => (
    <Flex height="33px" className={styles.choicesContainer}>
        <Box
            className={
                adminTab
                    ? `${styles.selected} ${styles.choiceBox}`
                    : styles.choiceBox
            }
            width="200px"
            px={3}
            onClick={goToTab(true)}
        >
            <Text fontWeight="600" textAlign="center">
                Admin Accounts
            </Text>
        </Box>
        <Box
            className={
                !adminTab
                    ? `${styles.selected} ${styles.choiceBox}`
                    : styles.choiceBox
            }
            width="200px"
            justifyContent="center"
            px={3}
            onClick={goToTab(false)}
        >
            <Text fontWeight="600" textAlign="center">
                Whitelisted Nodes
            </Text>
        </Box>
    </Flex>
);

Choices.propTypes = {
    goToTab: PropTypes.func.isRequired,
    adminTab: PropTypes.bool.isRequired
};

export default Choices;
