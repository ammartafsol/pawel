import React from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";

const DashboardTemplate = () => {
  return (
    <div>
      <div className={classes?.dashboardTemplateHeader}>
        <h4>Wednesday, February 14th</h4>
        <p>Good morning, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col md={8}>
            <Wrapper contentClassName={classes?.calenderWrapper} headerComponent={<CalenderHeaderDrop />}>
              <Calender className={classes?.calender} events={myEventsList} />
            </Wrapper>
          </Col>
          <Col md={4}>
          <div className={classes?.newCases}>
            <Row className="g-4">
              {newCasesData.map((item) => (
                <Col md={6} key={item.id}>
                  <ActionCard {...item} title={item.title} image={item.image} />
                </Col>
              ))}
            </Row>
          </div>
          </Col>
        </Row>
        <Row>
          <Wrapper title="Recent Activities">
            dsa
          </Wrapper>
        </Row>
      </div>
    </div>
  );
};

export default DashboardTemplate;
