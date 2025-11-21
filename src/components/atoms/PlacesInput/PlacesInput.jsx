import React from "react";
import Autocomplete from "react-google-autocomplete";
import styles from "./PlacesInput.module.css";
import config from "@/config";
import { mergeClass } from "@/resources/utils/helper";

/**
 * PlacesInput component for Google Places Autocomplete input.
 *
 * @param {Object} props
 * @param {string} [props.label=""] - Label text for the input.
 * @param {string} [props.placeholder="Search for a location"] - Placeholder text.
 * @param {string} [props.value=""] - Input value.
 * @param {function} [props.onChange=()=>{}] - Function to handle input change.
 * @param {function} [props.onPlaceSelected=()=>{}] - Function called when a place is selected.
 * @param {string} [props.error=""] - Error message to display.
 * @param {string} [props.containerClass=""] - Additional class for the container.
 * @param {string} [props.inputClass=""] - Additional class for the input element.
 * @param {React.CSSProperties} [props.inputStyles={}] - Additional styles for the input element.
 * @param {boolean} [props.disabled=false] - If true, disables the input.
 * @param {string} [props.apiKey] - Google Maps API key.
 * @param {Object} [props.options={}] - Additional options for Autocomplete.
 * @param {React.ReactNode} [props.leftIcon=null] - Icon to display on the left.
 * @param {React.ReactNode} [props.rightIcon=null] - Icon to display on the right.
 * @returns {JSX.Element}
 */
const PlacesInput = ({
  label = "",
  placeholder = "Search for a location",
  value = "",
  onChange = () => {},
  onPlaceSelected = () => {},
  error = "",
  containerClass = "",
  inputStyles = {},
  inputClass = "",
  disabled = false,
  apiKey = config.GOOGLE_MAP_KEY_API || "", // Google Maps API key
  options = {}, // Additional options for Autocomplete
  leftIcon = null,
  rightIcon = null,
  ...props
}) => {
  // Triggers when a place is selected from the autocomplete suggestions
  const handlePlaceSelected = (place) => {
    if (onPlaceSelected && place) {
      onPlaceSelected(place);
    }
  };

  return (
    <div className={mergeClass(styles.container, containerClass)}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.inputContainer}>
        {leftIcon && <div className={styles.leftIconBox}>{leftIcon}</div>}
        <Autocomplete
          apiKey={apiKey}
          onPlaceSelected={handlePlaceSelected}
          onChange={onChange}
          value={value}
          options={{
            types: ["address"],
            ...options,
          }}
          style={inputStyles}
          className={mergeClass(
            styles.inputClass,
            leftIcon && styles.withLeftIcon,
            rightIcon && styles.withRightIcon,
            inputClass
          )}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />

        {rightIcon && <div className={styles.rightIconBox}>{rightIcon}</div>}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default PlacesInput;
