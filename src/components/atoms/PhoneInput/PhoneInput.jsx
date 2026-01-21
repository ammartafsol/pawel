"use client";
import React from "react";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import classes from "./PhoneInput.module.css"; // Use Input styles
import { mergeClass } from "@/resources/utils/helper";

/**
 * PhoneInput component for phone number input.
 *
 * @param {Object} props
 * @param {string} [props.defaultCountry="pk"] - Default country code for phone input (ISO2).
 * @param {string} [props.country] - Country code for phone input (ISO2).
 * @param {string} [props.label=""] - Main label for the input.
 * @param {string} [props.label2=""] - Sub label for the input.
 * @param {string} [props.value=""] - Input value.
 * @param {function} [props.setValue] - Function to update input value.
 * @param {boolean} [props.noBorder=false] - If true, removes border from input.
 * @param {string} [props.placeholder=""] - Placeholder text.
 * @param {boolean} [props.disabled=false] - If true, disables the input.
 * @param {React.CSSProperties} [props.customStyle={}] - Inline style for input container.
 * @param {React.CSSProperties} [props.inputStyle={}] - Inline style for input element.
 * @param {React.CSSProperties} [props.labelStyle={}] - Inline style for label.
 * @param {string} [props.error=""] - Error text to display.
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left.
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right.
 * @param {React.Ref} [props.inputRef] - Ref for the input element.
 * @param {string} [props.inputClass=""] - Additional class for input element.
 * @param {function} [props.onEnterClick] - Callback for Enter key.
 * @param {string} [props.className=""] - Additional class for container.
 * @param {React.CSSProperties} [props.containerStyles={}] - Inline style for container.
 * @param {string} [props.inputContainerClass=""] - Additional class for input container.
 * @returns {JSX.Element}
 */
export default function PhoneInput({
  defaultCountry = "pk",
  country,
  label,
  label2,
  value,
  setValue,
  noBorder = false,
  placeholder = "",
  disabled = false,
  customStyle = {},
  inputStyle = {},
  labelStyle = {},
  error = "",
  leftIcon,
  rightIcon,
  inputRef,
  inputClass = "",
  onEnterClick,
  className = "",
  containerStyles = {},
  inputContainerClass = "",
  ...props
}) {
  return (
    <div
      className={mergeClass(classes.container, className)}
      style={containerStyles}
    >
      {label && (
        <label
          htmlFor={`input${label}`}
          className={mergeClass(classes.label, disabled && classes.disabled)}
          style={labelStyle}
        >
          {label} {label2 && label2}
        </label>
      )}
      <div
        className={mergeClass(classes.inputContainer, inputContainerClass)}
        style={customStyle}
      >
        {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
        <PhoneInputLib
          country={(country || defaultCountry)?.toLowerCase()}
          value={value}
          enableSearch
          countryCodeEditable={false}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(val, data) => {
            // pass both value and metadata (dialCode, countryCode, etc.)
            setValue(val || "", data);
          }}
          inputProps={{
            id: `input${label}`,
            onKeyDown: (e) => {
              ["Enter", "NumpadEnter"].includes(e.code) &&
                onEnterClick &&
                onEnterClick();
            },
            ref: inputRef,
          }}
          containerClass={mergeClass(
            inputClass,
            classes.inputClassName,
            noBorder ? classes.noBorder : ""
          )}
          inputClass=""
          buttonClass=""
          {...props}
        />
        {rightIcon && <div className={classes.rightIconBox}>{rightIcon}</div>}
      </div>
      {error && <p className={mergeClass("mt-1", classes.error)}>*{error}</p>}
    </div>
  );
}
