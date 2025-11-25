import React from "react";
import classes from "./BreadComTop.module.css";
import Breadcrumbs from "@/components/molecules/Breadcrumbs/Breadcrumbs";
import GridFilter from "@/components/molecules/GridFilter/GridFilter";

const BreadComTop = ({ statesCaseData = [] }) => {
  return (
    <div className={classes.breadComTop}>
      <Breadcrumbs />
     {
      statesCaseData.length>0 &&(
        <div className={classes.totalCasesContainer}>
        {statesCaseData.map((item) => (
          <div className={classes.totalCases}>
            <h4>{item.value}</h4>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      ) 
     }
    
    </div>
  );
};

export default BreadComTop;
