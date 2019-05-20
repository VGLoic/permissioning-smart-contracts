// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flex, Box, Text } from "rimble-ui";
// Constants
import tabs from "../../constants/tabs";
// Styles
import styles from "./styles.module.scss";

const Choices = ({ tab, setTab }) => (
    <Flex height="33px" className={styles.choicesContainer}>
        {tabs.map(({ id, text }) => (
            <Box
                key={id}
                className={
                    tab === id
                        ? `${styles.selected} ${styles.choiceBox}`
                        : styles.choiceBox
                }
                width="200px"
                px={3}
                onClick={() => setTab(id)}
            >
                <Text fontWeight="600" textAlign="center">
                    {text}
                </Text>
            </Box>
        ))}
    </Flex>
);

Choices.propTypes = {
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired
};

export default Choices;
