// Libs
import React, { useState } from "react";
// Components
import Dashboard from "../../components/Dashboard/Dashboard";
// Context
import { useData } from "../../context/data";

const DashboardContainer = () => {
    const [tab, setTab] = useState("admin");
    const { dataReady } = useData();

    return <Dashboard tab={tab} setTab={setTab} dataReady={dataReady} />;
};

export default DashboardContainer;
