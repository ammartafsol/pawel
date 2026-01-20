import React from "react";
import classes from "./PhasePill.module.css";

const PhasePill = ({ label, bgColor, color }) => {
  const style = {
    backgroundColor: bgColor || "#ffffff",
    color: color || "#000000",
  };

  return (
    <span className={classes.phasePill} style={style} title={label}>
      {label}
    </span>
  );
};

export default PhasePill;


