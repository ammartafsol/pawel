"use client";
import React from "react";
import classes from "./Breadcrumbs.module.css";
import { RiHome4Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .filter((crumb) => crumb !== "user");

  return (
    <div className={classes.breadcrumbs}>
      <RiHome4Fill color="#708078" size={22} />

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            <span className={classes.slash}>/</span>

            <span className={isLast ? classes.activeCrumb : classes.crumb}>
              {decodeURIComponent(crumb)}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
