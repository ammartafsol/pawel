"use client";
import React, { useState } from "react";
import classes from "./DashboardTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import ModalSkeleton from "@/components/organisms/Modals/ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import { Col, Row } from "react-bootstrap";
import BannerMessage from "@/components/atoms/BannerMessage/BannerMessage";
import MainHeader from "@/components/atoms/MainHeader/MainHeader";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import { caseProgressCardsData, circularCaseProgressChartData, myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import CircularCaseProgressChart from "@/components/atoms/CircularCaseProgressChart/CircularCaseProgressChart";
import Breadcrumbs from "@/components/molecules/Breadcrumbs/Breadcrumbs";

const DashboardTemplate = () => {
  const [showBannerMessage, setShowBannerMessage] = useState(true);
  // Sample events data - events shown in time slots
 

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
          <BannerMessage
            show={showBannerMessage}
            setShow={setShowBannerMessage}
          />
          <MainHeader />
          <div className={classes.caseProgressCardsMain}>
          <Row>
            {
              caseProgressCardsData.map((item) => (
                <Col className="col-12 col-md-6" key={item.id}>
                  <CaseProgressCard data={{
                    tabLabel: item.tabLabel,
                    userName: item.userName,
                    progress: item.progress,
                    status: item.status,
                    trademarkName: item.trademarkName,
                    trademarkNo: item.trademarkNo,
                    referenceLink: item.referenceLink
                  }} />
                </Col>
              ))
            }
          </Row>
          </div>
          <Wrapper title="Recent Case Statuses">
            <Calender events={myEventsList} />
          </Wrapper>
          
        </Col>
        <Col className="col-12 col-md-4">
        <Wrapper title="Case Progress Count By Status">
        <div className={classes.circularCaseProgressChart}>
        <CircularCaseProgressChart data={circularCaseProgressChartData}/>
        </div>
          </Wrapper>
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
