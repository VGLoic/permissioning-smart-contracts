// Libs
import React, { Component, Fragment } from "react";
import { DrizzleContext } from "drizzle-react";
import PropTypes from "prop-types";
// Context
import DataContext from "../../constants/context";
// Component
import AppBar from "../../components/AppBar/AppBar";
import LockModal from "../../components/AppBar/LockModal";
import Toasts from "../../components/AppBar/Toasts";

class AppBarContainer extends Component {
    state = {
        pending: false,
        isOpen: false,
        status: null
    };

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false });

    removeToast = () => {
        setTimeout(this.closeToast, 4000);
    };

    closeToast = () => this.setState({ status: null });

    handleLock = () => {
        const {
            isReadOnly,
            drizzle: {
                contracts: {
                    Rules: {
                        methods: { enterReadOnly, exitReadOnly }
                    }
                }
            }
        } = this.props;
        const method = isReadOnly ? exitReadOnly : enterReadOnly;
        method()
            .send()
            .on("transactionHash", () => {
                this.setState({ pending: true, isOpen: false });
            })
            .on("receipt", () => {
                this.setState({ pending: false, status: "success" });
                this.removeToast();
            })
            .on("error", () => {
                this.setState({ pending: false, status: "error" });
                this.removeToast();
            });
    };

    render() {
        const { isOpen, pending, status } = this.state;
        const { isReadOnly, isAdmin } = this.props;
        return (
            <Fragment>
                <AppBar
                    openModal={this.openModal}
                    isReadOnly={isReadOnly}
                    pending={pending}
                    disabled={!isAdmin}
                />
                <LockModal
                    handleLock={this.handleLock}
                    isReadOnly={isReadOnly}
                    closeModal={this.closeModal}
                    isOpen={isOpen}
                />
                <Toasts
                    pending={pending}
                    status={status}
                    isReadOnly={isReadOnly}
                    closeToast={this.closeToast}
                />
            </Fragment>
        );
    }
}

AppBarContainer.propTypes = {
    drizzle: PropTypes.object.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired
};

export default props => (
    <DrizzleContext.Consumer>
        {({ drizzle }) => (
            <DataContext.Consumer>
                {({ isReadOnly, isAdmin }) => (
                    <AppBarContainer
                        drizzle={drizzle}
                        isReadOnly={isReadOnly}
                        isAdmin={isAdmin}
                        {...props}
                    />
                )}
            </DataContext.Consumer>
        )}
    </DrizzleContext.Consumer>
);
