"use client";

import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import classes from "./ReferenceTag.module.css";

/**
 * Reusable reference tag/chip. Shows a label with optional close icon.
 * @param {string} label - Text to display in the tag
 * @param {function} [onRemove] - If provided, shows close icon and calls onRemove when clicked (e.g. in Create New Case modal)
 * @param {string} [className] - Optional extra class for the root element
 */
export default function ReferenceTag({ label, onRemove, className = "" }) {
  const displayLabel = typeof label === "string" ? label : label?.label ?? String(label ?? "");

  return (
    <div className={`${classes.referenceTag} ${className}`.trim()}>
      <span className={classes.referenceTagText}>{displayLabel}</span>
      {onRemove && (
        <button
          type="button"
          className={classes.referenceTagClose}
          onClick={onRemove}
          aria-label="Remove reference"
        >
          <IoCloseOutline size={18} />
        </button>
      )}
    </div>
  );
}
