"use client";

import { mergeClass } from "@/resources/utils/helper";
import React from "react";
import classes from "./DatePicker.module.css";

import DatePickerInput from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/colors/purple.css";

/**
 * DatePicker component for selecting single or multiple dates.
 *
 * @param {Object} props
 * @param {string} [props.dir="ltr"] - Direction of the container.
 * @param {string} [props.dateFormat="DD/MM/YYYY"] - Date format for the picker.
 * @param {string} [props.label=""] - Main label for the date picker.
 * @param {string} [props.label2=""] - Sub label for the date picker.
 * @param {Date|Date[]|null} [props.value=null] - Selected date value(s).
 * @param {function} [props.setValue=()=>{}] - Function to update date value(s).
 * @param {boolean} [props.noBorder=false] - If true, removes border from input.
 * @param {string} [props.placeholder=""] - Placeholder text.
 * @param {boolean} [props.disabled=false] - If true, disables the input.
 * @param {React.CSSProperties} [props.customStyle={}] - Inline style for input container.
 * @param {React.CSSProperties} [props.inputStyle={}] - Inline style for input element.
 * @param {React.CSSProperties} [props.labelStyle={}] - Inline style for label.
 * @param {string} [props.error=""] - Error text to display.
 * @param {React.ReactNode} [props.leftIcon=null] - Icon to display on the left.
 * @param {React.ReactNode} [props.rightIcon=null] - Icon to display on the right.
 * @param {React.Ref} [props.inputRef=null] - Ref for the input element.
 * @param {string} [props.inputClass=""] - Additional class for input element.
 * @param {function} [props.onEnterClick=()=>{}] - Callback for Enter key.
 * @param {string} [props.className=""] - Additional class for container.
 * @param {React.CSSProperties} [props.containerStyles={}] - Inline style for container.
 * @param {string} [props.containerClass=""] - Additional class for input container.
 * @param {string} [props.variant=""] - Variant for styling.
 * @param {boolean} [props.multi=false] - If true, enables multi-date selection.
 * @param {string|Date} [props.minDate] - Minimum selectable date.
 * @param {string|Date} [props.maxDate] - Maximum selectable date.
 * @param {string} [props.dateSeparator=" , "] - Separator for multiple dates display.
 * @returns {JSX.Element}
 */
export default function DatePicker({
  dir = "ltr",
  dateFormat = "DD/MM/YYYY",
  label = "",
  label2 = "",
  value = null,
  setValue = () => {},
  noBorder = false,
  placeholder = "",
  disabled = false,
  customStyle = {},
  inputStyle = {},
  labelStyle = {},
  error = "",
  leftIcon = null,
  rightIcon = null,
  inputRef = null,
  inputClass = "",
  onEnterClick = () => {},
  className = "",
  containerStyles = {},
  containerClass = "",
  variant = "",
  multi = false,
  minDate,
  maxDate,
  dateSeparator = " , ",
  ...props
}) {
  return (
    <>
      <div
        dir={dir}
        className={mergeClass(classes.container, className)}
        data-variant={variant}
        style={containerStyles}
      >
        {label && (
          <label
            htmlFor={`input${label}`}
            className={mergeClass(
              classes.labelText,
              disabled && classes.disabled
            )}
            style={labelStyle}
          >
            {label} {label2 && label2}
          </label>
        )}
        <div
          className={mergeClass(classes.inputContainer, containerClass)}
          style={customStyle}
        >
          {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}

          <DatePickerInput
            plugins={[<DatePanel />]}
            dateSeparator={dateSeparator}
            type="button"
            multiple={multi}
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            format={dateFormat}
            inputClass={classes.inputClass}
            style={{ ...inputStyle, ...(leftIcon && { paddingLeft: 50 }) }}
            ref={inputRef}
            id={`input${label}`}
            onKeyDownCapture={(e) => {
              ["Enter", "NumpadEnter"].includes(e.code) &&
                onEnterClick &&
                onEnterClick();
            }}
            {...props}
          />
          {rightIcon && <div className={classes.rightIconBox}>{rightIcon}</div>}
        </div>
        {error && (
          <p className={`mt-1 ${[classes.errorText].join(" ")}`}>*{error}</p>
        )}
      </div>
    </>
  );
}
