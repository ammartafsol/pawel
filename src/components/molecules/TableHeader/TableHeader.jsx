import React, { useState } from "react";
import classes from "./TableHeader.module.css";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import Button from "@/components/atoms/Button";
import { IoAddCircle } from "react-icons/io5";
import DropDown from "../DropDown/DropDown";

const TableHeader = ({ 
  title,
  titleIcon,
  viewButtonText = "",
  onClickViewAll = () => {},
  dropdownOptions = [],
  dropdownPlaceholder = "Select...",
  onDropdownChange = () => {},
  searchValue = "",
  onSearchChange = () => {},
  searchPlaceholder = "Search",
  selectedDropdownValue,
  setSelectedDropdownValue
}) => {



  return (
    <div className={classes?.tableHeaderParent}>
      <div className={classes?.tableHeaderDrop}>
        {titleIcon && <span className={classes?.titleIcon}>{titleIcon}</span>}
        <h4>{title}</h4>
      </div>
      <div className={classes?.tableHeaderButtons}>
        {dropdownOptions.length > 0 && (
          <div className={classes?.dropdownWrapper}>
            <DropDown 
              options={dropdownOptions}
              values={Array.isArray(selectedDropdownValue) ? selectedDropdownValue : (selectedDropdownValue ? [selectedDropdownValue] : [])}
              onChange={(value) => {
                if (setSelectedDropdownValue) {
                  // react-dropdown-select returns an array, extract first item for single select
                  setSelectedDropdownValue(value && value.length > 0 ? value[0] : null);
                }
              }}
              placeholder={dropdownPlaceholder}
              searchable={false}
              className={classes?.dropdown}
              closeOnSelect={true}
            />
          </div>
        )}
        <SearchInput 
          placeholder={searchPlaceholder}
          value={searchValue}
          setValue={onSearchChange}
        />
        {viewButtonText && (
          <Button 
            onClick={() => { onClickViewAll() }} 
            className={classes?.viewAllBtn} 
            leftIcon={<IoAddCircle size={20} color="var(--white)" />} 
            label={viewButtonText}
            variant="primary"
          />
        )}
      </div>
    </div>
  );
};

export default TableHeader;
