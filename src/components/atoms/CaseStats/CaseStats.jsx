"use client";
import React from "react";
import classes from "./CaseStats.module.css";

const CaseStats = ({ statsData = [], className }) => {
  if (!statsData || statsData.length === 0) {
    return null;
  }

  return (
    <div className={`${classes.statsContainer} ${className || ""}`}>
      {statsData.map((stat, index) => (
        <div key={index} className={classes.statItem}>
          <h4>{stat.value}</h4>
          <p>{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

export default CaseStats;

