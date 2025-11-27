import React, { useState, useRef, useEffect } from "react";
import classes from "./TableHeader.module.css";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import Button from "@/components/atoms/Button";
import { IoAddCircle } from "react-icons/io5";
import { BiFilterAlt } from "react-icons/bi";
import DropDown from "../DropDown/DropDown";
import GridFilter from "../GridFilter/GridFilter";

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
  setSelectedDropdownValue,
  onFilterClick,
  filterOptions = [],
  gridFilter,
  activeGridFilter,
  setActiveGridFilter,
  gridFilterClassName
}) => {
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOverlayOpen(false);
      }
    };

    if (isFilterOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOverlayOpen]);

  const handleFilterIconClick = () => {
    setIsFilterOverlayOpen(!isFilterOverlayOpen);
    if (onFilterClick) {
      onFilterClick();
    }
  };

  const handleFilterOptionClick = (onClick) => {
    onClick();
    setIsFilterOverlayOpen(false);
  };



  return (
    <div className={classes?.tableHeaderParent}>
      <div className={classes?.tableHeaderDrop}>
        {titleIcon && <span className={classes?.titleIcon}>{titleIcon}</span>}
        <h4>{title}</h4>
      </div>
      <div className={classes?.tableHeaderButtons}>
        {gridFilter && activeGridFilter && setActiveGridFilter && (
          <GridFilter
            classesName={gridFilterClassName}
            gridFilter={gridFilter}
            activeGridFilter={activeGridFilter}
            setActiveGridFilter={setActiveGridFilter}
          />
        )}
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
        {(filterOptions.length > 0 || onFilterClick !== undefined) && (
          <div className={classes?.filterWrapper} ref={filterRef}>
            <div 
              className={`${classes?.filterIcon} ${isFilterOverlayOpen ? classes?.filterIconActive : ""}`} 
              onClick={handleFilterIconClick}
            >
              <BiFilterAlt size={20} color="var(--black)" />
            </div>
            {isFilterOverlayOpen && filterOptions.length > 0 && (
              <div className={classes?.filterOverlay}>
                {filterOptions.map((option, index) => (
                  <div
                    key={index}
                    className={classes?.filterOption}
                    onClick={() => handleFilterOptionClick(option.onClick || (() => {}))}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
