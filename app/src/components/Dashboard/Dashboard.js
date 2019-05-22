// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import Choices from "./Choices";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
// Constants
import { ADMIN_TAB, ENODE_TAB } from "../../constants/tabs";
import AdminTab from "../../containers/Tabs/Admin";
import EnodeTab from "../../containers/Tabs/Enode";

const Dashboard = ({ tab, setTab, dataReady }) => (
    <Fragment>
        <Choices setTab={setTab} tab={tab} />
        {!dataReady ? (
            <LoadingPage />
        ) : tab === ADMIN_TAB ? (
            <AdminTab />
        ) : tab === ENODE_TAB ? (
            <EnodeTab />
        ) : null}
    </Fragment>
);

Dashboard.propTypes = {
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    dataReady: PropTypes.bool.isRequired
};

export default Dashboard;
