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
          <CaseProgressCard />
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
