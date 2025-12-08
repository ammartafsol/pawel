"use client";
import React, { useState } from "react";
import classes from "./MyCasesTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import {
  caseProgressCardsData,
  statesCaseData,
} from "@/developementContent/Data/dummtData/dummyData";
import { gridFilter } from "@/developementContent/Enums/enum";
import GridFilter from "@/components/molecules/GridFilter/GridFilter";
import { Col, Row } from "react-bootstrap";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { myUserCaseTableHeader } from "@/developementContent/TableHeader/MyCasesTableHeader";
import { myCasesTableBody } from "@/developementContent/TableBody/MyCasesTableBody";

const MyCasesTemplate = () => {
  const [activeGridFilter, setActiveGridFilter] = useState(gridFilter[0]);
  const [searchValue, setSearchValue] = useState("");
  return (
    <>
      <BreadComTop statesCaseData={statesCaseData} />
      <GridFilter
        classesName={classes.gridFilter}
        gridFilter={gridFilter}
        activeGridFilter={activeGridFilter}
        setActiveGridFilter={setActiveGridFilter}
      />
      {activeGridFilter.value === "table" ? (
        <div>
          <Wrapper
            title="My Cases"
            searchValue={searchValue}
            setValue={setSearchValue}
            searchPlaceholder="Search"
            className={classes.wrapper}
            contentClassName={classes.contentClassName}
          >
            <ResponsiveTable
              tableHeader={myUserCaseTableHeader}
              data={myCasesTableBody}
            />
          </Wrapper>
        </div>
      ) : (
        <Row className="g-4">
          {caseProgressCardsData.map((item) =>{
            return(
              <Col className="col-12 col-md-4" key={item.id}>
              <CaseProgressCard
              routePath={`/user/my-cases/${item.id}`}
                data={{
                  tabLabel: item.tabLabel,
                  userName: item.userName,
                  progress: item.progress,
                  status: item.status,
                  trademarkName: item.trademarkName,
                  trademarkNo: item.trademarkNo,
                  officeDeadline: item.officeDeadline,
                }}
               showReference={false}
                />
            </Col>
            )
          })}
        </Row>
      )}
    </>
  );
};

export default MyCasesTemplate;
