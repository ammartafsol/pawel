"use client";
import React from "react";
import classes from "./SidebarItem.module.css";
import { usePathname, useRouter } from "next/navigation";

const SidebarItem = ({ icon, title, href, sidebarOpen, onItemClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const router = useRouter();
  
  const handleClick = () => {
    router.push(href);
    if (onItemClick) {
      onItemClick();
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className={`${classes?.sidebarItem} ${isActive && classes?.active}`}
    >
      <div>{icon}</div>
      {
        sidebarOpen && 
      <h5>{title}</h5>
      }
    </div>
  );
};

export default SidebarItem;
