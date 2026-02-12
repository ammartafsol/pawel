"use client";

import React from "react";
import PropTypes from "prop-types";
import classes from "./DeadlinePhaseLabel.module.css";

/**
 * Shows the phase name for a deadline row (e.g. "Filing Opposition", "Cooling-off Period").
 * Used on the left side of each deadline row in CreateNewCaseModal / Update Deadlines.
 */
const DeadlinePhaseLabel = ({ phaseName, bgColor, color, className }) => {
  if (!phaseName) return null;

  const style =
    bgColor != null || color != null
      ? {
          backgroundColor: bgColor ?? "#f5f5f5",
          color: color ?? "#000000",
        }
      : undefined;

  return (
    <div className={`${classes.wrapper} ${className || ""}`}>
      <span title={phaseName} className={classes.label} style={style}>
        {phaseName}
      </span>
    </div>
  );
};

DeadlinePhaseLabel.propTypes = {
  phaseName: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
};

DeadlinePhaseLabel.defaultProps = {
  phaseName: "",
  bgColor: undefined,
  color: undefined,
  className: "",
};

export default DeadlinePhaseLabel;
