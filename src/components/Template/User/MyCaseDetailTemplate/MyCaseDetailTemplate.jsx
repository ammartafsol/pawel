import React from "react";
import classes from "./MyCaseDetailTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import { Col, Row } from "react-bootstrap";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";

const MyCaseDetailTemplate = ({ slug }) => {
  return (
    <div>
      <BreadComTop />
      <Row>
        <Col md={4}>
          <CaseProgressCard
            data={{
              tabLabel: "EU TM OPPO",
              userName: "Assigned Staff",
              progress: 80,
              status: "Decision",
              trademarkName: "A and Sons",
              trademarkNo: "R-3526",
              referenceLink: "#",
              primaryStaff: "Roxanne Gleichner",
              secondaryStaff: "Roxanne Gleichner",
              jurisdiction: "EUIPO",
            }}
            isAssignedStaffVariant={true}
          />
        </Col>
        <Col md={8}>
          <Wrapper
            contentClassName={classes?.contentClassName}
            title="Recent Case Statuses"
          >
            <Calender events={myEventsList} className={classes.calender} />
          </Wrapper>
        </Col>
      </Row>
    </div>
  );
};

export default MyCaseDetailTemplate;
