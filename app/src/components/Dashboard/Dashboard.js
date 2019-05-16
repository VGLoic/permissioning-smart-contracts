// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import Choices from "./Choices";
import AdminTable from "../../containers/AdminTable/AdminTable";
import WhitelistTable from "../../containers/WhitelistTable/WhitelistTable";

const Dashboard = ({ goToTab, adminTab }) => (
    <Fragment>
        <Choices goToTab={goToTab} adminTab={adminTab} />
        {adminTab && <AdminTable />}
        {!adminTab && <WhitelistTable />}
    </Fragment>
);

Dashboard.propTypes = {
    goToTab: PropTypes.func.isRequired,
    adminTab: PropTypes.bool.isRequired
};

export default Dashboard;
