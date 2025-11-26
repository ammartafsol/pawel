import React from "react";
import classes from "./TableHeader.module.css";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import Button from "@/components/atoms/Button";
import { IoAddCircle } from "react-icons/io5";

const TableHeader = ({ title,viewButtonText="",onClickViewAll = () => {} }) => {
  return (
    <div className={classes?.tableHeaderParent}>
      <div className={classes?.tableHeaderDrop}>
        <h4>{title}</h4>
      </div>
      <div className={classes?.tableHeaderButtons}>
      <SearchInput  />
      <Button onClick={()=>{onClickViewAll()}} className={classes?.viewAllBtn} leftIcon={<IoAddCircle size={24} />} label={viewButtonText} />
      </div>
    </div>
  );
};

export default TableHeader;
