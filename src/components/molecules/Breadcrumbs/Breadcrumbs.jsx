"use client";
import React from "react";
import classes from "./Breadcrumbs.module.css";
import { RiHome4Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();

  // Route label mapping
  const routeLabels = {
    "my-cases": "My Cases",
    "support-center": "Support Center",
  };

  // Check if we're on a detail page (e.g., /user/my-cases/[slug])
  const isDetailPage = pathname.match(/\/user\/my-cases\/[^/]+$/);

  // Build breadcrumbs array
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .filter((crumb) => crumb !== "user");

  const breadcrumbs = [];

  // Process each segment
  pathSegments.forEach((segment, index) => {
    // If we're on a detail page and this is the last segment (the slug), replace it with "Case Details"
    if (isDetailPage && index === pathSegments.length - 1) {
      breadcrumbs.push("Case Details");
    } else {
      // Use mapped label or capitalize the segment
      const label = routeLabels[segment] || segment;
      breadcrumbs.push(label);
    }
  });

  return (
    <div className={classes.breadcrumbs}>
      <RiHome4Fill color="#708078" size={22} />

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            <span className={classes.slash}>/</span>

            <span className={isLast ? classes.activeCrumb : classes.crumb}>
              {crumb}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
