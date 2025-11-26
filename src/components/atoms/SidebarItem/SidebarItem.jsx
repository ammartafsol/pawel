"use client";
import React from "react";
import classes from "./SidebarItem.module.css";
import { usePathname, useRouter } from "next/navigation";

const SidebarItem = ({ icon, title, href,sidebarOpen }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(href)}
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
