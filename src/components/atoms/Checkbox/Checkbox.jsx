"use client";
import React from "react";
import { mergeClass } from "@/resources/utils/helper";
import classes from "./Checkbox.module.css";

/**
 * Checkbox component for user selection.
 *
 * @param {Object} props
 * @param {boolean} [props.checked=false] - Whether the checkbox is checked.
 * @param {function} [props.onChange=()=>{}] - Function to handle checkbox change.
 * @param {string} [props.label=""] - Label text for the checkbox.
 * @param {boolean} [props.disabled=false] - If true, disables the checkbox.
 * @param {string} [props.name=""] - Name attribute for the checkbox.
 * @param {string} [props.value=""] - Value attribute for the checkbox.
 * @param {string} [props.id=""] - ID attribute for the checkbox.
 * @param {string} [props.className=""] - Additional class names for the container.
 * @param {string} [props.checkboxClass=""] - Additional class names for the checkbox input.
 * @param {string} [props.labelClass=""] - Additional class names for the label.
 * @param {React.CSSProperties} [props.containerStyle={}] - Inline styles for the container.
 * @param {React.CSSProperties} [props.checkboxStyle={}] - Inline styles for the checkbox.
 * @param {React.CSSProperties} [props.labelStyle={}] - Inline styles for the label.
 * @param {string} [props.error=""] - Error text to display.
 * @param {React.ReactNode} [props.children] - Children elements (alternative to label).
 * @returns {JSX.Element}
 */
const Checkbox = ({
  checked = false,
  onChange = () => {},
  label = "",
  disabled = false,
  name = "",
  value = "",
  id = "",
  className = "",
  checkboxClass = "",
  labelClass = "",
  containerStyle = {},
  checkboxStyle = {},
  labelStyle = {},
  error = "",
  children,
  ...props
}) => {
  const checkboxId = id || `checkbox-${name || value || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={mergeClass(classes.container, className)} style={containerStyle}>
      <div className={classes.checkboxWrapper}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.checked, e)}
          disabled={disabled}
          className={mergeClass(
            classes.checkbox,
            checkboxClass,
            disabled && classes.disabled
          )}
          style={checkboxStyle}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={mergeClass(
            classes.label,
            labelClass,
            disabled && classes.labelDisabled
          )}
          style={labelStyle}
        >
          {label || children}
        </label>
      </div>
      {error && <p className={classes.error}>*{error}</p>}
    </div>
  );
};

export default Checkbox;

