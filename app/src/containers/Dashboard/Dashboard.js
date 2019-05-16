// Libs
import React, { Component } from "react";
// Components
import Dashboard from "../../components/Dashboard/Dashboard";

class DashboardContainer extends Component {
    state = {
        adminTab: true
    };

    goToTab = adminTab => () => this.setState({ adminTab });

    render() {
        const { adminTab } = this.state;

        return <Dashboard goToTab={this.goToTab} adminTab={adminTab} />;
    }
}

export default DashboardContainer;
