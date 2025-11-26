import React from "react";
import classes from "./StaffLayout.module.css";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";

const StaffLayout = ({ children }) => {
  return (
    <div className={classes?.staffLayout}>
      <Sidebar />
      <div className={classes?.rightSide}>
        {/*  right side header */}
        <div className={classes?.rightSideHeader}>hhlhewiouewro</div>
        <div className={classes?.rightSideContent}>{children}</div>
      </div>
    </div>
  );
};

export default StaffLayout;
