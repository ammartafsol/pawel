import React from 'react';
import classes from "./EvidenceTableTop.module.css"
import DropDown from '../DropDown/DropDown';

const EvidenceTableTop = ({placeholder,selectedValue,options,setSelectedValue,title,disabled=false}) => {
  // Convert selectedValue to array format expected by DropDown
  const valuesArray = Array.isArray(selectedValue) 
    ? selectedValue 
    : (selectedValue ? [selectedValue] : []);

  return (
    <div className={classes.evidenceTableTop}>
        <h4>{title}</h4>
        <div className={classes.dropdownContainer}>
          <DropDown 
            centeredLabel="Current Status"
            placeholder={placeholder}
            options={options}
            disabled={disabled}
            values={valuesArray}
            onChange={(value) => {
                // react-dropdown-select returns an array, extract first item for single select
                if (setSelectedValue) {
                  setSelectedValue(value && value.length > 0 ? value[0] : null);
                }
            }}
            containerClassName={classes.dropdownWrapper}
            closeOnSelect={true}
          />
        </div>
    </div>
  )
}

export default EvidenceTableTop