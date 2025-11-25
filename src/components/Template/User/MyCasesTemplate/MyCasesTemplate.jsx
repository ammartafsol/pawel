"use client";
import React, { useState } from "react";
import classes from "./MyCasesTemplate.module.css";
import Breadcrumbs from "@/components/molecules/Breadcrumbs/Breadcrumbs";
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
          >
            <ResponsiveTable />
          </Wrapper>
        </div>
      ) : (
        <Row className="g-4">
          {caseProgressCardsData.map((item) => (
            <Col className="col-12 col-md-4" key={item.id}>
              <CaseProgressCard
                data={{
                  tabLabel: item.tabLabel,
                  userName: item.userName,
                  progress: item.progress,
                  status: item.status,
                  trademarkName: item.trademarkName,
                  trademarkNo: item.trademarkNo,
                  referenceLink: item.referenceLink,
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MyCasesTemplate;
