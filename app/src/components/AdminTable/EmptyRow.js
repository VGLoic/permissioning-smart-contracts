// Libs
import React from "react";
// Styles
import styles from "./styles.module.scss";

const EmptyRow = () => (
    <tr>
        <td colSpan="2" className={styles.emptyLine}>
            No admin accounts have been added.
        </td>
    </tr>
);

export default EmptyRow;
