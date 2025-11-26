import React from "react";
import classes from "./Sidebar.module.css";
import Image from "next/image";
import { CiGrid41 } from "react-icons/ci";
import SidebarItem from "@/components/atoms/SidebarItem/SidebarItem";
import { StaffHeaderData, StaffToolsData } from "@/developementContent/Data/HeaderData/HeaderData";

const Sidebar = () => {
  return (
    <div className={classes?.sidebar}>
      <div className={classes?.logo}>
        <Image src="/app-images/logo.png" alt="logo" fill />
      </div>
      <div className={classes?.sidebarItems}>
        {StaffHeaderData?.map((item) => {
          return <SidebarItem icon={item?.icon} href={item?.href} title={item?.name} />;
        })}
      </div>
      <h6>Tools</h6>
      <div className={classes?.sidebarItems}>
        {StaffToolsData?.map((item) => {
          return <SidebarItem icon={item?.icon} href={item?.href} title={item?.name} />;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
