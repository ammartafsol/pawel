"use client";
import { mergeClass } from "@/resources/utils/helper";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import classes from "./Input.module.css";

/**
 * Input component for user text, password, or number entry.
 *
 * @param {Object} props
 * @param {string} [props.type="text"] - Input type ("text", "password", "number", etc.).
 * @param {string} [props.label=""] - Main label for the input.
 * @param {string} [props.label2=""] - Sub label for the input.
 * @param {string|number} [props.value=""] - Input value.
 * @param {function} [props.setValue=()=>{}] - Function to update input value.
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
 * @returns {JSX.Element}
 */
export default function Input({
  type = "text",
  label = "",
  label2 = "", // sub label
  value = "", // input value
  setValue = () => {}, //setValue
  noBorder = false,
  placeholder = "",
  disabled = false,
  customStyle = {}, //Input container inline Style
  inputStyle = {}, //Input inline Style
  labelStyle = {}, //Label inline Style
  error = "", // Error Text
  leftIcon = null, // Icon For Input
  rightIcon = null,
  inputRef = null,
  inputClass = "",
  onEnterClick = () => {},
  className = "",
  containerStyles = {},
  containerClass = "",
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        className={mergeClass(classes.container, className)}
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
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={disabled}
            placeholder={placeholder}
            type={show == true ? "text" : type}
            id={`input${label}`}
            className={mergeClass(
              inputClass,
              classes.inputClassName,
              noBorder && classes.noBorder
            )}
            style={{ ...inputStyle, ...(leftIcon && { paddingLeft: 50 }) }}
            onKeyDownCapture={(e) => {
              ["Enter", "NumpadEnter"].includes(e.code) &&
                onEnterClick &&
                onEnterClick();
            }}
            onBlur={() => {
              if (
                typeof value === "string" &&
                (type === "text" || type === "") &&
                setValue
              ) {
                setValue(value?.trim());
              }
            }}
            ref={inputRef}
            {...props}
            onKeyDown={(e) => {
              if (type == "number") {
                return (
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                );
              }
            }}
          />

          {rightIcon && <div className={classes.rightIconBox}>{rightIcon}</div>}
          {type == "password" && show == false && (
            <FaRegEyeSlash
              className={mergeClass(classes.passwordIcon)}
              onClick={() => setShow(!show)}
              size={24}
              color="var(--black)"
            />
          )}
          {type == "password" && show && (
            <FaRegEye
              className={mergeClass(classes.passwordIcon, "pointer")}
              onClick={() => setShow(!show)}
              size={24}
              color="var(--black)"
            />
          )}
        </div>
        {error && (
          <p className={`mt-1 ${[classes.error].join(" ")}`}>*{error}</p>
        )}
      </div>
    </>
  );
}
