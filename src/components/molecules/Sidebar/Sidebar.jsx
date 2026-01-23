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
import { useRouter } from "next/navigation";

const Sidebar = ({ onItemClick }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }
    const router = useRouter();
    
    const handleItemClick = (href) => {
        router.push(href);
        if (onItemClick) {
            onItemClick();
        }
    };
    
    return (
    <div  className={`${classes?.sidebar} ${!sidebarOpen && classes?.sidebarOpen}`}>
      <div onClick={() => handleItemClick("/user")} className={classes?.logo}>
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
              key={item?.href}
              icon={item?.icon}
              href={item?.href}
              title={item?.name}
              sidebarOpen={sidebarOpen}
              onItemClick={onItemClick}
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
              key={item?.href}
              icon={item?.icon}
              href={item?.href}
              title={item?.name}
              sidebarOpen={sidebarOpen}
              onItemClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
