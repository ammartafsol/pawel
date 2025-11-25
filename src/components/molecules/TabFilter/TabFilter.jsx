import React from "react";
import classes from "./TabFilter.module.css";

const TabFilter = ({ tabs = [], activeTab, setActiveTab, className = "" }) => {
  return (
    <div className={`${classes.tabFilter} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`${classes.tab} ${activeTab === tab.value ? classes.active : ""}`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabFilter;

