import React from "react";
import classes from "./StaffLayout.module.css";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { MdNotifications } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const StaffLayout = ({ children }) => {
  return (
    <div className={classes?.staffLayout}>
      <Sidebar />
      <div className={classes?.rightSide}>
        {/*  right side header */}
        <div className={classes?.rightSideHeader}>
          <div className={classes?.mainIcon}>
            <div className={classes?.icon}>
              <MdNotifications size={22} color="var(--white)" />
            </div>
            <div className={classes?.icon}>
              <CgProfile size={22} color="var(--white)" />
            </div>
          </div>
        </div>
        <div className={classes?.rightSideContent}>{children}</div>
      </div>
    </div>
  );
};

export default StaffLayout;
