import React from "react";
import classes from "./BreadComTop.module.css";
import Breadcrumbs from "@/components/molecules/Breadcrumbs/Breadcrumbs";
import GridFilter from "@/components/molecules/GridFilter/GridFilter";
import CaseStats from "@/components/atoms/CaseStats/CaseStats";

const BreadComTop = ({ statesCaseData = [] }) => {
  return (
    <div className={classes.breadComTop}>
      <Breadcrumbs />
      <CaseStats statsData={statesCaseData} />
    </div>
  );
};

export default BreadComTop;
