"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./MyCaseDetailTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import { Col, Row } from "react-bootstrap";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TabFilter from "@/components/molecules/TabFilter/TabFilter";
import { caseDetailTabs } from "@/developementContent/Enums/enum";
import Notes from "@/components/molecules/Notes/Notes";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";

const MyCaseDetailTemplate = ({ slug }) => {
  const [activeTab, setActiveTab] = useState(caseDetailTabs[0].value);

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className={classes.notesContainer}>
            <Notes />
          </div>
        );
      case "activityLog":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDiv}>
              <h5>Recent activities</h5>
            </div>
            <div className={classes.activityListContainer}>
              <ActivityLog
                activities={[
                  { text: "Status update to Defense", date: "May 1, 2025" },
                  {
                    text: "Status update to Evidence Round Opponent",
                    date: "May 15, 2025",
                  },
                  { text: "Document Upload", date: "May 15, 2025" },
                  { text: "Status update to Hearing", date: "May 17, 2025" },
                  { text: "Document Upload", date: "May 18, 2025" },
                ]}
              />
            </div>
          </div>
        );
      case "documents":
        return (
         <div className={classes.activityLogContainer}>
            <div className={classes.headingDiv}>
              <h5>Case documents</h5>
            </div>
            <div className={classes.docListContainer}>
             
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
          <Wrapper
            contentClassName={classes?.contentClassName}
            headerComponent={
              <TabFilter
                tabs={caseDetailTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          >
            {renderTabContent()}
          </Wrapper>
        </Col>
      </Row>
    </div>
  );
};

MyCaseDetailTemplate.propTypes = {
  slug: PropTypes.string,
};

export default MyCaseDetailTemplate;
