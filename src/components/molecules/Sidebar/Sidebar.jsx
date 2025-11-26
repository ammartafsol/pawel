"use client";
import React, { useState } from "react";
import classes from "./Sidebar.module.css";
import Image from "next/image";
import { CiGrid41 } from "react-icons/ci";
import SidebarItem from "@/components/atoms/SidebarItem/SidebarItem";
import {
  StaffHeaderData,
  StaffToolsData,
} from "@/developementContent/Data/HeaderData/HeaderData";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }
  return (
    <div className={`${classes?.sidebar} ${!sidebarOpen && classes?.sidebarOpen}`}>
      <div className={classes?.logo}>
        <Image src="/app-images/logo.png" alt="logo" fill />
      </div>
      <div className={classes?.iconContainer}>
        {
            sidebarOpen ? (
                <div onClick={toggleSidebar} className={classes?.forwardIcon}>
                    <Image src="/svgs/back.svg" alt="sidebar-bg" fill />
                </div>
            ) : (
                <div onClick={toggleSidebar} className={classes?.forwardIcon}>
                    <Image src="/svgs/forward.svg" alt="sidebar-bg" fill />
                </div>
            )
        }
       
      </div>
      <div className={classes?.sidebarItems}>
        {StaffHeaderData?.map((item) => {
          return (
            <SidebarItem
              icon={item?.icon}
              href={item?.href}
              title={item?.name}
              sidebarOpen={sidebarOpen}
            />
          );
        })}
      </div>
      {
        sidebarOpen && (
            <h6>Tools</h6>)
      }
      <div className={classes?.sidebarItems}>
        {StaffToolsData?.map((item) => {
          return (
            <SidebarItem
              icon={item?.icon}
              href={item?.href}
              title={item?.name}
              sidebarOpen={sidebarOpen}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
