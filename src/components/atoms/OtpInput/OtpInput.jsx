"use client";
import React, { useRef } from "react";
import classes from "./OtpInput.module.css";

/**
 * OtpInput component for entering OTP codes.
 *
 * @param {Object} props
 * @param {string} [props.value=""] - Current OTP value.
 * @param {function} [props.onChange=()=>{}] - Function to handle OTP change.
 * @param {number} [props.length=6] - Number of OTP input fields.
 * @param {boolean} [props.disabled=false] - If true, disables the input.
 * @param {string} [props.className=""] - Additional class names for the container.
 * @returns {JSX.Element}
 */
const OtpInput = ({ value = "", onChange, length = 6, disabled = false, className = "" }) => {
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const otpArr = value.split("");
    otpArr[idx] = val[val.length - 1];
    const newOtp = otpArr.join("").padEnd(length, "");
    onChange(newOtp);

    if (val && idx < length - 1) {
      inputs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const otpArr = value.split("");
        otpArr[idx] = "";
        onChange(otpArr.join(""));
      } else if (idx > 0) {
        inputs.current[idx - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputs.current[idx + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (pastedData) {
      onChange(pastedData.padEnd(length, ""));
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`${classes.otpContainer} ${className}`}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={classes.otpInput}
          value={value[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default OtpInput;

