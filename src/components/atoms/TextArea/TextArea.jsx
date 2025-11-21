import { mergeClass } from "@/resources/utils/helper";
import classes from "./TextArea.module.css";
import React from "react";

/**
 * TextArea component for multi-line text input.
 *
 * @param {Object} props
 * @param {string} [props.value=""] - The current value of the textarea.
 * @param {Function} [props.setValue=()=>{}] - Function to update the value.
 * @param {string} [props.label=""] - Label text for the textarea.
 * @param {string} [props.placeholder=""] - Placeholder text for the textarea.
 * @param {React.CSSProperties} [props.customStyle={}] - Custom styles for the textarea.
 * @param {React.CSSProperties} [props.labelStyle={}] - Custom styles for the label.
 * @param {number} [props.rows=3] - Number of rows for the textarea.
 * @param {string} [props.className=""] - Additional class for the textarea.
 * @param {string} [props.containerClass=""] - Additional class for the container.
 * @param {boolean} [props.disabled=false] - Whether the textarea is disabled.
 * @param {string} [props.labelClass=""] - Additional class for the label.
 * @param {string} [props.error=""] - Error message to display.
 * @param {React.ReactNode} [props.children] - Optional children to render below the textarea.
 * @returns {JSX.Element}
 */
export function TextArea({
  value = "",
  setValue = () => {},
  label = "",
  placeholder = "",
  customStyle = {},
  labelStyle = {},
  rows = 3,
  className = "",
  containerClass = "",
  disabled = false,
  labelClass = "",
  error = "",
  children,
  ...props
}) {
  return (
    <div className={mergeClass(classes.container, containerClass)}>
      {label && (
        <label
          htmlFor={`text-area-${label}`}
          style={{ ...labelStyle }}
          className={mergeClass(classes.label, labelClass)}
        >
          {label}
        </label>
      )}
      <textarea
        id={`text-area-${label}`}
        placeholder={placeholder}
        value={value}
        style={customStyle}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={() => {
          setValue(value?.trim());
        }}
        className={className}
        rows={rows}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className={mergeClass(`mt-1`, classes.error)}>{`*${error}`}</p>
      )}
      {children}
    </div>
  );
}
