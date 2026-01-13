"use client";
import React from "react";
import classes from "./VisibilityBadge.module.css";

/**
 * VisibilityBadge component displays visibility badges based on permissions
 * 
 * @param {Object} props
 * @param {Array<string>} [props.permissions=[]] - Array of permission strings (e.g., ["visible-to-client", "visible-to-staff"])
 * @param {string} [props.className=""] - Additional class names for the container
 * @returns {JSX.Element}
 */
export default function VisibilityBadge({ permissions = [], className = "" }) {
  const hasClientPermission = permissions?.includes("visible-to-client");
  const hasStaffPermission = permissions?.includes("visible-to-staff");

  // Don't render anything if no permissions
  if (!hasClientPermission && !hasStaffPermission) {
    return null;
  }

  return (
    <div className={`${classes.visibilityBadges} ${className}`}>
      {hasClientPermission && (
        <span className={classes.visibilityBadge}>Visible to client</span>
      )}
      {hasStaffPermission && (
        <span className={classes.visibilityBadge}>Visible to staff</span>
      )}
    </div>
  );
}

