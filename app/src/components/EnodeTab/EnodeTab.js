// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import EnodeTable from "./Table";
import AddModal from "../../containers/Modals/Add";
import RemoveModal from "../../containers/Modals/Remove";
import LockModal from "../Modals/Lock";
import Toasts from "../Toasts/Toasts";
// Constants
import { addEnodeDisplay, removeEnodeDisplay } from "../../constants/modals";

const EnodeTab = ({
    list,
    toasts,
    closeToast,
    userAddress,
    modals,
    toggleModal,
    handleAdd,
    handleRemove,
    handleLock,
    isAdmin,
    isReadOnly,
    deleteTransaction,
    isValid,
    pendingLock
}) => (
    <Fragment>
        <Toasts toasts={toasts} closeToast={closeToast} />
        <EnodeTable
            list={list}
            userAddress={userAddress}
            toggleModal={toggleModal}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}
            pendingLock={pendingLock}
            isReadOnly={isReadOnly}
        />
        <AddModal
            isOpen={modals.add && isAdmin && !isReadOnly}
            closeModal={toggleModal("add")}
            handleAdd={handleAdd}
            display={addEnodeDisplay}
            isValid={isValid}
        />
        <RemoveModal
            isOpen={modals.remove && isAdmin && !isReadOnly}
            value={modals.remove}
            closeModal={toggleModal("remove")}
            handleRemove={handleRemove}
            display={removeEnodeDisplay(modals.remove)}
        />
        <LockModal
            isOpen={modals.lock && isAdmin}
            closeModal={toggleModal("lock")}
            handleLock={handleLock}
            isReadOnly={isReadOnly}
        />
    </Fragment>
);

EnodeTab.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
    closeToast: PropTypes.func.isRequired,
    userAddress: PropTypes.string,
    modals: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleLock: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    deleteTransaction: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    pendingLock: PropTypes.bool.isRequired
};

export default EnodeTab;
