"use client";
import React from "react";
import classes from "./DetailActionsWithStats.module.css";
import Status from "@/components/atoms/Status/Status";
import Button from "@/components/atoms/Button";
import { MdOutlineEdit } from "react-icons/md";
import CaseStats from "@/components/atoms/CaseStats/CaseStats";

const DetailActionsWithStats = ({
  statusLabel = "Active",
  statusVariant = "success",
  onDeactivate,
  onEdit,
  deactivateLabel = "Deactivate",
  editLabel = "Edit",
  statsData = [],
  className,
  statusClassName,
  deactivateButtonClassName,
  editButtonClassName,
}) => {
  return (
    <div className={`${classes.container} ${className || ""}`}>
      <div className={classes.actionsContainer}>
        <Status
          label={statusLabel}
          variant={statusVariant}
          className={`${classes.status} ${statusClassName || ""}`}
        />
        <Button
          label={deactivateLabel}
          className={`${classes.deactivateButton} ${deactivateButtonClassName || ""}`}
          onClick={onDeactivate}
        />
        <Button
          label={editLabel}
          leftIcon={<MdOutlineEdit />}
          variant="outlined"
          className={`${classes.editButton} ${editButtonClassName || ""}`}
          onClick={onEdit}
        />
      </div>
      <CaseStats statsData={statsData} />
    </div>
  );
};

export default DetailActionsWithStats;

