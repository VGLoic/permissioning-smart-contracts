// Libs
import React from "react";
// import PropTypes from "prop-types";
// Rimble Components
import { Flex, Heading } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const AppBar = () => (
    <Flex
        position="sticky"
        top="0"
        height="100px"
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        className={styles.appBar}
        pl={4}
        pr={5}
        width="100%"
    >
        <Heading.h3>Pantheon Node Permissioning</Heading.h3>
        {/*!isReadOnly && pending && (
            <Button
                bg="lock"
                color="white"
                border="1"
                hovercolor="#cc3300"
                disabled
                className={styles.btn}
            >
                Locking changes...
            </Button>
        )*/}
        {/*!isReadOnly && !pending && (
            <OutlineButton
                icon="Lock"
                border="1"
                onClick={openModal}
                disabled={disabled}
                className={`${styles.btn} ${styles.outlined}`}
            >
                Lock Values
            </OutlineButton>
        )*/}
        {/*isReadOnly && !pending && (
            <Button
                icon="Lock"
                bg="lock"
                color="white"
                border="1"
                hovercolor="#cc2200"
                onClick={openModal}
                disabled={disabled}
                className={styles.btn}
            >
                Changes Locked
            </Button>
        )*/}
        {/*isReadOnly && pending && (
            <OutlineButton
                border="1"
                disabled
                className={`${styles.btn} ${styles.outlined}`}
            >
                Unlocking changes...
            </OutlineButton>
        )*/}
    </Flex>
);

// AppBar.propTypes = {
//     isReadOnly: PropTypes.bool.isRequired,
//     openModal: PropTypes.func.isRequired,
//     disabled: PropTypes.bool.isRequired,
//     pending: PropTypes.bool.isRequired
// };

export default AppBar;
