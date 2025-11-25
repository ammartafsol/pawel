import React from "react";
import classes from "./MainHeader.module.css";
import Button from "../Button";
import { IoAddCircleSharp } from "react-icons/io5";

const MainHeader = ({
  title,
  viewAllBtnText,
  viewAllBtnIcon,
  onClickViewAll = () => {},
}) => {
  return (
    <div className={classes.mainHeader}>
      <h4>Overview Case Progresses</h4>
      <Button
        className={classes.viewAllBtn}
        onClick={() => {
          onClickViewAll;
        }}
        label="View All"
        leftIcon={<IoAddCircleSharp size={25} />}
      />
    </div>
  );
};

export default MainHeader;
