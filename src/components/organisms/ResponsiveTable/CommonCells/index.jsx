import { getFormattedParams } from "@/resources/utils/helper";
import clsx from "clsx";
import moment from "moment";
import classes from "./CommonCells.module.css";

const NOTES_PREVIEW_LENGTH = 35;

export const RenderNotes = ({ cellValue: item }) => {
  const full = item ? getFormattedParams(item.toString()) : "";
  const display = full || "—";
  const preview = typeof full === "string" && full.length > NOTES_PREVIEW_LENGTH
    ? `${full.slice(0, NOTES_PREVIEW_LENGTH)}....`
    : display;
  return (
    <span title={display} className={clsx(classes.notesCell)}>
      {preview}
    </span>
  );
};

export const RenderTextCell = ({ cellValue: item, bold = false }) => {
  return (
    <span title={item} className={clsx("maxLine1", classes.textCell, bold && classes.bold)}>
      {item ? getFormattedParams(item?.toString()) : item ?? "-"}
    </span>
  );
};

export const RenderDateCell = ({ cellValue: item }) => {
  if (!item || item === "Unknown Internal Deadline" || item === "Unknown Office Deadline") {
    return <span className={clsx(classes?.date, "maxLine1", classes.textCell)}>-</span>;
  }
  
  // Parse as UTC to avoid timezone conversion issues
  const date = moment.utc(item);
  return (
    <span className={clsx(classes?.date, "maxLine1", classes.textCell)}>
      {date.format("MMMM DD, YYYY")}
    </span>
  );
};

export const RenderStatusCell = ({ cellValue: item }) => {
  const isBoolean = typeof item === "boolean";
  
  const displayValue = isBoolean ? (item ? "active" : "inactive") : item;


  return (
    <span
      className={clsx(classes.status, statusClass && statusClass?.className)}
    >
      {getFormattedParams(displayValue)}
    </span>
  );
};


export const RenderPermissionsCell = ({ data, cellValue: item }) => {
  return (
    <div  className={classes.permissionsContainer}>
      <span className={classes.permissionsText}>Case Management</span>
      <div title={data?.permissions?.join(", ")} className={classes.permissionsBadge}>
        +{item}
      </div>
    </div>
  );
};