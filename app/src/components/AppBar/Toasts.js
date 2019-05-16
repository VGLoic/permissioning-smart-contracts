// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Rimble Components
import { ToastMessage } from "rimble-ui";

const Toasts = ({ pending, status, isReadOnly, closeToast }) => (
    <Fragment>
        {pending && (
            <ToastMessage.Processing
                // my={3}
                position="absolute"
                bottom="50px"
                right="50px"
                message={
                    isReadOnly
                        ? "Please wait while we unlock all the current values"
                        : "Please wait while we lock all the current values"
                }
            />
        )}
        {status === "success" && (
            <ToastMessage.Success
                position="absolute"
                bottom="50px"
                right="50px"
                message={
                    isReadOnly
                        ? "Changes have been locked!"
                        : "Changes have been unlocked!"
                }
                closeElem
                closeFunction={closeToast}
            />
        )}
        {status === "error" && (
            <ToastMessage.Failure
                position="absolute"
                bottom="50px"
                right="50px"
                message={
                    isReadOnly
                        ? "Could not unlock changes."
                        : "Could not lock changes."
                }
                secondaryMessage={
                    "The transaction was unabled to be processed. Please try again."
                }
                closeElem
                closeFunction={closeToast}
            />
        )}
    </Fragment>
);

Toasts.propTypes = {
    pending: PropTypes.bool.isRequired,
    status: PropTypes.string,
    isReadOnly: PropTypes.bool.isRequired,
    closeToast: PropTypes.func.isRequired
};

export default Toasts;
