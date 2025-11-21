"use client";
import Select from "react-dropdown-select";
import { IoChevronDown } from "react-icons/io5";
import classes from "./DropDown.module.css";
import "./styles.css";

const DropDown = ({
  // Essential Select props
  values = [],
  options = [],
  onChange,
  multi = false,
  placeholder = "Select...",
  disabled = false,
  searchable = true,
  clearable = false,
  style = {},
  className = "",
  labelField = "label",
  valueField = "value",
  loading = false,

  // Additional essential props
  color = "#0074D9",
  direction = "ltr",
  dropdownHeight = "300px",
  dropdownPosition = "bottom",
  closeOnSelect = false,
  keepSelectedInList = true,
  searchBy = "label",
  create = false,
  createNewLabel = "add {search}",
  selectAll = false,
  selectAllLabel = "Select all",
  clearAllLabel = "Clear all",

  // Callbacks
  onSelect,
  onDeselect,
  onDropdownOpen,
  onDropdownClose,
  onCreateNew,
  onSelectAll,
  onClearAll,

  // Custom props for our component
  label,
  error,
  labelClassName,
  errorClassName,
  containerClassName,
  ...props
}) => {

  const dropdownHandleRenderer = ({ props, state, methods }) => {
    console.log(state);
    return (
      <div className={classes.dropdownHandle}>
        <IoChevronDown
          className={classes.dropdownHandleIcon}
          color={state.dropdown ? "#0074D9" : "var(--text-muted)"}
          style={state.dropdown ? { transform: "rotate(180deg)" } : {}}
          size={24}
        />
      </div>
    );
  };

  return (
    <div className={`${classes.container} ${containerClassName || ""}`}>
      {label && (
        <label className={`${classes.label} ${labelClassName || ""}`}>
          {label}
        </label>
      )}

      <Select
        values={values}
        options={options}
        onChange={onChange}
        onSelect={onSelect}
        onDeselect={onDeselect}
        multi={multi}
        placeholder={placeholder}
        disabled={disabled}
        searchable={searchable}
        clearable={clearable}
        style={style}
        className={className}
        labelField={labelField}
        valueField={valueField}
        loading={loading}
        color={color}
        direction={direction}
        dropdownHeight={dropdownHeight}
        dropdownPosition={dropdownPosition}
        closeOnSelect={closeOnSelect}
        keepSelectedInList={keepSelectedInList}
        searchBy={searchBy}
        create={create}
        createNewLabel={createNewLabel}
        selectAll={selectAll}
        selectAllLabel={selectAllLabel}
        clearAllLabel={clearAllLabel}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        onCreateNew={onCreateNew}
        onSelectAll={onSelectAll}
        onClearAll={onClearAll}
        dropdownHandleRenderer={dropdownHandleRenderer}
        {...props}
      />

      {error && (
        <p className={`${classes.error} ${errorClassName || ""}`}>{error}</p>
      )}
    </div>
  );
};

export default DropDown;
