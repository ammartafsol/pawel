"use client";
import React from "react";
import classes from "./DashboardTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import ModalSkeleton from "@/components/organisms/Modals/ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import { Col, Row } from "react-bootstrap";

const DashboardTemplate = () => {
  // Sample events data - events shown in time slots
  const myEventsList = [
    {
      start: new Date(2025, 10, 28, 10, 0),
      end: new Date(2025, 10, 28, 11, 0), /// should be 2025, 10, 28, 11, 0
      title: "Event 1",
    },
    {
      start: new Date(2025, 10, 28, 12, 0),
      end: new Date(2025, 10, 28, 13, 0),
      title: "Event 2",
    },
    {
      start: new Date(2025, 10, 28, 10, 0),
      end: new Date(2025, 10, 28, 11, 0), /// should be 2025, 10, 28, 11, 0
      title: "Event 1",
    },
    {
      start: new Date(2025, 10, 28, 12, 0),
      end: new Date(2025, 10, 28, 13, 0),
      title: "Event 2",
    },
  ];

  return (
    <div>
      <Row>
        <Col className="col-12 col-md-8">
        <div className={classes.leftTop}>
          <div className={classes.dateText}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h4>Good evening, Joe.</h4>
        </div>
        </Col>
        <Col className="col-12 col-md-4">
        2
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTemplate;

{
  /* <Calender events={myEventsList} /> */
}
{
  /* <ResponsiveTable 
tableHeader={[{
  title: "Case ID",
  key: "caseId",
},{
  title: "Case Status",
  key: "caseStatus",
}]}
data={[{
  caseId: "123456",
  caseStatus: "Open",
},{
  caseId: "123456",
  caseStatus: "Open",
}]}
/> */
}
